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

    // Cargar el archivo generado por el pipeline
    cargarResultadoPipeline();
});

// Busca el archivo "resultado.txt" en tu servidor EC2
async function cargarResultadoPipeline() {
    const container = document.getElementById('resultado-pipeline-container');
    try {
        // Apunta directamente a la IP de tu EC2
        const response = await fetch('http://52.14.218.34/resultado.txt');
        if (!response.ok) throw new Error('Archivo no encontrado');
        const text = await response.text();
        container.textContent = text;
    } catch (error) {
        container.textContent = "Esperando la ejecución del script en EC2 para generar 'resultado.txt'...";
        container.style.color = "var(--text-muted)";
    }
}