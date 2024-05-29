import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConsolidarDataService } from '../../services/consolidar-json-data.service';
import { ConsolidarJspdfService } from 'src/app/mantenimiento/consolidar/services/consolidar-jspdf.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

import Chart from 'chart.js/auto';
import { Workbook } from 'exceljs';
import html2canvas from 'html2canvas';
import * as fs from 'file-saver';

@Component({
  selector: 'app-mostrar-ars',
  templateUrl: './mostrar-ars.component.html',
  styleUrls: ['./mostrar-ars.component.css']
})
export class MostrarARSConsolidarComponent implements OnInit {

  public jsonDataHorasComercial: [] = [];
  public jsonDataHorasTransaccional: number[] = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  tabla;
  tablaHeaders = [
    'Periodo',
    'Soporte',
  ];

  detalles: Number[][] = [];

  public barrasHoras: Chart;
  public barrasPorcentaje: Chart;
  public horasMes: Chart;
  public horasMesPorArea: Chart;

  @ViewChild('barrasHoras', {static:false}) eBarrasHoras!: ElementRef;
  @ViewChild('barrasPorcentaje', {static:false}) eBarrasPorcentaje!: ElementRef;
  @ViewChild('horasMes', {static:false}) eHorasMes!: ElementRef;
  @ViewChild('horasMesPorArea', {static:false}) eHorasMesPorArea!: ElementRef;
 
  constructor(
    private consolidarDataService: ConsolidarDataService,
    public pdfService: ConsolidarJspdfService,
    private sweetAlertService: SweetAlertService
  ) {
      //servicio
      this.monthNames.forEach(mes => {
        this.detalles[mes] = [];
        this.detalles[mes]['Soporte'] = 0;
        this.detalles[mes]['Incidente'] = 0;
        this.detalles[mes]['Problema'] = 0;
        this.detalles[mes]['Gestion'] = 0;
        this.detalles[mes]['Mantenimiento'] = 0;

        this.jsonDataHorasComercial[mes] = consolidarDataService.getJsonDataHorasComercial(mes);
        this.jsonDataHorasTransaccional[mes] = consolidarDataService.getJsonDataHorasTransaccional(mes);
      }); 

      // Presupuesto
      this.detalles['Enero']['Presupuesto'] = 500;
      this.detalles['Febrero']['Presupuesto'] = 600;
      this.detalles['Marzo']['Presupuesto'] = 2183;
      this.detalles['Abril']['Presupuesto'] = 500;
      this.detalles['Mayo']['Presupuesto'] = 400;
      this.detalles['Junio']['Presupuesto'] = 400;
      this.detalles['Julio']['Presupuesto'] = 400;
      this.detalles['Agosto']['Presupuesto'] = 400;
      this.detalles['Septiembre']['Presupuesto'] = 400;
      this.detalles['Octubre']['Presupuesto'] = 400;
      this.detalles['Noviembre']['Presupuesto'] = 400;
      this.detalles['Diciembre']['Presupuesto'] = 400;

      this.sumarLineaDeServicio();
      
      //suma de los detalles
      this.detalles['total']['Presupuesto'] = 0;

      this.monthNames.forEach(mes => {
        this.detalles['total']['Presupuesto'] += this.detalles[mes]['Presupuesto'];
      });

      this.porcentajeHorasConsumidas();
      this.totalPorcentajeHorasConsumidas();

      //agrupar
      this.monthNames.forEach(mes => {
        this.jsonDataHorasComercial[mes] = this.agruparPorNumeroArs(this.jsonDataHorasComercial[mes]);
        this.jsonDataHorasTransaccional[mes] = this.agruparPorNumeroArs(this.jsonDataHorasTransaccional[mes]);
      }); 
  
    //ordenamos los arreglos por fecha incurrido

    /* var sortedJsonDataHorasComercial: string[] = this.jsonDataHorasComercial.sort((n1,n2) => {
      if (n1.fechaDeRecepcion > n2.fechaDeRecepcion) {
          return 1;
      }

      if (n1.fechaDeRecepcion < n2.fechaDeRecepcion) {
          return -1;
      }
      return 0;
    });

    this.jsonDataHorasComercial = sortedJsonDataHorasComercial;

    this.agruparPorMes(); */
  }

  ngOnInit(): void {
    this.horasUtilizadasPorAreaDeServicio();
    this.porcentajeHorasUtilizadasPorAreaDeServicio();
    this.horasPorMes();
    this.horasPorMesPorArea();
  }

