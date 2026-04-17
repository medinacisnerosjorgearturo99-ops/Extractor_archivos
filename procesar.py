import csv

def procesar_datos():
    total_estados = 0
    suma_temp = 0
    suma_humedad = 0
    max_costo = -1
    min_costo = float('inf')
    estado_max_costo = ""
    estado_min_costo = ""

    try:
        # Abrimos el archivo de texto simulando que es un CSV
        with open('Estados.txt', mode='r', encoding='utf-8') as file:
            reader = csv.reader(file)
            headers = next(reader, None) # Nos saltamos la primera línea (los encabezados)

            for row in reader:
                # Verificamos que la fila tenga las 7 columnas completas
                if len(row) >= 7:
                    estado = row[0].strip()
                    temp = float(row[1])
                    humedad = float(row[2])
                    costo_alojamiento = float(row[3])

                    total_estados += 1
                    suma_temp += temp
                    suma_humedad += humedad

                    # Calculamos el costo más alto
                    if costo_alojamiento > max_costo:
                        max_costo = costo_alojamiento
                        estado_max_costo = estado

                    # Calculamos el costo más bajo
                    if costo_alojamiento < min_costo:
                        min_costo = costo_alojamiento
                        estado_min_costo = estado

        # Preparamos el reporte final
        if total_estados > 0:
            promedio_temp = suma_temp / total_estados
            promedio_humedad = suma_humedad / total_estados

            reporte = (
                f"=== REPORTE DE INDICADORES POR ESTADO ===\n"
                f"Total de registros analizados: {total_estados}\n"
                f"Temperatura promedio nacional: {promedio_temp:.1f}°C\n"
                f"Humedad promedio nacional: {promedio_humedad:.1f}%\n"
                f"Estado con alojamiento más caro: {estado_max_costo} (${max_costo:,.2f})\n"
                f"Estado con alojamiento más accesible: {estado_min_costo} (${min_costo:,.2f})\n"
                f"=========================================\n"
            )
        else:
            reporte = "Error: No se encontraron datos válidos para procesar."

        # Guardamos el resultado
        with open('resultado.txt', mode='w', encoding='utf-8') as out_file:
            out_file.write(reporte)

        print("¡Éxito! Archivo 'resultado.txt' generado con el nuevo formato.")

    except FileNotFoundError:
        print("Error: No se encontró el archivo 'Estados.txt'.")
    except Exception as e:
        print(f"Ocurrió un error al procesar los datos: {e}")

if __name__ == '__main__':
    print("Iniciando procesamiento de datos...")
    procesar_datos()