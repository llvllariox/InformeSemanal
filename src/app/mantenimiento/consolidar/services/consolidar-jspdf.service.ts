import { Injectable } from '@angular/core';

const { jsPDF } = require("jspdf");

@Injectable({
  providedIn: 'root'
})
export class ConsolidarJspdfService {

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  logo = 'data:image/png;base64,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';

  constructor() { }

  //genera un archivo PDF
  generaPDF(
            comercial,
            transaccional,
            detalles,
            imgBarrasHoras,
            imgBarrasPorcentaje,
            imgHorasMes,
            imgHorasMesPorArea
  ){
    //preparamos la data
    let dataResumen = [];
    let dataComercial = [];
    let dataTransaccional = [];

    this.monthNames.forEach(mes => {
      /* comercial[mes].forEach(element => {
        dataComercial.push(
          [
            mes,
            element['descripcion'], 
            element['horasIncurridas'],
            element['lineaDeServicio'],
            element['sistema'],
            element['solicitante']
          ]
        );  
      });
      

      dataTransaccional.push(transaccional[mes]); */

      dataResumen.push(
          [
            mes,
            detalles[mes]['Soporte'],
            detalles[mes]['Incidente'],
            detalles[mes]['Problema'],
            detalles[mes]['Gestion'],
            detalles[mes]['Mantenimiento'],
            detalles[mes]['Porcentaje'], 
            detalles[mes]['HHConsumidas'],
            detalles[mes]['Presupuesto']
          ]
        );      
    });


    return new Promise((resolve, reject) => {
      const doc = new jsPDF({
        orientation: "l",
        unit: "mm",
        format: [150, 240]
      });

      this.agregarResumen(doc, 'Resumen', dataResumen);

      //this.agregarTipo(doc, 'Comercial', dataComercial);

      this.agregarGrafico(doc, 'Horas utilizadas por área de servicio', imgBarrasHoras);
      this.agregarGrafico(doc, '% Horas utilizadas por área de servicio', imgBarrasPorcentaje);
      this.agregarGrafico(doc, 'Horas / mes', imgHorasMes);
      this.agregarGrafico(doc, 'Horas / mes por área de servicio', imgHorasMesPorArea);

      let filename = 'consolidado_mantencion.pdf'
      doc.save(filename);

      return resolve('resolved');
    });
  }

  //agrega la pagina Resumen al PDF
  agregarResumen(doc, nombre: string, data): void {
    doc.addImage(this.logo, 'png', 192, 8, 36, 8);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(10, 12, 'Consolidado Mantención');

    //titulo
    doc.setFontSize(18);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(10, 20, 'Resumen');
    
    //tabla 
    doc.autoTable({
      theme: 'grid',
      headStyles: {fillColor: [200, 43, 22], textColor: [255, 255, 255], halign: 'center'},
      bodyStyles: {halign: 'center'},
      startY: 26,
      margin: {top: 0, left: 10},
      styles: { fontSize: 8},
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold' },
        1: { cellWidth: 18, fontStyle: 'bold' },
        2: { cellWidth: 18, fontStyle: 'bold' },
        3: { cellWidth: 18, fontStyle: 'bold' },
        4: { cellWidth: 18, fontStyle: 'bold' },
        5: { cellWidth: 24, fontStyle: 'bold' },
        6: { cellWidth: 16, fontStyle: 'bold' },
        7: { cellWidth: 22, fontStyle: 'bold' },
        8: { cellWidth: 22, fontStyle: 'bold' },
      },

      head: [[
        'Periodo',
        'Soporte',
        'Incidente',
        'Problema',
        'Gestión',
        'Mantenimiento',
        '%',
        'HH Consumidas',
        'Presupuesto'
      ]],

      body: data,
    });
  }

  //agrega la pagina con comercial o transaccional al PDF
  agregarTipo(doc, nombre: string, data): void{
    doc.addImage(this.logo, 'png', 192, 8, 36, 8);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(10, 12, 'Consolidado Mantención');

    //titulo
    doc.setFontSize(18);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(10, 20, nombre);
    
    //tabla 
    doc.autoTable({
      theme: 'grid',
      headStyles: {fillColor: [200, 43, 22], textColor: [255, 255, 255], halign: 'center'},
      bodyStyles: {halign: 'center'},
      startY: 26,
      margin: {top: 0, left: 10},
      styles: { fontSize: 8},
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold' },
        1: { cellWidth: 100, fontStyle: 'bold' },
        2: { cellWidth: 20, fontStyle: 'bold' },
        3: { cellWidth: 20, fontStyle: 'bold' },
        4: { cellWidth: 22, fontStyle: 'bold' },
        5: { cellWidth: 22, fontStyle: 'bold' },
      },

      head: [[
        'Periodo',
        'Descripción',
        'Horas Incurridas',
        'Línea de Servicio',
        'Sistema',
        'Solicitante'
      ]],

      body: data,
    });
  }

  //agrega una pagina con un grafico al PDF
  agregarGrafico(doc, nombre: string, canvas): void{
    doc.addPage();

    doc.addImage(this.logo, 'png', 192, 8, 36, 8);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(10, 12, 'Consolidado Mantención');

    //titulo
    doc.setFontSize(18);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(10, 20, nombre);
    
    //grafico
    doc.addImage(canvas, 'PNG', 6, 24, 120, 100);
  }

  // ------------------

  //genera un archivo PDF con la data de ARS
  generaARSPDF(
    comercial,
    transaccional,
    detalles,
    imgBarrasHoras,
    imgBarrasPorcentaje,
    imgHorasMes,
    imgHorasMesPorArea
  ){
        //preparamos la data
        let dataResumen = [];
        let dataComercial = [];
        let dataTransaccional = [];
    
        this.monthNames.forEach(mes => {
          /* comercial[mes].forEach(element => {
            dataComercial.push(
              [
                mes,
                element['descripcion'], 
                element['horasIncurridas'],
                element['lineaDeServicio'],
                element['sistema'],
                element['solicitante']
              ]
            );  
          });
    
          dataTransaccional.push(transaccional[mes]); */
    
          dataResumen.push(
              [
                mes,
                detalles[mes]['Soporte'],
                detalles[mes]['Incidente'],
                detalles[mes]['Problema'],
                detalles[mes]['Gestion'],
                detalles[mes]['Mantenimiento'],
                detalles[mes]['Porcentaje'], 
                detalles[mes]['HHConsumidas'],
                detalles[mes]['Presupuesto']
              ]
            );      
        });
    
        return new Promise((resolve, reject) => {
          const doc = new jsPDF({
            orientation: "l",
            unit: "mm",
            format: [150, 240]
          });
    
          this.agregarResumen(doc, 'Resumen', dataResumen);
    
          //this.agregarTipo(doc, 'Comercial', dataComercial);
    
          this.agregarGrafico(doc, 'Horas utilizadas por área de servicio', imgBarrasHoras);
          this.agregarGrafico(doc, '% Horas utilizadas por área de servicio', imgBarrasPorcentaje);
          this.agregarGrafico(doc, 'Horas / mes', imgHorasMes);
          this.agregarGrafico(doc, 'Horas / mes por área de servicio', imgHorasMesPorArea);
    
          let filename = 'consolidado_mantencion.pdf'
          doc.save(filename);
    
          return resolve('resolved');
        });
  }
}