  //agrupa la data por numero Ars, suma las horas y la retorna
  agruparPorNumeroArs(data){
    let temp = [];

    data.forEach(element => {
      let index = temp.findIndex(ars  => ars['numeroArs'] === element.numeroArs);  

      if(index == -1){
         //creamos un ars para agregar al arreglo detalleExcel
         let arsExcel = {
          numeroArs: element.numeroArs,
          horas: (Number(element.horas)),
          descripcion: element.descripcion,
          lineaDeServicio: element.lineaDeServicio,
          aplicacion: element.aplicacion,
          solicitante: element.solicitante,
          area: element.area
        }
        //this.detalleExcel.push(arsExcel);
        temp.push(element);
      } else {
        let horasSumar = Number(temp[index].horas);
        temp[index].horas = (Number(element.horas)) + horasSumar;
      }
    });

    return temp;
  }

  //suma las horas de acuerdo a su linea de servicio
  sumarLineaDeServicio(): void {
    this.detalles['total'] = [];
    this.detalles['total']['Soporte'] = 0;
    this.detalles['total']['Incidente'] = 0;
    this.detalles['total']['Problema'] = 0;
    this.detalles['total']['Gestion'] = 0;
    this.detalles['total']['Mantenimiento'] = 0;
    this.detalles['total']['HHConsumidas'] = 0;

    let soporte = 0;
    let incidente = 0;
    let problema = 0;
    let gestion = 0;
    let mantenimiento = 0;

    let data = [];
  
    this.monthNames.forEach(mes => {
      
      data = this.jsonDataHorasComercial[mes]
            .concat(this.jsonDataHorasTransaccional[mes]);
      
      data.forEach(element => {
        if(element.lineaDeServicio == "Incidentes") {
          incidente += Number(element.horas);
        } else if(element.lineaDeServicio == "Problemas") {
          problema += Number(element.horas);
        } else if(element.lineaDeServicio == "Evolutivo Menor") {
          mantenimiento += Number(element.horas);
        } else if(element.lineaDeServicio == 'Soporte'){
          if(element.bloque == 'Gestión'){
            gestion += Number(element.horas);
          } else {
            soporte += Number(element.horas);
          }
        }
      });

      this.detalles[mes]['Soporte'] = soporte;
      this.detalles[mes]['Incidente'] = incidente;
      this.detalles[mes]['Problema'] = problema;
      this.detalles[mes]['Gestion'] = gestion;
      this.detalles[mes]['Mantenimiento'] = mantenimiento;

      let suma = soporte + incidente + problema + gestion + mantenimiento;
      this.detalles[mes]['HHConsumidas'] = suma;

      this.detalles['total']['Soporte'] += soporte;
      this.detalles['total']['Incidente'] += incidente;
      this.detalles['total']['Problema'] += problema;
      this.detalles['total']['Gestion'] += gestion;
      this.detalles['total']['Mantenimiento'] += mantenimiento;
      this.detalles['total']['HHConsumidas'] += suma;
      
      soporte = 0;
      incidente = 0;
      problema = 0;
      gestion = 0;
      mantenimiento = 0;
      data = [];
    });
  }


  //grafico Horas utilizadas por área de servicio
  horasUtilizadasPorAreaDeServicio(): void {

    //gráfico de barras
    this.barrasHoras = new Chart("barrasHoras", {
      type: 'bar',

      data: {
        labels: [
                  'Soporte ' + this.detalles['total']['Soporte'],
                  'Incidente ' + this.detalles['total']['Incidente'],
                  'Problema ' + this.detalles['total']['Problema'],
                  'Gestion ' + this.detalles['total']['Gestion'],
                  'Mantenimiento ' + this.detalles['total']['Mantenimiento']
                ], 
	      
        datasets: [
          {
            label: "label",
              data: [
                this.detalles['total']['Soporte'],
                this.detalles['total']['Incidente'],
                this.detalles['total']['Problema'],
                this.detalles['total']['Gestion'],
                this.detalles['total']['Mantenimiento']
              ],
              barThickness: 70,   
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
            
          }
        }

      },
    });
  }

