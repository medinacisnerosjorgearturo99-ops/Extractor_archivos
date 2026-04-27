document.addEventListener('DOMContentLoaded', () => {
    // Configuración del Modo Oscuro
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Cambiar el icono
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Inicializamos la lista de archivos desde la base de datos (DynamoDB)
    // Esta función vive en js/apiManager.js
    if (typeof fetchDatabaseFiles === 'function') {
        fetchDatabaseFiles();
    } else {
        console.warn("Advertencia: apiManager.js no se ha cargado correctamente.");
    }
});