from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError
import os

app = Flask(__name__)
# Habilitamos CORS para que tu S3 pueda hacerle peticiones sin bloqueos
CORS(app)

# Conexión a DynamoDB (Usará el Rol IAM de la EC2 automáticamente)
dynamodb = boto3.resource('dynamodb', region_name='us-east-2')
TABLE_NAME = 'DataViewer_Files'

def asegurar_tabla():
    """Crea la tabla si no existe al arrancar el servidor"""
    try:
        table = dynamodb.create_table(
            TableName=TABLE_NAME,
            KeySchema=[
                {'AttributeName': 'filename', 'KeyType': 'HASH'},  # Partition Key
                {'AttributeName': 'row_id', 'KeyType': 'RANGE'}    # Sort Key
            ],
            AttributeDefinitions=[
                {'AttributeName': 'filename', 'AttributeType': 'S'},
                {'AttributeName': 'row_id', 'AttributeType': 'N'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        table.wait_until_exists()
    except ClientError as e:
        if e.response['Error']['Code'] != 'ResourceInUseException':
            print(f"Error comprobando tabla: {e}")

@app.route('/api/archivos', methods=['GET'])
def listar_archivos():
    """Devuelve la lista de archivos guardados únicos"""
    try:
        table = dynamodb.Table(TABLE_NAME)
        # Hacemos un Scan para sacar nombres únicos (simplificado para el proyecto)
        response = table.scan(ProjectionExpression='filename')
        nombres = list(set([item['filename'] for item in response.get('Items', [])]))
        return jsonify(nombres), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/archivos/<nombre_archivo>', methods=['GET'])
def obtener_archivo(nombre_archivo):
    """Devuelve todos los registros de un archivo específico"""
    try:
        table = dynamodb.Table(TABLE_NAME)
        response = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('filename').eq(nombre_archivo)
        )
        # Quitamos las llaves internas para devolver solo los datos
        datos = [item['data'] for item in response.get('Items', [])]
        return jsonify(datos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/guardar', methods=['POST'])
def guardar_archivo():
    """Recibe un JSON y lo guarda por lotes en DynamoDB"""
    try:
        req_data = request.json
        filename = req_data.get('filename')
        rows = req_data.get('data', [])

        if not filename or not rows:
            return jsonify({'error': 'Faltan datos'}), 400

        table = dynamodb.Table(TABLE_NAME)
        
        # Guardamos en DynamoDB usando batch_writer para mayor eficiencia
        with table.batch_writer() as batch:
            for i, row in enumerate(rows):
                batch.put_item(
                    Item={
                        'filename': filename,
                        'row_id': i,
                        'data': row # Guardamos la fila entera como un objeto anidado
                    }
                )
        return jsonify({'message': f'Se guardaron {len(rows)} registros de {filename}'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Iniciando API de DataViewer...")
    asegurar_tabla()
    app.run(host='0.0.0.0', port=80)