  //grafico Horas utilizadas por área de servicio
  porcentajeHorasUtilizadasPorAreaDeServicio(): void {

    this.detalles['porcentaje'] = [];
    this.detalles['porcentaje']['Soporte'] = this.detalles['total']['Soporte'] / this.detalles['total']['HHConsumidas'] * 100;
    this.detalles['porcentaje']['Soporte'] = Number.parseInt(this.detalles['porcentaje']['Soporte']);

    this.detalles['porcentaje']['Incidente'] = this.detalles['total']['Incidente'] / this.detalles['total']['HHConsumidas'] * 100;
    this.detalles['porcentaje']['Incidente'] = Number.parseInt(this.detalles['porcentaje']['Incidente']);
    
    this.detalles['porcentaje']['Problema'] = this.detalles['total']['Problema'] / this.detalles['total']['HHConsumidas'] * 100;
    this.detalles['porcentaje']['Problema'] = Number.parseInt(this.detalles['porcentaje']['Problema']);

    this.detalles['porcentaje']['Gestion'] = this.detalles['total']['Gestion'] / this.detalles['total']['HHConsumidas'] * 100;
    this.detalles['porcentaje']['Gestion'] = Number.parseInt(this.detalles['porcentaje']['Gestion']);

    this.detalles['porcentaje']['Mantenimiento'] = this.detalles['total']['Mantenimiento'] / this.detalles['total']['HHConsumidas'] * 100;
    this.detalles['porcentaje']['Mantenimiento'] = Number.parseInt(this.detalles['porcentaje']['Mantenimiento']);

    //gráfico de barras
    this.barrasPorcentaje = new Chart("barrasPorcentaje", {
      type: 'bar',

      data: {
        labels: [
                  'Soporte ' + this.detalles['porcentaje']['Soporte'] + '%',
                  'Incidente ' + this.detalles['porcentaje']['Incidente'] + '%',
                  'Problema ' + this.detalles['porcentaje']['Problema'] + '%',
                  'Gestion ' + this.detalles['porcentaje']['Gestion'] + '%',
                  'Mantenimiento ' + this.detalles['porcentaje']['Mantenimiento'] + '%'
                ], 
	      
        datasets: [
          {
            label: "label",
              data: [
                this.detalles['porcentaje']['Soporte'],
                this.detalles['porcentaje']['Incidente'],
                this.detalles['porcentaje']['Problema'],
                this.detalles['porcentaje']['Gestion'],
                this.detalles['porcentaje']['Mantenimiento']
              ],
              barThickness: 70,   
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          }
        }

      },
    });
  }

