// Módulo de Exportação para PDF e Excel
const ExportManager = {
  exportExcel() {
    if (typeof XLSX === 'undefined') {
      alert("Biblioteca de exportação Excel não carregada.");
      return;
    }
    const wb = XLSX.utils.book_new();
    const tableDRE = document.getElementById("tableDRE");
    if (tableDRE) {
      const ws = XLSX.utils.table_to_sheet(tableDRE);
      XLSX.utils.book_append_sheet(wb, ws, "DRE SSCAR");
    }
    XLSX.writeFile(wb, "SSCAR_Relatorio_Financeiro.xlsx");
  },

  exportPDF() {
    if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
      alert("Biblioteca de exportação PDF não disponível.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("dashboardContent");

    html2canvas(element, { scale: 1.5 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("SSCAR_Dashboard_Executivo.pdf");
    });
  }
};
