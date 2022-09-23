import { Injectable } from '@angular/core';
const { jsPDF } = require("jspdf");

@Injectable({
  providedIn: 'root'
})
export class SlaJspdfService {

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fecha: Date;

  antena = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAaCAIAAADAARDdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAI0SURBVEhL7ZS/a/JAGMf7rzgIddLJraWLU6Wg0qHCC8o72MnQoatCpS+8xSFDhoCQIZAhEHiRwIt0kUJpHSoOSkBEKG1BiFBIpgxCes/dtV5MPIXSwgvvlxvyvR+fPPc8d7fjf6X+09fpO+kzU8jlszmlT/02cru/0JJ87dqlHYwC9Imaj8UTuxc9j3ZsJcesolWxqunQjqVY+rxdScTiqcsHMM6tWMzlBXOOh3z7XhFKJaHVsxfYjzU0WpQHEIdzLSB6vNENBcXSB80kmlTRZ2D6v9F3omxguiVnYD20gvYMPVMti+yBPAITWMgqQL+E9WSS160Di+zDNioEDa1+AyHOjDLYK1yhZ/0H+j5RH8GwYumWdIAmlfQXMH0xhVhZdQpmrHzEXtRx7Ja8j2xOm4BhwwqIpbudM1gv/MXVt3uqqLTHEOiTdkLQ0Ej1Xi29pehDPJPsI3nVJyVhxNLXVH9B9pSqGcYp/GA1AxMV/h150gJ037Paoths3djUg7zbxi6CogIuvLsLSNe+ZNExkDf6IzZFsYNTuKIgPUJuuwoJoUdliNOdbNyF44zSJvqjVoBsVNSp67yiNpAO4WenZsTNDGsDfSRloBLhdqw90Sk8celerwbXJJU+gpfko6WhMyMN6SyOeHR6hEJhkg1t8xxx6HP9JyQhIsW0GOed8LsV1Ho6QUQfD3qQNtZ2Ld0byIX0ytFeCi5Bcq+sTvnJ4VYV3ezQ5V6KM/QuLv3T+nfpvv8G/fJATNIxuksAAAAASUVORK5CYII=';

  constructor() { }

