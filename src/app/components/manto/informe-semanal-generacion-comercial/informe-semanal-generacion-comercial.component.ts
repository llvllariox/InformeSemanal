import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { MantoInformeSemanalService } from 'src/app/services/manto-informe-semanal.service';
import { MantoInformeSemanalConfService } from 'src/app/services/manto-informe-semanal-conf.service';
import { MantoInformeSemanalFirebaseService } from 'src/app/services/manto-informe-semanal-firebase.service';
import { MantoInformeSemanalJspdfService } from '../../../services/manto-informe-semanal-jspdf.service';
import { Subscription } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import html2canvas from 'html2canvas';
import HoraC from '../../../model/horaC.interface';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-informe-semanal-generacion-comercial',
  templateUrl: './informe-semanal-generacion-comercial.component.html'
})
export class InformeSemanalGeneracionComercialComponent implements OnInit {
  jsonArrayHoras = [];

  horas: HoraC[];
  totales = [];
  sumas = [];

  yearInforme;
  monthInforme;
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  detalleExcel = [];
  flagExcel = false;

  subscription: Subscription;

  horasUtilizadasOriginal = 0;
  horasPropuestasOriginal = 0;

  public chart: any;
  public chartBarra: any;
  barras = [];

  @ViewChild('MyChart', {static:false}) el!: ElementRef;
  @ViewChild('tablaConsumoTotal', {static:false}) elTabla!: ElementRef;
  @ViewChild('MyChartBarra', {static:false}) elBarra!: ElementRef;
  
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

    let fechaInforme = this.mantoInformeSemanalService.getFechaInforme();
    this.yearInforme = fechaInforme.slice(0,4);
    this.monthInforme = fechaInforme.slice(5,7);

    this.jsonArrayHoras = this.mantoInformeSemanalService.getJsonDataMantoInformeSemanal();

