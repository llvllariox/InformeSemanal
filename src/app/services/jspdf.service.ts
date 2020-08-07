import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

// interface jsPDFWithPlugin extends jsPDF {
//   autotable: (options: UserOptions) => jsPDF;
// }

@Injectable({
  providedIn: 'root'
})

export class JspdfService {

  constructor() {

    // let logoTBK = '../../assets/images/logo_tbk.jpg';
    let logoTBK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAb0AAABUCAYAAAAWEum6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADeGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJlZjAwOGRkLTZlZjgtZjU0NC05MzY1LWQ5OTE1MzRhMmI5NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NDY5OTg1QTQ4ODgxMUU3QUVDODg0MjUxOTE3Q0MwNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RDc5QUVCMDQ4ODUxMUU3QUVDODg0MjUxOTE3Q0MwNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmQ5NTRlZmVhLTg5OTUtNDMwNi05NjNiLWU0YmMxZmNlNjk3OSIgc3RSZWY6ZG9jdW1l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';

    // se crear doc
    let doc = new jsPDF('landscape');

    // Nota 300 maximo de ancho;

    // Titulo ARS
    doc.setFontSize(20);
    doc.text(20, 20, 'MA02201 - NBE Modelo Tarifario Debito');

    // Logo TBK
    doc.addImage(logoTBK, 'jpg', 215, 8, 65, 14);

    // Linea Roja Horizontal
    // donde parte, altura inicio, ancho linea, alturo fin
    doc.setLineWidth(0.5);
    doc.setDrawColor(255, 0, 0);
    doc.line(15, 26, 282, 26);

    // Tabla Gantt
    doc.autoTable({
      headStyles: {fillColor: [177, 181, 178], textColor: [0, 0, 0]},
      startY: 32,
      margin: {top: 0, left: 16},
      styles: { fontSize: 7},
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 20},
        2: {cellWidth: 20},
        3: {cellWidth: 20},
      },
      head: [['Tarea', 'Duracion HH', 'Inicio', 'Fin']],
      body: [
        ['Analisis y DiseñoXXXXXXXXX', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
      ],
    });

    // Tabla Horas
    doc.autoTable({
      headStyles: {fillColor: [177, 181, 178], textColor: [0, 0, 0]},
      startY: 32,
      margin: {top: 0, left: 151},
      styles: { fontSize: 7},
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 20},
        2: {cellWidth: 20},
        3: {cellWidth: 20},
      },
      head: [['Tarea', 'Duracion HH', 'Inicio', 'Fin']],
      body: [
        ['Analisis y DiseñoXXXXXXXXX', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
      ],
    });

    // Actividades Realizadas
    doc.autoTable({
      headStyles: {fillColor: [177, 181, 178], textColor: [0, 0, 0]},
      startY: 120,
      margin: {top: 0, left: 16},
      styles: { fontSize: 7},
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 20},
        2: {cellWidth: 20},
        3: {cellWidth: 20},
      },
      head: [['Tarea', 'Duracion HH', 'Inicio', 'Fin']],
      body: [
        ['Analisis y DiseñoXXXXXXXXX', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
      ],
    });

    // Proximas Actividades
    doc.autoTable({
      headStyles: {fillColor: [177, 181, 178], textColor: [0, 0, 0]},
      startY: 120,
      margin: {top: 0, left: 151},
      styles: { fontSize: 7},
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 20},
        2: {cellWidth: 20},
        3: {cellWidth: 20},
      },
      head: [['Tarea', 'Duracion HH', 'Inicio', 'Fin']],
      body: [
        ['Analisis y DiseñoXXXXXXXXX', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
        ['Analisis y Diseño', '481.5', '10/02/2020', '27/03/2020'],
      ],
    });

    // Pie
    doc.setFontSize(8);
    doc.text(20, 180, 'Copyright © 2020 Accenture All rights reserved.');

    doc.addPage();

    // Guardar PDF
    doc.save('Nombre.pdf');

  }
}
