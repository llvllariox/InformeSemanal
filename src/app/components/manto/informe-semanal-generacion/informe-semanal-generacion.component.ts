import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { MantoInformeSemanalService } from 'src/app/services/manto-informe-semanal.service';
import { MantoInformeSemanalConfService } from 'src/app/services/manto-informe-semanal-conf.service';
import Chart from 'chart.js/auto';
import { MantoInformeSemanalFirebaseService } from 'src/app/services/manto-informe-semanal-firebase.service';
import Hora from '../../../model/hora.interface';
import { MantoInformeSemanalJspdfService } from '../../../services/manto-informe-semanal-jspdf.service';
import html2canvas from 'html2canvas';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-informe-semanal-generacion',
  templateUrl: './informe-semanal-generacion.component.html'
})
export class InformeSemanalGeneracionComponent implements OnInit {
  jsonArrayHoras = [];
  yearInforme;
  monthInforme;
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  utilizadas = 0;
  disponibles = 0;
  excedidas = 0;

  detalleExcel = [];
  flagExcel = false;

  totales = [];
  sumas = [];

  barras = [];

  horas: Hora[];
  public chart: any;
  public chartBarra: any;

  subscription: Subscription;

  @ViewChild('MyChart', {static:false}) el!: ElementRef;
  @ViewChild('MyChartBarra', {static:false}) elBarra!: ElementRef;
  @ViewChild('tablaConsumoTotal', {static:false}) elTabla!: ElementRef;

  constructor(
              private mantoInformeSemanalService: MantoInformeSemanalService, 
              private sweetAlerService: SweetAlertService,
              public mantoInformeSemanalConfService: MantoInformeSemanalConfService,
              public mantoInformeSemanalFirebaseService: MantoInformeSemanalFirebaseService,
              public pdfService: MantoInformeSemanalJspdfService
  ) {

    for (let i = 1; i <= 12; i++) {
      this.totales[i] = [];
    }

    this.detalleExcel = [];

    this.jsonArrayHoras = this.mantoInformeSemanalService.getJsonDataMantoInformeSemanal();
    //console.log(this.jsonArrayHoras);

    this.getDetalleExcel();
   
    let fechaInforme = this.mantoInformeSemanalService.getFechaInforme();
    this.yearInforme = fechaInforme.slice(0,4);
    this.monthInforme = fechaInforme.slice(5,7);

    //gráfico de barras
    this.barras['GEST'] = 0;
    this.barras['INC'] = 0;
    this.barras['MJR'] = 0;
    this.barras['SPT'] = 0;
    this.barras['PRB'] = 0;

    this.jsonArrayHoras.forEach(element => {
      if(element.lineaDeServicio == "Incidentes") {
        this.barras['INC'] += Number(element.horas);
      } else if(element.lineaDeServicio == "Problemas") {
        this.barras['PRB'] += Number(element.horas);
      } else if(element.lineaDeServicio == "Evolutivo Menor") {
        this.barras['MJR'] += Number(element.horas);
      } else if(element.lineaDeServicio == "Soporte") {
        if(element.bloque == 'Gestión'){
          this.barras['GEST'] += Number(element.horas);
        } else {
          this.barras['SPT'] += Number(element.horas);
        }
      }
    });

    this.barras['GEST'] = Math.round(this.barras['GEST']);
    this.barras['INC'] = Math.round(this.barras['INC']);
    this.barras['MJR'] = Math.round(this.barras['MJR']);
    this.barras['SPT'] = Math.round(this.barras['SPT']);
    this.barras['PRB'] = Math.round(this.barras['PRB']);
  }

  ngOnInit(): void {
    this.subscription = this.mantoInformeSemanalFirebaseService.getHoras("transaccional").subscribe(MantoHoras => {
      console.log("this generar");
      this.horas = MantoHoras;
      this.mantoInformeSemanalConfService.setDataOriginal(this.horas, "transaccional");
      
      //obtenemos las horas propuestas, utilizadas, disponibles y excedidas para cada mes
      //antes del mes del informe
      for (let i = 1; i < Number(this.monthInforme); i++) {
        this.totales[i] = [];

        //propuestas
        this.totales[i]['propuestas'] = this.mantoInformeSemanalConfService.getHorasPropuestasValor(this.yearInforme, i, "transaccional");

        //utilizadas
        this.totales[i]['utilizadas'] = this.mantoInformeSemanalConfService.getHorasUtilizadasValor(Number(this.yearInforme), i, "transaccional");

        //disponibles
        this.totales[i]['disponibles'] = this.totales[i]['propuestas'] - this.totales[i]['utilizadas'];
        if(this.totales[i]['disponibles']<=0) this.totales[i]['disponibles'] = 0;

        //excedidas
        if(this.totales[i]['propuestas'] - this.totales[i]['utilizadas'] >= 0) {
          this.totales[i]['excedidas'] = 0;
        } else this.totales[i]['excedidas'] = (this.totales[i]['propuestas'] - this.totales[i]['utilizadas']) * -1;
      }

      // *********************
      //mes del informe
      this.totales[Number(this.monthInforme)] = [];
      
      ///propuestas
      this.totales[Number(this.monthInforme)]['propuestas'] = this.mantoInformeSemanalConfService.getHorasPropuestasValor(this.yearInforme, Number(this.monthInforme), "transaccional");
      
      //utilizadas
      this.totales[Number(this.monthInforme)]['utilizadas'] = 0;
      this.jsonArrayHoras.forEach(element => {
        this.totales[Number(this.monthInforme)]['utilizadas'] += Number(element.horas);
      });
      
      //disponibles
      this.totales[Number(this.monthInforme)]['disponibles'] = this.totales[Number(this.monthInforme)]['propuestas'] - this.totales[Number(this.monthInforme)]['utilizadas'];
      if(this.totales[Number(this.monthInforme)]['disponibles'] <= 0){
        this.totales[Number(this.monthInforme)]['disponibles'] = 0;
      }

      //excedidas
      if(this.totales[Number(this.monthInforme)]['propuestas'] - this.totales[Number(this.monthInforme)]['utilizadas'] >= 0) {
        this.totales[Number(this.monthInforme)]['excedidas'] = 0;
      } else {
        this.totales[Number(this.monthInforme)]['excedidas'] = (this.totales[Number(this.monthInforme)]['propuestas'] - this.totales[Number(this.monthInforme)]['utilizadas']) * -1;
      }

      //***********************
      //después del mes del informe
      for (let i = Number(this.monthInforme)+1; i <= 12; i++) {
        this.totales[i] = [];
        //propuestas
        this.totales[i]['propuestas'] = this.mantoInformeSemanalConfService.getHorasPropuestasValor(this.yearInforme, i, "transaccional");

        //utilizadas
        //disponibles
        //excedidas
      }

      this.sumas['propuestas'] = 0;
      this.sumas['utilizadas'] = 0;
      this.sumas['disponibles'] = 0;
      this.sumas['excedidas'] = 0;
      
      this.getSuma();
      this.createChart();
    });

    //this.obs.unsubscribe();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe;
  }  