  //grafico Horas / mes
  horasPorMes(): void{
    let labels = [];
    this.monthNames.forEach(element => {
      labels.push(element);
    });

    let dataset1 = [];
    this.monthNames.forEach(mes => {
      dataset1.push(this.detalles[mes]['HHConsumidas'],);
    });

    let dataset2 = [];
    this.monthNames.forEach(mes => {
      dataset2.push(this.detalles[mes]['Presupuesto'],);
    });

    this.horasMes = new Chart("horasMes", {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'HH Consumidas',
            data: dataset1
            //borderColor: Utils.CHART_COLORS.red,
            //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
          },
          {
            label: 'Presupuesto',
            data: dataset2
            //borderColor: Utils.CHART_COLORS.red,
            //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Horas / mes'
          }
        }
      },
    });
  }

  //grafico Horas / mes
  horasPorMesPorArea(): void{
    let labels = [];
    this.monthNames.forEach(element => {
      labels.push(element);
    });

    let datasetSoporte = [];
    let datasetIncidente = [];
    let datasetProblema = [];
    let datasetGestion = [];
    let datasetMantenimiento = [];

    this.monthNames.forEach(mes => {
      datasetSoporte.push(this.detalles[mes]['Soporte']);
      datasetIncidente.push(this.detalles[mes]['Incidente']);
      datasetProblema.push(this.detalles[mes]['Problema']);
      datasetGestion.push(this.detalles[mes]['Gestion']);
      datasetMantenimiento.push(this.detalles[mes]['Mantenimiento']);
    });


    this.horasMesPorArea = new Chart("horasMesPorArea", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Soporte',
            data: datasetSoporte,
            borderColor: '#000000',
            backgroundColor: '#4287f5',
          },
          {
            label: 'Incidente',
            data: datasetIncidente,
            borderColor: '#000000',
            backgroundColor: '#f54266',
          },
          {
            label: 'Problema',
            data: datasetProblema,
            borderColor: '#000000',
            backgroundColor: '#81858a',
          },
          {
            label: 'Gestion',
            data: datasetGestion,
            borderColor: '#000000',
            backgroundColor: '#debb71',
          },
          {
            label: 'Mantenimiento',
            data: datasetMantenimiento,
            borderColor: '#000000',
            backgroundColor: '#83a2eb',
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Horas / mes por área de servicio '
          }
        }
      },
    });
  }

  // porcentaje de horas consumidas sobre el presupuesto
  porcentajeHorasConsumidas(): void {
    this.monthNames.forEach(mes => {
      this.detalles[mes]['Porcentaje'] = this.porcentajeHorasConsumidasPorMes(mes);
    });
  }

  // porcentaje de horas consumidas sobre el presupuesto para el mes
  porcentajeHorasConsumidasPorMes(mes: string): string {
      return this.detalles[mes]['Porcentaje'] = (this.detalles[mes]['HHConsumidas'] / this.detalles[mes]['Presupuesto'] * 100).toFixed(0);
  }

  //  porcentaje de horas totales consumidas sobre el presupuesto total
  totalPorcentajeHorasConsumidas(): void {
    this.detalles['total']['Porcentaje'] = (this.detalles['total']['HHConsumidas'] / this.detalles['total']['Presupuesto'] * 100).toFixed(0);
  }

  //cada vez que se cambia un presupuesto
  cambiarPresupuesto(mes: string) :void {
    //(<HTMLInputElement>document.getElementById('inputUtilizadasActual')).value = (Number(this.horasUtilizadasOriginal) - Number(inputAnterioresValue)).toString();

    this.detalles[mes]['Presupuesto'] = (<HTMLInputElement>document.getElementById('inputPresupuesto' + mes)).value;
    
    // se vuelve a calcular el porcentaje de horas consumidas para el mes
    this.porcentajeHorasConsumidasPorMes(mes);

    // se cambia el total de presupuestos
    let suma = 0;
    this.monthNames.forEach(mes => {
      suma += Number(this.detalles[mes]['Presupuesto']);
    });
    this.detalles['total']['Presupuesto'] = suma;

    // se cambia el total de porcentajes
    this.totalPorcentajeHorasConsumidas();

    // se actualiza el grafico Horas / mes
    this.horasMes.destroy();
    this.horasPorMes();
  }

 //genera un archivo Excel
 generateExcel(){
  let workbook = new Workbook();

  //se crean las hojas Comercial y Transaccional
  this.createSheet(workbook, 'Comercial', this.jsonDataHorasComercial );
  this.createSheet(workbook, 'Transaccional', this.jsonDataHorasTransaccional );

  //se crea la hoja Resumen
  this.createSheetResumen(workbook, 'Resumen', this.detalles);

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    let filename = 'consolidado_ARS_mantencion';
    filename += '.xlsx';

    fs.saveAs(blob, filename);
  });

}

//crea una nueva hoja en el excel
createSheet(workbook, nombre: string, data){
  let worksheet = workbook.addWorksheet(nombre);
  
  // Se establecen anchos de las columnas
  worksheet.getColumn(1).width = 14;
  worksheet.getColumn(2).width = 16;
  worksheet.getColumn(3).width = 16;
  worksheet.getColumn(4).width = 16;
  worksheet.getColumn(5).width = 16;
  worksheet.getColumn(6).width = 60;
  worksheet.getColumn(7).width = 30;
  worksheet.getColumn(8).width = 16;
  worksheet.getColumn(9).width = 16;
  worksheet.getColumn(10).width = 20;
  worksheet.getColumn(10).width = 20;
   
  const headerCS = [
      'Periodo',
      'Número ARS',
      'Horas',
      'Tipo Contrato',
      'Línea de Servicio',
      'Descripción',
      'Grupo de Trabajo Asignado',
      'Bloque',
      'Descripción Tarea',
      'Área',
      'Aplicación'
  ];
  let headerRowCS = worksheet.addRow(headerCS);

  // Cell Style : Fill and Border
  headerRowCS.eachCell((cell, number) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff4f81bd' },
        bgColor: { argb: '	ff4f81bd' },
    };
  
    cell.border = { 
      top: { style: 'thin' }, 
      left: { style: 'thin' }, 
      bottom: { style: 'thin' }, 
      right: { style: 'thin' }
    };
  
    cell.font = {
      color: {argb: 'FFFFFF'},
      bold: true,
      italic: true
    };

    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
  });

  headerRowCS.height = 40;

  //suma de horas incurridas
  let sumaIncurridas = 0;

  let newRow; 

  this.monthNames.forEach(mes => {
    data[mes].forEach(d => {
      sumaIncurridas += Number(d['horas']);
      newRow = [
              mes,
              d['numeroArs'],
              d['horas'],
              d['tipoContrato'],
              d['lineaDeServicio'],
              d['descripcion'],
              d['grupoDeTrabajoAsignado'],
              d['bloque'],
              d['descripcionTarea'],
              d['area'],
              d['aplicacion']
            ];
           
      worksheet.addRow(newRow);
    });
  });
  
  let sumaRow = [
    '',
    'Total', 
    Math.round(sumaIncurridas),
    '',
    '',
    ''
  ];

  //total
  let sumaRowCS = worksheet.addRow(sumaRow);
  sumaRowCS.eachCell((cell, number) => {
    cell.font = {
      bold: true,
      italic: true
    };

    cell.alignment = {
      vertical: 'middle',
      horizontal: 'right'
    };
  });
}

