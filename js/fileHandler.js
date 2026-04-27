const fileInput = document.getElementById('file-input');
const fileNameDisplay = document.getElementById('file-name');

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    fileNameDisplay.textContent = file.name; // Mostrar el nombre del archivo subido
    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        const extension = file.name.split('.').pop().toLowerCase();

        // --- NUEVAS LÍNEAS PARA LA INTEGRACIÓN CON BD ---
        // Asignamos el nombre a la variable global que usa apiManager.js
        currentFileName = file.name; 
        
        // Habilitamos el botón de guardar
        const saveDbBtn = document.getElementById('btn-save-db');
        if (saveDbBtn) saveDbBtn.disabled = false;
        // ------------------------------------------------

        if (extension === 'csv') {
            Papa.parse(content, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    renderTable(results.data); // Llama a la función de tableManager.js
                }
            });
        } else if (extension === 'json') {
            try {
                const jsonData = JSON.parse(content);
                // Nos aseguramos de que sea un array para poder iterarlo
                const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
                renderTable(dataArray);
            } catch (error) {
                alert("El archivo JSON no tiene un formato válido.");
            }
        } else if (extension === 'txt') {
            // Leemos el TXT sin encabezados primero para analizarlo
            Papa.parse(content, {
                header: false,
                skipEmptyLines: true,
                complete: function(results) {
                    const rawData = results.data;
                    if (rawData.length === 0) return;

                    let hasHeader = false;

                    // Lógica para deducir si la primera fila es un encabezado
                    if (rawData.length > 1) {
                        const row0 = rawData[0]; // Posibles encabezados
                        const row1 = rawData[1]; // Posible primera fila de datos
                        
                        // Revisamos columna por columna
                        for (let i = 0; i < row0.length; i++) {
                            const isRow0Text = isNaN(Number(row0[i])); // true si es texto
                            const isRow1Number = !isNaN(Number(row1[i].trim())); // true si es número
                            
                            // Si arriba hay texto y abajo hay un número, ¡bingo! Es un encabezado.
                            if (isRow0Text && isRow1Number && row1[i].trim() !== '') {
                                hasHeader = true;
                                break; // Ya confirmamos, salimos del ciclo
                            }
                        }
                    }

                    let finalData = [];
                    
                    if (hasHeader) {
                        // Usamos la fila 0 como nombres de columnas
                        const headers = rawData[0].map(h => h.trim());
                        for (let i = 1; i < rawData.length; i++) {
                            let obj = {};
                            rawData[i].forEach((val, index) => {
                                // Mapeamos los datos con su respectivo encabezado
                                obj[headers[index] || `Columna ${index + 1}`] = val; 
                            });
                            finalData.push(obj);
                        }
                    } else {
                        // Si no parece tener encabezados, usamos el formato genérico
                        finalData = rawData.map(row => {
                            let obj = {};
                            row.forEach((val, index) => obj[`Columna ${index + 1}`] = val);
                            return obj;
                        });
                    }

                    renderTable(finalData); // Pintamos la tabla
                }
            });
        }
    };

    reader.readAsText(file);
});