  //asigna las variables correspondientes a la suma de todos los meses
  getSuma(){
    for (let i = 1; i <= 12; i++) {
      //utilizadas
      if(this.totales[i]['utilizadas']) {
        this.sumas['utilizadas'] += this.totales[i]['utilizadas'];
      }

      //propuestas
      if(this.totales[i]['propuestas']) {
        this.sumas['propuestas'] += this.totales[i]['propuestas'];
      }

      //disponibles
      if(this.totales[i]['disponibles']) {
        this.sumas['disponibles'] += Number(this.totales[i]['disponibles']);
      }

      //excedidas
      if(this.totales[i]['excedidas']) {
        this.sumas['excedidas'] += this.totales[i]['excedidas'];
      }
    }

    this.sumas['propuestas'] = Math.round(this.sumas['propuestas']);
    this.sumas['utilizadas'] = Math.round(this.sumas['utilizadas']);
    this.sumas['disponibles'] = Math.round(this.sumas['disponibles']);
    this.sumas['excedidas'] = Math.round(this.sumas['excedidas']);
  }

  //crea el gráfico que se muestra
  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'pie',

      data: {
        labels: [
                  'HH Utilizadas '+ this.totales[Number(this.monthInforme)]['utilizadas'], 
                  'HH Disponibles ' + this.totales[Number(this.monthInforme)]['disponibles']
                ], 
	      
        datasets: [
          {
              data: [this.totales[Number(this.monthInforme)]['utilizadas'], this.totales[Number(this.monthInforme)]['disponibles']],
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
                  'PRB ' + this.barras['PRB']
                ], 
	      
        datasets: [
          {
            label: "label",
              data: [
                this.barras['GEST'],
                this.barras['INC'],
                this.barras['MJR'],
                this.barras['SPT'],
                this.barras['PRB']
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

  generaNuevoPDF(){
    html2canvas(this.el.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('img/jpg');

      html2canvas(this.elBarra.nativeElement).then((canvas) => {
        const barraData = canvas.toDataURL('img/jpg');

          html2canvas(this.elTabla.nativeElement).then((canvas) => {
            const tblData = canvas.toDataURL('img/jpg');
      
            this.pdfService.generaPDF(this.monthInforme, this.yearInforme, imgData, tblData, barraData);
          });
        });
    });

  }

    //asigna al arreglo detalleExcel para obtener los detalles a generar en un excel
    getDetalleExcel(){
      this.detalleExcel = [];

      this.jsonArrayHoras.forEach(element => {
        let index = this.detalleExcel.findIndex( ars  => ars['numeroArs'] === element.numeroArs);

        if(index == -1){
          //creamos un ars para agregar al arreglo detalleExcel
          let arsExcel = {
            numeroArs: element.numeroArs,
            horas: Number(element.horas),
            descripcion: element.descripcion,
            lineaDeServicio: element.lineaDeServicio,
            aplicacion: element.aplicacion,
            solicitante: element.solicitante
          }
          this.detalleExcel.push(arsExcel);
        } else {
          let horasSumar = Number(this.detalleExcel[index].horas);
          this.detalleExcel[index].horas = Number(element.horas) + horasSumar;
        }
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
      worksheet.getColumn(5).width = 18;
       
      const headerCS = [
          'Descripción',
          'Horas Incurridas',
          'Línea de Servicio',
          'Sistema',
          'Solicitante'
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
                d['solicitante']
              ];

          worksheet.addRow(newRow);
        });
   
      let sumaRow = [
        'Total', 
        sumaIncurridas,
        '',
        '',
        ''
      ];

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
      let filename = 'Detalle_Mantencion_';
      filename += this.monthNames[Number(this.monthInforme)-1];
      filename += '_';
      filename +=  this.yearInforme;
     
      filename += '.xlsx';
  
      fs.saveAs(blob, filename);
    });
  }
}