//crea la hoja Resumen en el excel
createSheetResumen(workbook, nombre: string, data){
  let worksheet = workbook.addWorksheet(nombre);
  
  // Se establecen anchos de las columnas
  worksheet.getColumn(1).width = 14;
  worksheet.getColumn(2).width = 14;
  worksheet.getColumn(3).width = 14;
  worksheet.getColumn(4).width = 14;
  worksheet.getColumn(5).width = 14;
  worksheet.getColumn(6).width = 20;   
  worksheet.getColumn(7).width = 12;   
  worksheet.getColumn(8).width = 18;   
  worksheet.getColumn(9).width = 18;   
   
  const headerCS = [
      'Periodo',
      'Soporte',
      'Incidente',
      'Problema',
      'Gestión',
      'Mantenimiento',
      '%',
      'HH Consumidas',
      'Presupuesto'
  ];
  let headerRowCS = worksheet.addRow(headerCS);

  // Cell Style : Fill and Border
  headerRowCS.eachCell((cell, number) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff4f81bd' },
        bgColor: { argb: '	ff4f81bd' },
    };
  
    cell.border = { 
      top: { style: 'thin' }, 
      left: { style: 'thin' }, 
      bottom: { style: 'thin' }, 
      right: { style: 'thin' }
    };
  
    cell.font = {
      color: {argb: 'FFFFFF'},
      bold: true,
      italic: true
    };

    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
  });

  headerRowCS.height = 40;

  let newRow; 
  this.monthNames.forEach(mes => {
    newRow = [
            mes,
            data[mes]['Soporte'],
            data[mes]['Incidente'],
            data[mes]['Problema'],
            data[mes]['Gestion'],
            data[mes]['Mantenimiento'],
            Number(data[mes]['Porcentaje']), 
            data[mes]['HHConsumidas'],
            data[mes]['Presupuesto']
          ];

      worksheet.addRow(newRow);
  });

  //Total general	
  let totalRow  = [
                    'Total general',
                    data['total']['Soporte'],
                    data['total']['Incidente'],
                    data['total']['Problema'],
                    data['total']['Gestion'],
                    data['total']['Mantenimiento'],
                    Number(data['total']['Porcentaje']), 
                    data['total']['HHConsumidas'],
                    data['total']['Presupuesto']
                  ];

  worksheet.addRow(totalRow);
}  

//genera un archivo PDF
generaNuevoPDF(){
  this.sweetAlertService.mensajeEsperar2().then(resp=>{
    
    html2canvas(this.eBarrasHoras.nativeElement).then((canvas) => {
      const imgBarrasHoras = canvas.toDataURL('img/jpg');

      html2canvas(this.eBarrasPorcentaje.nativeElement).then((canvas) => {
        const imgBarrasPorcentaje = canvas.toDataURL('img/jpg');

        html2canvas(this.eHorasMes.nativeElement).then((canvas) => {
          const imgHorasMes = canvas.toDataURL('img/jpg');

          html2canvas(this.eHorasMesPorArea.nativeElement).then((canvas) => {
            const imgHorasMesPorArea = canvas.toDataURL('img/jpg');

              this.pdfService.generaARSPDF(
                  this.jsonDataHorasComercial, 
                  this.jsonDataHorasTransaccional, 
                  this.detalles,
                  imgBarrasHoras,
                  imgBarrasPorcentaje,
                  imgHorasMes,
                  imgHorasMesPorArea
              ).then(resp => {
                this.sweetAlertService.mensajeOK('PDF Generado Exitosamente');
              });
            });
          });
        });
     });
  });
}
}