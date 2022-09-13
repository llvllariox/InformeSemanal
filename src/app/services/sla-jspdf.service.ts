import { Injectable } from '@angular/core';
const { jsPDF } = require("jspdf");

@Injectable({
  providedIn: 'root'
})
export class SlaJspdfService {

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fecha: Date;

  constructor() { }

  generaPDF(variables, fecha){
    this.fecha = fecha;
    console.log("generar pdf");
    return new Promise((resolve, reject) => {
      const doc = new jsPDF({
        orientation: "l",
        unit: "mm",
        format: [190, 300]
      });

      //titulo
      doc.setFontSize(22);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      const tituloInforme = "Resumen SLA mes: " + this.monthNames[this.fecha.getMonth()] + " de " + this.fecha.getFullYear();
      doc.text(10, 12, tituloInforme);

      //tabla
      doc.autoTable({
        theme: 'grid',
        headStyles: {fillColor: [200, 43, 22], textColor: [255, 255, 255], halign: 'center'},
        bodyStyles: {halign: 'center'},
        startY: 30,
        margin: {top: 0, left: 10},
        styles: { fontSize: 8},
        columnStyles: {
          0: {cellWidth: 26, fontStyle: 'bold'},
          1: {cellWidth: 104},
        },
        head: [['Métrica', 'Target', 'Cantidad Mínima de Casos', 'Cantidad de Casos', 'Total OK', 'Total NOOK', 'SLA']],

        body: [
          ['Etapa', 'a', 'b'],
          ['Solicitud Jira', 'c', 'd'],
        ],
      });

      doc.save(`generar_PDF.pdf`);
      return resolve('resolved');
    });
  }
}
