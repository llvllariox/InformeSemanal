import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MantoInformeSemanalService } from '../../services/manto-informe-semanal.service';
import { MantoInformeSemanalConfService } from '../../services/manto-informe-semanal-conf.service';
import { MantoInformeSemanalFirebaseService } from '../../services/manto-informe-semanal-firebase.service';
import { MantoInformeSemanalJspdfService } from '../../services/manto-informe-semanal-jspdf.service';

import { Subscription } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import html2canvas from 'html2canvas';

import Chart from 'chart.js/auto';
import Hora from '../../interfaces/hora.interface';

@Component({
  selector: 'app-mostrar-informe-semanal-comercial',
  templateUrl: './mostrar-informe-semanal-comercial.component.html'
})
export class MostrarInformeSemanalComercialComponent implements OnInit {
  jsonArrayHoras = [];

  horas: Hora[];
  totales = [];
  sumas = [];

  yearInforme: Number;
  monthInforme: Number;
  monthNames: string[] = this.mantoInformeSemanalConfService.getMonthNames();
 
  detalleExcel = [];
  flagExcel: Boolean = false;

  subscription: Subscription;

  public chart: Chart<"pie", any[], string>;
  public chartBarra: Chart;
  public chartDetalles: Chart;
  barras = [];

  //tabla con el detalle de horas consumidas
  tabla = [];
  tablaTotal = 0;

  @ViewChild('MyChart', {static:false}) el!: ElementRef;
  @ViewChild('tablaConsumoTotal', {static:false}) elTabla!: ElementRef;
  @ViewChild('MyChartBarra', {static:false}) elBarra!: ElementRef;
  
  constructor(
    private mantoInformeSemanalService: MantoInformeSemanalService, 
    public mantoInformeSemanalConfService: MantoInformeSemanalConfService,
    public mantoInformeSemanalFirebaseService: MantoInformeSemanalFirebaseService,
    public pdfService: MantoInformeSemanalJspdfService
  ) {
    for (let i = 1; i <= 12; i++) {
      this.totales[i] = [];
    }

    let fechaInforme = this.mantoInformeSemanalService.getFechaInforme();
    this.yearInforme = fechaInforme.slice(0,4);
    this.monthInforme = fechaInforme.slice(5,7);

    this.jsonArrayHoras = this.mantoInformeSemanalService.getJsonDataMantoInformeSemanal();

    this.redondear();
    this.getDetalleExcel();

    //gráfico de barras
    this.barras['GEST'] = 0;
    this.barras['INC'] = 0;
    this.barras['MJR'] = 0;
    this.barras['SPT'] = 0;
    this.barras['PRB'] = 0;
    this.barras['GLD'] = 0;

    this.jsonArrayHoras.forEach(element => {
      let horas = Number(element.horas);

      if(element.bloque == "Gestión LD") {
        //se divide en 5 y se suma a las 4 lineas de servicio
        let division = Math.round(horas / 4);
        this.barras['INC'] += division;
        this.barras['MJR'] += division;
        this.barras['SPT'] += division;
        this.barras['PRB'] += division;

      } else if(element.bloque == "VS - Transversales") {
        this.barras['GLD'] += horas;
      } else {
        if(element.lineaDeServicio == "Incidentes") {
          this.barras['INC'] += horas;
        } else if(element.lineaDeServicio == "Problemas") {
          this.barras['PRB'] += horas;
        } else if(element.lineaDeServicio == "Evolutivo Menor") {
          this.barras['MJR'] += horas;
        } else if(element.lineaDeServicio == "Soporte") {
          if(element.bloque == 'Gestión'){
            this.barras['GEST'] += horas;
          } else {
            this.barras['SPT'] += horas;
          }
        }
      }
    });

    this.tabla.push(['Gestión', this.barras['GEST']]);
    this.tabla.push(['Incidentes', this.barras['INC']]);
    this.tabla.push(['Mejoras', this.barras['MJR']]);
    this.tabla.push(['Soportes', this.barras['SPT']]);
    this.tabla.push(['Problemas', this.barras['PRB']]);
    this.tabla.push(['Gestión LD', this.barras['GLD']]);
    
    this.tablaTotal = this.barras['GEST'] 
                      + this.barras['INC']
                      + this.barras['MJR']
                      + this.barras['SPT']
                      + this.barras['PRB']
                      + this.barras['GLD'];

    this.tabla.push(['Total', this.tablaTotal]);
  }

