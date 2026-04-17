document.getElementById('export-pdf').addEventListener('click', () => {
    const element = document.getElementById('table-export-area');
    
    // Opciones para que el PDF se vea nítido y horizontal
    const opt = {
        margin:       10,
        filename:     'Reporte_Datos.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 }, // Aumenta la resolución
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Generar PDF
    html2pdf().set(opt).from(element).save();
});