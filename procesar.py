import os

archivo_entrada = 'Estados.txt'
archivo_salida = 'resultado.txt'

def procesar_datos():
    print("Iniciando procesamiento de datos...")
    
    # Validar que el archivo de entrada exista
    if not os.path.exists(archivo_entrada):
        print(f"Error: El archivo {archivo_entrada} no se encontró.")
        return

    try:
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            lineas = f.readlines()
        
        resultados = ["=== REPORTE DE ESTADOS DEL SISTEMA ===\n\n"]
        estados_activos = 0
        
        for linea in lineas:
            # Separar por comas
            datos = linea.strip().split(',')
            if len(datos) == 3:
                estado, estatus, poblacion = [d.strip() for d in datos]
                resultados.append(f"-> {estado.upper()}:\n   Estatus: {estatus} | Población: {poblacion}\n")
                if estatus.lower() == 'activo':
                    estados_activos += 1
        
        resultados.append(f"\nResumen: {estados_activos} estados se encuentran Activos.")
        
        # Generar el archivo resultado.txt
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            f.writelines(resultados)
            
        print(f"¡Éxito! Archivo '{archivo_salida}' generado correctamente.")
        
    except Exception as e:
        print(f"Error durante el procesamiento: {e}")

if __name__ == "__main__":
    procesar_datos()