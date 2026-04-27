// Asegúrate de poner la IP correcta de tu EC2 aquí
const API_URL = 'http://52.14.218.34/api'; 
let currentFileName = ""; // Guarda el nombre del archivo cargado actualmente

async function fetchDatabaseFiles() {
    const select = document.getElementById('db-file-select');
    const loadBtn = document.getElementById('btn-load-db');
    
    try {
        const response = await fetch(`${API_URL}/archivos`);
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const files = await response.json();
        select.innerHTML = '<option value="">Selecciona un archivo...</option>';
        
        if (files.length === 0) {
            select.innerHTML = '<option value="">No hay archivos en la BD aún</option>';
            return;
        }

        files.forEach(file => {
            const opt = document.createElement('option');
            opt.value = file;
            opt.textContent = file;
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
            loadBtn.disabled = e.target.value === "";
        });

    } catch (error) {
        select.innerHTML = '<option value="">Error conectando con el servidor (EC2)</option>';
        console.error(error);
    }
}

document.getElementById('btn-load-db').addEventListener('click', async () => {
    const fileName = document.getElementById('db-file-select').value;
    if (!fileName) return;

    try {
        const response = await fetch(`${API_URL}/archivos/${fileName}`);
        const data = await response.json();
        
        document.getElementById('file-name').textContent = `Cargado desde BD: ${fileName}`;
        currentFileName = fileName;
        renderTable(data); // Reutilizamos tu función existente para pintar la tabla
        document.getElementById('btn-save-db').disabled = true; // Ya está en BD, no lo guardamos de nuevo
        
    } catch (error) {
        alert("Error cargando los datos desde DynamoDB.");
    }
});

document.getElementById('btn-save-db').addEventListener('click', async () => {
    if (!globalData || globalData.length === 0) return;
    
    const saveBtn = document.getElementById('btn-save-db');
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    saveBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: currentFileName || `Archivo_local_${Date.now()}`,
                data: globalData
            })
        });

        if (response.ok) {
            alert('¡Datos guardados exitosamente en DynamoDB!');
            fetchDatabaseFiles(); // Refrescamos la lista desplegable
        } else {
            throw new Error('Error en la respuesta de la API');
        }
    } catch (error) {
        alert('Ocurrió un error al intentar guardar en DynamoDB.');
        saveBtn.disabled = false;
    } finally {
        saveBtn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> Guardar en BD';
    }
});