    this.getDetalleExcel();

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
    this.subscription = this.mantoInformeSemanalFirebaseService.getHorasC().subscribe(MantoHorasC => {
      console.log("init generar comercial");

      let horaCTemp;
      this.horas = MantoHorasC;
      this.mantoInformeSemanalConfService.setDataCOriginal(this.horas);

      //obtenemos las horas  para cada mes

      // ***********************************
      //antes del mes del informe 
      for (let i = 1; i < Number(this.monthInforme); i++) {
        this.totales[i] = [];

        horaCTemp = this.mantoInformeSemanalConfService.getHoraC(this.yearInforme, i);
        
        //utilizadas
        this.totales[i]['utilizadas'] = horaCTemp.utilizadas;

        //anterior
        if(i==1){
          this.totales[i]['anteriores'] = 0;
        } else{
          this.totales[i]['anteriores'] = horaCTemp.anteriores; 
        }

        //propuestas
        this.totales[i]['propuestas'] = horaCTemp.propuestas;

        //diferencia
        this.totales[i]['diferencia'] = horaCTemp.propuestas - horaCTemp.utilizadas;
      }

      // ***********************************
      //mes del informe
      let mesActual = Number(this.monthInforme);

      this.totales[mesActual] = [];
      
      ///propuestas
      this.totales[mesActual]['propuestas'] = this.mantoInformeSemanalConfService.getHoraC(this.yearInforme, Number(this.monthInforme)).propuestas;
      this.horasPropuestasOriginal = this.totales[mesActual]['propuestas'];
      
      //utilizadas
      this.totales[mesActual]['utilizadas'] = 0;
      this.jsonArrayHoras.forEach(element => {
        this.totales[mesActual]['utilizadas'] += Number(element.horas);
      });
      this.totales[mesActual]['utilizadas'] = Math.round(this.totales[mesActual]['utilizadas']);
      
      this.horasUtilizadasOriginal = this.totales[mesActual]['utilizadas'];

      //anterior
      if(mesActual != 1){
        this.totales[mesActual]['anteriores'] = this.mantoInformeSemanalConfService.getHoraC(this.yearInforme, Number(this.monthInforme)).anteriores; 
      }

      //sumamos las horas anteriores
      if(this.totales[mesActual]['anteriores'] < 0){
        this.totales[mesActual]['utilizadas'] += -1*this.totales[mesActual]['anteriores'];
      }

      //diferencia
      this.totales[mesActual]['diferencia'] = this.totales[mesActual]['propuestas'] - this.totales[mesActual]['utilizadas'];


      //*************************************
      //después del mes del informe
      
      for (let i = Number(this.monthInforme)+1; i <= 12; i++) {
        this.totales[i] = [];
        horaCTemp = this.mantoInformeSemanalConfService.getHoraC(this.yearInforme, i);

        //propuestas
        this.totales[i]['propuestas'] = horaCTemp.propuestas;
      }

      this.sumas['utilizadas'] = 0;
      this.sumas['anteriores'] = 0;
      this.sumas['propuestas'] = 0;
      this.sumas['diferencia'] = 0;
      
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
    this.sumas['anteriores'] = 0;
    this.sumas['diferencia'] = 0;

    for (let i = 1; i <= 12; i++) {
      //utilizadas
      if(this.totales[i]['utilizadas']) {
        this.sumas['utilizadas'] += this.totales[i]['utilizadas'];
      }

      //propuestas
      if(this.totales[i]['propuestas']) {
        this.sumas['propuestas'] += this.totales[i]['propuestas'];
      }

      //diferencia
      if(this.totales[i]['diferencia']) {
        this.sumas['diferencia'] += this.totales[i]['diferencia'];
      }

      //anteriores
      if(this.totales[i]['anteriores']) {
        this.sumas['anteriores'] += this.totales[i]['anteriores'];
      }
    }

    this.sumas['utilizadas'] = (this.sumas['utilizadas']);
    this.sumas['anteriores'] = (this.sumas['anteriores']);
    this.sumas['propuestas'] = (this.sumas['propuestas']);
    this.sumas['diferencia'] = (this.sumas['diferencia']);
  }

  //asigna al arreglo detalleExcel para obtener los detalles a generar en un excel
  getDetalleExcel(){
    this.detalleExcel = [];

    this.jsonArrayHoras.forEach(element => {
      let index = this.detalleExcel.findIndex(ars => ars['numeroArs'] === element.numeroArs);
      
      if(element['numeroArs'] == '4409'){
        console.log('hola');
      }

      if(index == -1){
        //creamos un ars para agregar al arreglo detalleExcel
        let arsExcel = {
          numeroArs: element.numeroArs,
          horas: (Number(element.horas)),
          descripcion: element.descripcion,
          lineaDeServicio: element.lineaDeServicio,
          aplicacion: element.aplicacion,
          solicitante: element.solicitante
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
                  'PRB ' + this.barras['PRB']
                ], 
	      
        datasets: [
          {
            label: "",
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

      //anterior
      //mes del informe
      let inputAnterioresValue = (<HTMLInputElement>document.getElementById('inputAnterioresActual')).value;
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
      }

      let mesActual = Number(this.monthInforme);
      if(mesActual != 1){
        //sumamos las horas anteriores
        if(this.totales[mesActual]['anterior'] < 0){
        }
      }
      
      let sumaRow = [
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
      
            this.pdfService.generaPDFComercial(this.monthInforme, this.yearInforme, imgData, tblData, barraData);
          });
        });
    });
  }

  cambioActual(accion){
    let inputAnterioresValue = (<HTMLInputElement>document.getElementById('inputAnterioresActual')).value;

    if(accion=="anterior"){
      (<HTMLInputElement>document.getElementById('inputUtilizadasActual')).value = (Number(this.horasUtilizadasOriginal) - Number(inputAnterioresValue)).toString();
      (<HTMLInputElement>document.getElementById('inputDiferenciaActual')).value = (Number(this.horasPropuestasOriginal) - Number((<HTMLInputElement>document.getElementById('inputUtilizadasActual')).value)).toString();

      this.totales[Number(this.monthInforme)]['utilizadas'] = (<HTMLInputElement>document.getElementById('inputUtilizadasActual')).value;

      //sumamos todas las utilizadas para volver a calcular el total
      let total = 0;
      for (let i = 1; i<=12; i++) {
        if(this.totales[i]['utilizadas']) total +=(Number(this.totales[i]['utilizadas']));
      }
      
      (<HTMLInputElement>document.getElementById('totalUtilizadas')).innerHTML = total.toString();      

      this.getSuma();

      //se destruyen los canvas
      this.chart.destroy();
      this.chartBarra.destroy();

      this.createChart();
    }
  }
}
