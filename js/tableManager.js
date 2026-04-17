let globalData = []; // Variable para mantener los datos originales intactos

const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const exportBtn = document.getElementById('export-pdf');

// Función principal para dibujar la tabla
function renderTable(data) {
    globalData = data;
    if (!data || data.length === 0) return;

    // Habilitar controles una vez que hay datos
    searchInput.disabled = false;
    exportBtn.disabled = false;
    emptyState.style.display = 'none';

    const headers = Object.keys(data[0]);
    
    // Dibujar Encabezados
    tableHead.innerHTML = '';
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHead.appendChild(th);
    });

    // Dibujar Filas
    renderRows(data, headers);
}

// Función auxiliar para inyectar las filas
function renderRows(data, headers) {
    tableBody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || ''; // Evitar "undefined"
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// Lógica de Búsqueda Flexible y por Columna
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!globalData.length) return;
    const headers = Object.keys(globalData[0]);

    // Si borran la búsqueda, regresamos todos los datos
    if (searchTerm === '') {
        renderRows(globalData, headers);
        return;
    }

    const filteredData = globalData.filter(row => {
        let isColumnSpecificSearch = false;
        let columnMatchSuccess = false;

        // 1. Intentamos detectar si el usuario escribió el nombre de una columna
        for (const header of headers) {
            const headerLower = header.toLowerCase();
            
            // Si el término de búsqueda incluye el nombre de la columna (ej. "humedad 40")
            if (searchTerm.includes(headerLower)) {
                isColumnSpecificSearch = true;
                
                // Extraemos el valor a buscar quitando el nombre de la columna
                // Ej: "humedad 40" -> " 40" -> "40"
                const valueToSearch = searchTerm.replace(headerLower, '').trim();
                
                // Solo validamos si escribió un valor después de la columna
                if (valueToSearch !== '') {
                    const cellValue = String(row[header] || '').toLowerCase();
                    if (cellValue.includes(valueToSearch)) {
                        columnMatchSuccess = true;
                    }
                } else {
                    // Si solo escribió "humedad" sin valor, mostramos todo
                    columnMatchSuccess = true;
                }
            }
        }

        // 2. Si detectamos que intentó buscar por columna, devolvemos el resultado de esa lógica
        if (isColumnSpecificSearch) {
            return columnMatchSuccess;
        }

        // 3. Fallback: Búsqueda global flexible (si no mencionó ninguna columna)
        const rowString = Object.values(row).join(' ').toLowerCase();
        return rowString.includes(searchTerm);
    });

    renderRows(filteredData, headers);
});