  generaPDF(variables, fecha){
    console.log("generar pdf");

    let SLAPE1 = Number(variables['SLAPE1']).toFixed(1);
    let SLAPE2 = Number(variables['SLAPE2']).toFixed(1);
    let SLAPE3 = Number(variables['SLAPE3']).toFixed(1);
    let SLAPE6 = Number(variables['SLAPE6']).toFixed(1);
    let SLAPM1 = Number(variables['SLAPM1']).toFixed(1);
    let SLAPM2 = Number(variables['SLAPM2']).toFixed(1);
    let SLAPI1 = Number(variables['SLAPI1']).toFixed(1);
    let SLAPI2 = Number(variables['SLAPI2']).toFixed(1);

    let cantidadPE1 = variables['cantidadPE1']; 
    let cantidadPE2 = variables['cantidadPE2']; 
    let cantidadPE3 = variables['cantidadPE3']; 
    let cantidadPE6 = variables['cantidadPE6']; 
    let cantidadPM1 = variables['cantidadPM1']; 
    let cantidadPM2 = variables['cantidadPM2']; 
    let cantidadPI1 = variables['cantidadPI1']; 
    let cantidadPI2 = variables['cantidadPI2']; 
    
    let cantidadOkPE1 = variables['cantidadOkPE1']; 
    let cantidadOkPE2 = variables['cantidadOkPE2'];
    let cantidadOkPE3 = variables['cantidadOkPE3'];
    let cantidadOkPE6 = variables['cantidadOkPE6'];
    let cantidadOkPM1 = variables['cantidadOkPM1'];
    let cantidadOkPM2 = variables['cantidadOkPM2'];
    let cantidadOkPI1 = variables['cantidadOkPI1'];
    let cantidadOkPI2 = variables['cantidadOkPI2'];

    let cantidadNoOkPE1 = variables['cantidadNoOkPE1'];
    let cantidadNoOkPE2 = variables['cantidadNoOkPE2'];
    let cantidadNoOkPE3 = variables['cantidadNoOkPE3'];
    let cantidadNoOkPE6 = variables['cantidadNoOkPE6'];
    let cantidadNoOkPM1 = variables['cantidadNoOkPM1'];
    let cantidadNoOkPM2 = variables['cantidadNoOkPM2'];
    let cantidadNoOkPI1 = variables['cantidadNoOkPI1'];
    let cantidadNoOkPI2 = variables['cantidadNoOkPI2'];

    let noSePuedeMedir = {"content":"No se puede medir","colSpan":4};

    this.fecha = fecha;
    
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
        startY: 24,
        margin: {top: 0, left: 10},
        styles: { fontSize: 8},
        columnStyles: {
          0: {cellWidth: 90, fontStyle: 'bold', fillColor: [217, 217, 217], halign: 'left' },
          1: {cellWidth: 18, fontStyle: 'bold', fillColor: [217, 217, 217] },
          2: {cellWidth: 18, fontStyle: 'bold', fillColor: [217, 217, 217] },
          3: {cellWidth: 18, fontStyle: 'bold'},
          4: {cellWidth: 18, fontStyle: 'bold'},
          5: {cellWidth: 18, fontStyle: 'bold'},
          6: {cellWidth: 18, fontStyle: 'bold'},
        },
        head: [['Métrica', 'Target', 'Cantidad Mínima de Casos', 'Cantidad de Casos', 'Total OK', 'Total NOOK', 'SLA']],

        body: [
          ['PE1: Cumplimiento de Plazo de Respuesta Estimación', '>90%', '10', cantidadPE1, cantidadOkPE1, cantidadNoOkPE1, SLAPE1],
          ['PE2: Cumplimiento de Plazo de Entrega de Desarrollo', '>85%', '10', cantidadPE2, cantidadOkPE2, cantidadNoOkPE2, SLAPE2],
          ['PE3: Cumplimiento de Horas Estimadas', '>85%', '10', cantidadPE3, cantidadOkPE3, cantidadNoOkPE3, SLAPE3],
          
          ['PE4: Cumplimiento de Plazo en Resolución de Incidencia en QA Críticas', '>90%', '10', noSePuedeMedir],
          ['PE5: Cumplimiento de Plazo en Resolución de Incidencia en QA No', '>90%', '10', noSePuedeMedir],

          ['PE6: Despliegue en Producción sin Vuelta Atrás', '>90%', '10', cantidadPE6, cantidadOkPE6, cantidadNoOkPE6, SLAPE6],

          ['CA1: Cumplimiento de Adherencia al Proceso en QA', '>90%', '10', noSePuedeMedir],
          ['CA2: Cumplimiento en Calidad del SW en QA', '<20%', '10', noSePuedeMedir],

          ['PM1: Cumplimiento de Plazo de Respuesta Estimación', '>90%', '10', cantidadPM1, cantidadOkPM1, cantidadNoOkPM1, SLAPM1],
          ['PM2: Cumplimiento de Plazo de Entrega de Planificación', '>90%', '10', cantidadPM2, cantidadOkPM2, cantidadNoOkPM2, SLAPM2],
          ['PI1: Cumplimiento de Plazo en Resolución de Incidencia', '>90%', '10', cantidadPI1, cantidadOkPI1, cantidadNoOkPI1, SLAPI1],
          ['PI2: Cumplimiento en Tiempo de Respuesta Telefónica', '>90%', '10', cantidadPI2, cantidadOkPI2, cantidadNoOkPI2, SLAPI2],
        ],
      });

      doc.save(`generar_PDF.pdf`);
      return resolve('resolved');
    });
  }
}