  ngOnInit(): void {
    this.subscription = this.mantoInformeSemanalFirebaseService.getHoras('MantoHorasC').subscribe(MantoHorasC => {
    
      let horaTemp: Hora;
      this.mantoInformeSemanalConfService.setDataOriginal(MantoHorasC, 'comercial');

      //obtenemos las horas para cada mes

      // ***********************************
      //antes del mes del informe 
      for (let i = 1; i < Number(this.monthInforme); i++) {
        this.totales[i] = [];

        horaTemp = this.mantoInformeSemanalConfService.getHora(this.yearInforme, i, 'comercial');
        
        this.totales[i]['utilizadas'] = horaTemp.utilizadas;
        this.totales[i]['propuestas'] = horaTemp.propuestas;

        //saldo
        let saldoAnterior = 0;
        if(i != 1){
          saldoAnterior = this.totales[i-1]['saldoAcumulado']
        }
        this.totales[i]['saldoMensual'] = horaTemp.propuestas - horaTemp.utilizadas;
        this.totales[i]['saldoAcumulado'] = this.totales[i]['saldoMensual'] + saldoAnterior;
        
      }

      // ***********************************
      //mes del informe
      let mesActual = Number(this.monthInforme);

      this.totales[mesActual] = [];
      
      ///propuestas
      this.totales[mesActual]['propuestas'] = this.mantoInformeSemanalConfService.getHora(this.yearInforme, Number(this.monthInforme), 'comercial').propuestas;
      
      //utilizadas
      this.totales[mesActual]['utilizadas'] = 0;
      this.jsonArrayHoras.forEach(element => {
        this.totales[mesActual]['utilizadas'] += Number(element.horas);
      });
      this.totales[mesActual]['utilizadas'] = this.totales[mesActual]['utilizadas'];
      
      //saldo
      let saldoAnterior = 0;
      if(mesActual != 1){
        saldoAnterior = this.totales[mesActual - 1]['saldoAcumulado'];
      }
      this.totales[mesActual]['saldoMensual'] = this.totales[mesActual]['propuestas'] - this.totales[mesActual]['utilizadas'];
      this.totales[mesActual]['saldoAcumulado'] = this.totales[mesActual]['saldoMensual'] + saldoAnterior;
      

      //agregamos la ultima columna a la tabla explicativa
      let propuestas = this.totales[mesActual]['propuestas'];

      this.tabla.forEach(element => {
        element[2] = Math.round(100 * element[1] / propuestas) + '%';
      });


      //*************************************
      //después del mes del informe
      
      for (let i = Number(this.monthInforme)+1; i <= 12; i++) {
        this.totales[i] = [];
        horaTemp = this.mantoInformeSemanalConfService.getHora(this.yearInforme, i, 'comercial');

        this.totales[i]['propuestas'] = horaTemp.propuestas;
      }

      this.sumas['utilizadas'] = 0;
      this.sumas['propuestas'] = 0;
      this.sumas['saldo'] = 0;
      
      this.getSuma();
      this.createChart();
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe;
  }

  //asigna las variables correspondientes a la suma de todos los meses
  getSuma(){
    this.sumas['utilizadas'] = 0;
    this.sumas['propuestas'] = 0;

    for (let i = 1; i <= 12; i++) {
      //utilizadas
      if(this.totales[i]['utilizadas']) {
        this.sumas['utilizadas'] += this.totales[i]['utilizadas'];
      }

      //propuestas
      if(this.totales[i]['propuestas']) {
        this.sumas['propuestas'] += this.totales[i]['propuestas'];
      }
    }
  }

  //asigna al arreglo detalleExcel para obtener los detalles a generar en un excel
  getDetalleExcel(){
    this.detalleExcel = [];

    this.jsonArrayHoras.forEach(element => {
      let index = this.detalleExcel.findIndex(ars => ars['numeroArs'] === element.numeroArs);
      
      if(index == -1){
        //creamos un ars para agregar al arreglo detalleExcel
        let arsExcel = {
          numeroArs: element.numeroArs,
          horas: (Number(element.horas)),
          descripcion: element.descripcion,
          lineaDeServicio: element.lineaDeServicio,
          aplicacion: element.aplicacion,
          solicitante: element.solicitante,
          bloque: element.bloque
        }
        this.detalleExcel.push(arsExcel);
      } else {
        let horasSumar = Number(this.detalleExcel[index].horas);
        this.detalleExcel[index].horas = (Number(element.horas)) + horasSumar;
      }
    });
  }

  //crea el gráfico que se muestra
  createChart(){
    let disponibles = this.totales[Number(this.monthInforme)]['propuestas'] - this.totales[Number(this.monthInforme)]['utilizadas'];
    if(disponibles < 0) disponibles = 0;

    this.chart = new Chart("MyChart", {
      type: 'pie',

      data: {
        labels: [
                  'HH Utilizadas '+ this.totales[Number(this.monthInforme)]['utilizadas'], 
                  'HH Disponibles ' + disponibles
                ], 
	      
        datasets: [
          {
              data: [this.totales[Number(this.monthInforme)]['utilizadas'], disponibles],
              backgroundColor: [
                'rgb(143,162,212)',
                'rgb(59,100,173)'
              ],   
          },
        ]
      },
      options: {
        responsive: true,
      },
    }); 
    
    //gráfico de barras
    this.chartBarra = new Chart("MyChartBarra", {
      type: 'bar',

      data: {
        labels: [
                  'GEST ' + this.barras['GEST'], 
                  'INC ' + this.barras['INC'], 
                  'MJR ' + this.barras['MJR'], 
                  'SPT ' + this.barras['SPT'], 
                  'PRB ' + this.barras['PRB'],
                  'GLD ' + this.barras['GLD']
                ], 
	      
        datasets: [
          {
            label: "",
              data: [
                this.barras['GEST'],
                this.barras['INC'],
                this.barras['MJR'],
                this.barras['SPT'],
                this.barras['PRB'],
                this.barras['GLD']
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

    //this.generateHorizontalBars();
  }

  generateHorizontalBars(){
    let disponibles = this.totales[Number(this.monthInforme)]['propuestas'] - this.totales[Number(this.monthInforme)]['utilizadas'];
    if(disponibles < 0) disponibles = 0;

    this.chartDetalles = new Chart("chartDetalles", {
      type: 'bar',
      data: {
        labels: [
                  'Gestión ' + this.barras['GEST'], 
                  'Incidentes ' + this.barras['INC'], 
                  'Mejoras ' + this.barras['MJR'], 
                  'Soportes ' + this.barras['SPT'], 
                  'Problemas ' + this.barras['PRB'],
                  'Gestión LD ' + this.barras['GLD'],
                  'Total ' + this.tablaTotal,
                  'Disponibles ' + disponibles
                ], 
	      
        datasets: [
          {
            label: "",
              data: [
                this.barras['GEST'],
                this.barras['INC'],
                this.barras['MJR'],
                this.barras['SPT'],
                this.barras['PRB'],
                this.barras['GLD'],
                this.tablaTotal,
                disponibles
              ],
              barThickness: 16,   
          },
        ]
      },
      options: {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'chartArea',
          },
          title: {
            display: false,
            text: 'Detalle de horas consumidas'
          }
        }
      },
    });
  }

  generateExcel(){
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Detalle');
      
      // Se establecen anchos de las columnas
      worksheet.getColumn(1).width = 80;
      worksheet.getColumn(2).width = 16;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 24;
      worksheet.getColumn(5).width = 24;
       
      const headerCS = [
          'Descripción',
          'Horas Incurridas',
          'Línea de Servicio',
          'Sistema',
          'Solicitante',
          'Bloque'
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
      this.detalleExcel.forEach(d => {
        sumaIncurridas += Number(d['horas']);
        newRow = [
                d['descripcion'], 
                d['horas'],
                d['lineaDeServicio'],
                d['aplicacion'],
                d['solicitante'],
                d['bloque']
              ];

          worksheet.addRow(newRow);
        });

      //anterior
      //mes del informe
      /* let inputAnterioresValue = (<HTMLInputElement>document.getElementById('inputAnterioresActual')).value;
      if(Number(inputAnterioresValue) < 0){
        let anteriorRow = [
          '(HH Presupuestadas - HH Utilizadas) Mes anterior', 
          inputAnterioresValue,
          '',
          '',
          ''
        ];

        let anteriorRowCS = worksheet.addRow(anteriorRow);
            anteriorRowCS.eachCell((cell, number) => {
            cell.font = {
              bold: true,
              italic: true
            };

            cell.alignment = {
              vertical: 'middle',
              horizontal: 'right'
            };
          });

          sumaIncurridas += -1*Number(inputAnterioresValue);
      } */

      let mesActual = Number(this.monthInforme);
      if(mesActual != 1){
        //sumamos las horas anteriores
        if(this.totales[mesActual]['anterior'] < 0){
        }
      }
      
      /* let sumaRow = [
        'Total', 
        Math.round(sumaIncurridas),
        '',
        '',
        ''
      ]; */

      let sumaRow = [
        'Total', 
        sumaIncurridas,
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
    

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      let filename = 'detalle_mantencion_BO_Comercial_';

      let mesInforme = Number(this.monthInforme);
      if(mesInforme < 10){
        filename += "0" + mesInforme;
      } else {
        filename += mesInforme;
      }
  
      filename +=  this.yearInforme;     
      filename += '.xlsx';
  
      fs.saveAs(blob, filename);
    });
  }

  generaNuevoPDF(){
    html2canvas(this.el.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('img/jpg');

      html2canvas(this.elBarra.nativeElement).then((canvas) => {
        const barraData = canvas.toDataURL('img/jpg');

          html2canvas(this.elTabla.nativeElement).then((canvas) => {
            const tblData = canvas.toDataURL('img/jpg');

            this.pdfService.generaPDFComercial(
                this.monthInforme, 
                this.yearInforme, 
                imgData, 
                tblData, 
                barraData, 
                this.tabla);

            /* html2canvas(this.elTablaDetalles.nativeElement).then((canvas) => {
              const tblDetalles = canvas.toDataURL('img/jpg');
        
              this.pdfService.generaPDFComercial(this.monthInforme, this.yearInforme, imgData, tblData, barraData, this.tabla, this.tablaTotal, tblDetalles);
            }); */
          });
        });
    });
  }

  //aplica Math.round a this.jsonArrayHoras.horas
  redondear():void {
    let horas;
    this.jsonArrayHoras.forEach(element => {
      horas = Math.round(element.horas);;
      if(element.bloque == "Gestión LD") {
        let ajuste = horas / 4;
        horas = Math.round(ajuste) * 4;
        console.log(horas);
      }
      element.horas = horas;
    });
  }
}