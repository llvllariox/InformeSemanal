import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConsolidarDataService } from '../../services/consolidar-json-data.service';
import { ConsolidarJspdfService } from 'src/app/mantenimiento/consolidar/services/consolidar-jspdf.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';

import Chart from 'chart.js/auto';
import { Workbook } from 'exceljs';
import html2canvas from 'html2canvas';
import * as fs from 'file-saver';

@Component({
  selector: 'consolidar-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarConsolidarComponent implements OnInit {

  public jsonDataHorasComercial: [][] = [];
  public jsonDataHorasTransaccional: [][] = [];

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

  public barrasHorasComercial: Chart;
  public barrasPorcentajeComercial: Chart;
  public horasMesComercial: Chart;
  public horasMesPorAreaComercial: Chart;

  public barrasHorasTransaccional: Chart;
  public barrasPorcentajeTransaccional: Chart;
  public horasMesTransaccional: Chart;
  public horasMesPorAreaTransaccional: Chart;

  @ViewChild('barrasHoras', {static:false}) eBarrasHoras!: ElementRef;
  @ViewChild('barrasPorcentaje', {static:false}) eBarrasPorcentaje!: ElementRef;
  @ViewChild('horasMes', {static:false}) eHorasMes!: ElementRef;
  @ViewChild('horasMesPorArea', {static:false}) eHorasMesPorArea!: ElementRef;

  @ViewChild('barrasHorasComercial', {static:false}) eBarrasHorasComercial!: ElementRef;
  @ViewChild('barrasPorcentajeComercial', {static:false}) eBarrasPorcentajeComercial!: ElementRef;
  @ViewChild('horasMesComercial', {static:false}) eHorasMesComercial!: ElementRef;
  @ViewChild('horasMesPorAreaComercial', {static:false}) eHorasMesPorAreaComercial!: ElementRef;

  @ViewChild('barrasHorasTransaccional', {static:false}) eBarrasHorasTransaccional!: ElementRef;
  @ViewChild('barrasPorcentajeTransaccional', {static:false}) eBarrasPorcentajeTransaccional!: ElementRef;
  @ViewChild('horasMesTransaccional', {static:false}) eHorasMesTransaccional!: ElementRef;
  @ViewChild('horasMesPorAreaTransaccional', {static:false}) eHorasMesPorAreaTransaccional!: ElementRef;
 
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
        this.detalles[mes]['GLD'] = 0;

        this.jsonDataHorasComercial[mes] = [];
        this.jsonDataHorasComercial[mes]['Detalles'] = consolidarDataService.getJsonDataHorasComercial(mes);
        this.jsonDataHorasComercial[mes]['Soporte'] = 0;
        this.jsonDataHorasComercial[mes]['Incidente'] = 0;
        this.jsonDataHorasComercial[mes]['Problema'] = 0;
        this.jsonDataHorasComercial[mes]['Gestion'] = 0;
        this.jsonDataHorasComercial[mes]['Mantenimiento'] = 0;
        this.jsonDataHorasComercial[mes]['GLD'] = 0;

        this.jsonDataHorasTransaccional[mes] = [];
        this.jsonDataHorasTransaccional[mes]['Detalles'] = consolidarDataService.getJsonDataHorasTransaccional(mes);
        this.jsonDataHorasTransaccional[mes]['Soporte'] = 0;
        this.jsonDataHorasTransaccional[mes]['Incidente'] = 0;
        this.jsonDataHorasTransaccional[mes]['Problema'] = 0;
        this.jsonDataHorasTransaccional[mes]['Gestion'] = 0;
        this.jsonDataHorasTransaccional[mes]['Mantenimiento'] = 0;
      }); 

      //console.log(this.jsonDataHorasComercial);
      this.redondear();
      //console.log(this.jsonDataHorasComercial);

      // Presupuesto
      this.detalles['Enero']['Presupuesto'] = 1479;
      this.detalles['Febrero']['Presupuesto'] = 1479;
      this.detalles['Marzo']['Presupuesto'] = 1479;
      this.detalles['Abril']['Presupuesto'] = 1479;
      this.detalles['Mayo']['Presupuesto'] = 1479;
      this.detalles['Junio']['Presupuesto'] = 1479;
      this.detalles['Julio']['Presupuesto'] = 1479;
      this.detalles['Agosto']['Presupuesto'] = 1479;
      this.detalles['Septiembre']['Presupuesto'] = 1479;
      this.detalles['Octubre']['Presupuesto'] = 1479;
      this.detalles['Noviembre']['Presupuesto'] = 1479;
      this.detalles['Diciembre']['Presupuesto'] = 1479;

      this.jsonDataHorasComercial['Enero']['Presupuesto'] = 773;
      this.jsonDataHorasComercial['Febrero']['Presupuesto'] = 773;
      this.jsonDataHorasComercial['Marzo']['Presupuesto'] = 773;
      this.jsonDataHorasComercial['Abril']['Presupuesto'] = 773;
      this.jsonDataHorasComercial['Mayo']['Presupuesto'] = 773;
      this.jsonDataHorasComercial['Junio']['Presupuesto'] = 773;
      this.jsonDataHorasComercial['Julio']['Presupuesto'] = 923;
      this.jsonDataHorasComercial['Agosto']['Presupuesto'] = 760;
      this.jsonDataHorasComercial['Septiembre']['Presupuesto'] = 760;
      this.jsonDataHorasComercial['Octubre']['Presupuesto'] = 760;
      this.jsonDataHorasComercial['Noviembre']['Presupuesto'] = 760;
      this.jsonDataHorasComercial['Diciembre']['Presupuesto'] = 760;

      this.jsonDataHorasTransaccional['Enero']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Febrero']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Marzo']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Abril']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Mayo']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Junio']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Julio']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Agosto']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Septiembre']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Octubre']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Noviembre']['Presupuesto'] = 706;
      this.jsonDataHorasTransaccional['Diciembre']['Presupuesto'] = 706;

      this.sumarLineaDeServicio('');
      this.sumarLineaDeServicio('Comercial');
      this.sumarLineaDeServicio('Transaccional');

      //suma de los detalles
      this.detalles['total']['Presupuesto'] = 0;
      this.jsonDataHorasComercial['total']['Presupuesto'] = 0;
      this.jsonDataHorasTransaccional['total']['Presupuesto'] = 0;

      this.monthNames.forEach(mes => {
        this.detalles['total']['Presupuesto'] += this.detalles[mes]['Presupuesto'];
        this.jsonDataHorasComercial['total']['Presupuesto'] += this.jsonDataHorasComercial[mes]['Presupuesto'];
        this.jsonDataHorasTransaccional['total']['Presupuesto'] += this.jsonDataHorasTransaccional[mes]['Presupuesto'];
      });

      this.porcentajeHorasConsumidas();
      this.totalPorcentajeHorasConsumidas();
  }

  ngOnInit(): void {
    this.horasUtilizadasPorAreaDeServicio('');
    this.horasUtilizadasPorAreaDeServicio('Comercial');
    this.horasUtilizadasPorAreaDeServicio('Transaccional');

    this.porcentajeHorasUtilizadasPorAreaDeServicio('');
    this.porcentajeHorasUtilizadasPorAreaDeServicio('Comercial');
    this.porcentajeHorasUtilizadasPorAreaDeServicio('Transaccional');

    this.horasPorMes('');
    this.horasPorMes('Comercial');
    this.horasPorMes('Transaccional')
    
    this.horasPorMesPorArea('');
    this.horasPorMesPorArea('Comercial');
    this.horasPorMesPorArea('Transaccional');
  }

  //suma las horas de acuerdo a su linea de servicio
  sumarLineaDeServicio(tipo: string): void {
    let soporte = 0;
    let incidente = 0;
    let problema = 0;
    let gestion = 0;
    let mantenimiento = 0;
    let gld = 0;

    let data = [];

    if(tipo == ''){
      this.detalles['total'] = [];
      this.detalles['total']['Soporte'] = 0;
      this.detalles['total']['Incidente'] = 0;
      this.detalles['total']['Problema'] = 0;
      this.detalles['total']['Gestion'] = 0;
      this.detalles['total']['Mantenimiento'] = 0;
      this.detalles['total']['GLD'] = 0;
      this.detalles['total']['HHConsumidas'] = 0;

    } else if(tipo == 'Comercial'){
      this.jsonDataHorasComercial['total'] = [];
      this.jsonDataHorasComercial['total']['Soporte'] = 0;
      this.jsonDataHorasComercial['total']['Incidente'] = 0;
      this.jsonDataHorasComercial['total']['Problema'] = 0;
      this.jsonDataHorasComercial['total']['Gestion'] = 0;
      this.jsonDataHorasComercial['total']['Mantenimiento'] = 0;
      this.jsonDataHorasComercial['total']['GLD'] = 0;
      this.jsonDataHorasComercial['total']['HHConsumidas'] = 0;

    } else if(tipo == 'Transaccional'){
      this.jsonDataHorasTransaccional['total'] = [];
      this.jsonDataHorasTransaccional['total']['Soporte'] = 0;
      this.jsonDataHorasTransaccional['total']['Incidente'] = 0;
      this.jsonDataHorasTransaccional['total']['Problema'] = 0;
      this.jsonDataHorasTransaccional['total']['Gestion'] = 0;
      this.jsonDataHorasTransaccional['total']['Mantenimiento'] = 0;
      this.jsonDataHorasTransaccional['total']['HHConsumidas'] = 0;
    }

    this.monthNames.forEach(mes => {
      if(tipo == ''){
        data = this.jsonDataHorasComercial[mes]['Detalles']
                .concat(this.jsonDataHorasTransaccional[mes]['Detalles']);
      } else if(tipo == 'Comercial'){
        data = this.jsonDataHorasComercial[mes]['Detalles'];
      } else if(tipo == 'Transaccional'){
        data = this.jsonDataHorasTransaccional[mes]['Detalles'];
      }
      
      let horas = 0;
      data.forEach(element => {
        //horas = Math.round(Number(element.horasIncurridas));

        horas = Number(element.horasIncurridas);

      
        if(element.bloque == "Gestión LD") {
          incidente += horas;
        } else if(element.bloque == "VS - Transversales") {
          gld += horas;
        } else {
          if(element.lineaDeServicio == "Incidentes") {
            incidente += horas;
          } else if(element.lineaDeServicio == "Problemas") {
            problema += horas;
          } else if(element.lineaDeServicio == "Evolutivo Menor") {
            mantenimiento += horas;
          } else if(element.lineaDeServicio == 'Soporte'){
            if(element.bloque == 'Gestión'){
              gestion += horas;
            } else {
              soporte += horas;
            }
          }
        }

        
      });

      let suma = soporte + incidente + problema + gestion + mantenimiento + gld;

      if(tipo == ''){
        this.detalles[mes]['Soporte'] = soporte;
        this.detalles[mes]['Incidente'] = incidente;
        this.detalles[mes]['Problema'] = problema;
        this.detalles[mes]['Gestion'] = gestion;
        this.detalles[mes]['Mantenimiento'] = mantenimiento;
        this.detalles[mes]['GLD'] = gld;

        this.detalles[mes]['HHConsumidas'] = suma;

        this.detalles['total']['Soporte'] += soporte;
        this.detalles['total']['Incidente'] += incidente;
        this.detalles['total']['Problema'] += problema;
        this.detalles['total']['Gestion'] += gestion;
        this.detalles['total']['Mantenimiento'] += mantenimiento;
        this.detalles['total']['GLD'] += gld;
        this.detalles['total']['HHConsumidas'] += suma;

      } else if(tipo == 'Comercial'){
        this.jsonDataHorasComercial[mes]['Soporte'] = soporte;
        this.jsonDataHorasComercial[mes]['Incidente'] = incidente;
        this.jsonDataHorasComercial[mes]['Problema'] = problema;
        this.jsonDataHorasComercial[mes]['Gestion'] = gestion;
        this.jsonDataHorasComercial[mes]['Mantenimiento'] = mantenimiento;
        this.jsonDataHorasComercial[mes]['GLD'] = gld;

        this.jsonDataHorasComercial[mes]['HHConsumidas'] = suma;

        this.jsonDataHorasComercial['total']['Soporte'] += soporte;
        this.jsonDataHorasComercial['total']['Incidente'] += incidente;
        this.jsonDataHorasComercial['total']['Problema'] += problema;
        this.jsonDataHorasComercial['total']['Gestion'] += gestion;
        this.jsonDataHorasComercial['total']['Mantenimiento'] += mantenimiento;
        this.jsonDataHorasComercial['total']['GLD'] += gld;
        this.jsonDataHorasComercial['total']['HHConsumidas'] += suma;

      } else if(tipo == 'Transaccional'){
        this.jsonDataHorasTransaccional[mes]['Soporte'] = soporte;
        this.jsonDataHorasTransaccional[mes]['Incidente'] = incidente;
        this.jsonDataHorasTransaccional[mes]['Problema'] = problema;
        this.jsonDataHorasTransaccional[mes]['Gestion'] = gestion;
        this.jsonDataHorasTransaccional[mes]['Mantenimiento'] = mantenimiento;

        this.jsonDataHorasTransaccional[mes]['HHConsumidas'] = suma;

        this.jsonDataHorasTransaccional['total']['Soporte'] += soporte;
        this.jsonDataHorasTransaccional['total']['Incidente'] += incidente;
        this.jsonDataHorasTransaccional['total']['Problema'] += problema;
        this.jsonDataHorasTransaccional['total']['Gestion'] += gestion;
        this.jsonDataHorasTransaccional['total']['Mantenimiento'] += mantenimiento;
        this.jsonDataHorasTransaccional['total']['HHConsumidas'] += suma;        
      }

      soporte = 0;
      incidente = 0;
      problema = 0;
      gestion = 0;
      mantenimiento = 0;
      gld = 0;
      data = [];
    });
  }

  //grafico Horas utilizadas por área de servicio
  horasUtilizadasPorAreaDeServicio(tipo: string): void {
    let data;
    let variable;

    if(tipo == ''){
      data = this.detalles;
      variable = this.barrasHoras;
    } else if(tipo == 'Comercial'){
      data = this.jsonDataHorasComercial;
      variable = this.barrasHorasComercial;
    } else if(tipo == 'Transaccional'){
      data = this.jsonDataHorasTransaccional;
      variable = this.barrasHorasTransaccional;
    }

    let labels;
    let dataset;

    if(tipo == 'Transaccional'){
      labels = [
        'Soporte ' + data['total']['Soporte'],
        'Incidente ' + data['total']['Incidente'],
        'Problema ' + data['total']['Problema'],
        'Gestion ' + data['total']['Gestion'],
        'Mantenimiento ' + data['total']['Mantenimiento']
      ];

      dataset = [
        data['total']['Soporte'],
        data['total']['Incidente'],
        data['total']['Problema'],
        data['total']['Gestion'],
        data['total']['Mantenimiento']
      ];
    } else {
      labels = [
        'Soporte ' + data['total']['Soporte'],
        'Incidente ' + data['total']['Incidente'],
        'Problema ' + data['total']['Problema'],
        'Gestion ' + data['total']['Gestion'],
        'Mantenimiento ' + data['total']['Mantenimiento'],
        'Gestión LD ' + data['total']['GLD']
      ];

      dataset = [
        data['total']['Soporte'],
        data['total']['Incidente'],
        data['total']['Problema'],
        data['total']['Gestion'],
        data['total']['Mantenimiento'],
        data['total']['GLD']
      ];
    }
    //gráfico de barras
    variable = new Chart("barrasHoras" + tipo, {
      type: 'bar',

      data: {
        labels: labels, 
	      
        datasets: [
          {
            label: "valor",
              data: dataset,
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
  porcentajeHorasUtilizadasPorAreaDeServicio(tipo: string): void {
    let data;
    let variable;

    if(tipo == ''){
      data = this.detalles;
      variable = this.barrasPorcentaje;
    } else if(tipo == 'Comercial'){
      data = this.jsonDataHorasComercial;
      variable = this.barrasPorcentajeComercial;
    } else if(tipo == 'Transaccional'){
      data = this.jsonDataHorasTransaccional;
      variable = this.barrasPorcentajeTransaccional;
    }

    data['porcentaje'] = [];
    data['porcentaje']['Soporte'] = data['total']['Soporte'] / data['total']['HHConsumidas'] * 100;
    data['porcentaje']['Soporte'] = Number.parseInt(data['porcentaje']['Soporte']);

    data['porcentaje']['Incidente'] = data['total']['Incidente'] / data['total']['HHConsumidas'] * 100;
    data['porcentaje']['Incidente'] = Number.parseInt(data['porcentaje']['Incidente']);

    data['porcentaje']['Problema'] = data['total']['Problema'] / data['total']['HHConsumidas'] * 100;
    data['porcentaje']['Problema'] = Number.parseInt(data['porcentaje']['Problema']);

    data['porcentaje']['Gestion'] = data['total']['Gestion'] / data['total']['HHConsumidas'] * 100;
    data['porcentaje']['Gestion'] = Number.parseInt(data['porcentaje']['Gestion']);

    data['porcentaje']['Mantenimiento'] = data['total']['Mantenimiento'] / data['total']['HHConsumidas'] * 100;
    data['porcentaje']['Mantenimiento'] = Number.parseInt(data['porcentaje']['Mantenimiento']);

    if(tipo == 'Transaccional'){

    } else {
      data['porcentaje']['GLD'] = data['total']['GLD'] / data['total']['HHConsumidas'] * 100;
      data['porcentaje']['GLD'] = Number.parseInt(data['porcentaje']['GLD']);
    }


    let labels;
    let dataset;

    if(tipo == 'Transaccional'){
      labels = [
        'Soporte ' + data['porcentaje']['Soporte'] + '%',
        'Incidente ' + data['porcentaje']['Incidente'] + '%',
        'Problema ' + data['porcentaje']['Problema'] + '%',
        'Gestion ' + data['porcentaje']['Gestion'] + '%',
        'Mantenimiento ' + data['porcentaje']['Mantenimiento'] + '%'
      ];

      dataset = [
        data['porcentaje']['Soporte'],
        data['porcentaje']['Incidente'],
        data['porcentaje']['Problema'],
        data['porcentaje']['Gestion'],
        data['porcentaje']['Mantenimiento']
      ];
    } else {
      labels = [
        'Soporte ' + data['porcentaje']['Soporte'] + '%',
        'Incidente ' + data['porcentaje']['Incidente'] + '%',
        'Problema ' + data['porcentaje']['Problema'] + '%',
        'Gestion ' + data['porcentaje']['Gestion'] + '%',
        'Mantenimiento ' + data['porcentaje']['Mantenimiento'] + '%',
        'Gestión LD ' + data['porcentaje']['GLD'] + '%'
      ];

      dataset = [
        data['porcentaje']['Soporte'],
        data['porcentaje']['Incidente'],
        data['porcentaje']['Problema'],
        data['porcentaje']['Gestion'],
        data['porcentaje']['Mantenimiento'],
        data['porcentaje']['GLD']
      ];
    }
    //gráfico de barras
    variable = new Chart("barrasPorcentaje" + tipo, {
      type: 'bar',

      data: {
        labels: labels, 
	      
        datasets: [
          {
            label: "porcentaje",
              data: dataset,
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
  horasPorMes(tipo: string): void{
    let data;
    let variable;

    if(tipo == ''){
      data = this.detalles;
      variable = this.horasMes;
    } else if(tipo == 'Comercial'){
      data = this.jsonDataHorasComercial;
      variable = this.horasMesComercial;
    } else if(tipo == 'Transaccional'){
      data = this.jsonDataHorasTransaccional;
      variable = this.horasMesTransaccional;
    }

    let labels = [];
    this.monthNames.forEach(element => {
      labels.push(element);
    });

    let dataset1 = [];
    this.monthNames.forEach(mes => {
      dataset1.push(data[mes]['HHConsumidas'],);
    });

    let dataset2 = [];
    this.monthNames.forEach(mes => {
      dataset2.push(data[mes]['Presupuesto'],);
    });

    variable = new Chart("horasMes" + tipo, {
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
            display: false,
            text: 'Horas / mes'
          }
        }
      },
    });
  }

  //grafico Horas / mes
  horasPorMesPorArea(tipo: string): void{
    let data;
    let variable;

    if(tipo == ''){
      data = this.detalles;
      variable = this.horasMesPorArea;
    } else if(tipo == 'Comercial'){
      data = this.jsonDataHorasComercial;
      variable = this.horasMesPorAreaComercial;
    } else if(tipo == 'Transaccional'){
      data = this.jsonDataHorasTransaccional;
      variable = this.horasMesPorAreaTransaccional;
    }

    let labels = [];
    this.monthNames.forEach(element => {
      labels.push(element);
    });

    let datasetSoporte = [];
    let datasetIncidente = [];
    let datasetProblema = [];
    let datasetGestion = [];
    let datasetMantenimiento = [];
    let datasetGLD = [];

    this.monthNames.forEach(mes => {
      datasetSoporte.push(data[mes]['Soporte']);
      datasetIncidente.push(data[mes]['Incidente']);
      datasetProblema.push(data[mes]['Problema']);
      datasetGestion.push(data[mes]['Gestion']);
      datasetMantenimiento.push(data[mes]['Mantenimiento']);

      if(tipo != 'Transaccional') datasetGLD.push(data[mes]['GLD']);
    });

    let datasets = [
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
        backgroundColor: '#9fd1f5',
      },
    ];

    if(tipo != 'Transaccional') datasets.push(
      {
        label: 'Gestión LD',
        data: datasetGLD,
        borderColor: '#000000',
        backgroundColor: '#00d100',
      }
    );

    variable = new Chart("horasMesPorArea" + tipo, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
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
      //this.detalles[mes]['Porcentaje'] = this.porcentajeHorasConsumidasPorMes(mes);

      //this.jsonDataHorasComercial[mes]['Porcentaje'] = this.porcentajeHorasConsumidasPorMes(mes);
      //this.jsonDataHorasTransaccional[mes]['Porcentaje'] = this.porcentajeHorasConsumidasPorMes(mes);

      this.detalles[mes]['Porcentaje'] = (this.detalles[mes]['HHConsumidas'] / this.detalles[mes]['Presupuesto'] * 100).toFixed(0);

      this.jsonDataHorasComercial[mes]['Porcentaje'] = (this.jsonDataHorasComercial[mes]['HHConsumidas'] / this.jsonDataHorasComercial[mes]['Presupuesto'] * 100).toFixed(0);
      this.jsonDataHorasTransaccional[mes]['Porcentaje'] = (this.jsonDataHorasTransaccional[mes]['HHConsumidas'] / this.jsonDataHorasTransaccional[mes]['Presupuesto'] * 100).toFixed(0);
    });
  }

  // porcentaje de horas consumidas sobre el presupuesto para el mes
  porcentajeHorasConsumidasPorMes(mes: string): string {
      return this.detalles[mes]['Porcentaje'] = (this.detalles[mes]['HHConsumidas'] / this.detalles[mes]['Presupuesto'] * 100).toFixed(0);
  }

  //  porcentaje de horas totales consumidas sobre el presupuesto total
  totalPorcentajeHorasConsumidas(): void {
    this.detalles['total']['Porcentaje'] = (this.detalles['total']['HHConsumidas'] / this.detalles['total']['Presupuesto'] * 100).toFixed(0);

    this.jsonDataHorasComercial['total']['Porcentaje'] = (this.jsonDataHorasComercial['total']['HHConsumidas'] / this.jsonDataHorasComercial['total']['Presupuesto'] * 100).toFixed(0);
    this.jsonDataHorasTransaccional['total']['Porcentaje'] = (this.jsonDataHorasTransaccional['total']['HHConsumidas'] / this.jsonDataHorasTransaccional['total']['Presupuesto'] * 100).toFixed(0);
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
    //this.horasPorMes();
  }

  //genera un archivo Excel
  generateExcel(){
    let workbook = new Workbook();

    //se crean las hojas
    this.createSheet(workbook, 'Detalles Comercial', this.jsonDataHorasComercial );
    this.createSheetResumen(workbook, 'Resumen Comercial', this.jsonDataHorasComercial, 'Comercial');

    this.createSheet(workbook, 'Detalles Transaccional', this.jsonDataHorasTransaccional);
    this.createSheetResumen(workbook, 'Resumen Transaccional', this.jsonDataHorasTransaccional, 'Transaccional');
 
    this.createSheetResumen(workbook, 'Resumen', this.detalles, '');

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      let filename = 'consolidado_mantencion';
      filename += '.xlsx';

      fs.saveAs(blob, filename);
    });

  }

  //crea una nueva hoja en el excel
  createSheet(workbook, nombre: string, data){
    let worksheet = workbook.addWorksheet(nombre);
    
    // Se establecen anchos de las columnas
    worksheet.getColumn(1).width = 14;
    worksheet.getColumn(2).width = 80;
    worksheet.getColumn(3).width = 16;
    worksheet.getColumn(4).width = 16;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;   
     
    const headerCS = [
        'Periodo',
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

    this.monthNames.forEach(mes => {
      data[mes]['Detalles'].forEach(d => {
        sumaIncurridas += Number(d['horasIncurridas']);
        newRow = [
                mes,
                d['descripcion'], 
                d['horasIncurridas'],
                d['lineaDeServicio'],
                d['sistema'],
                d['solicitante'],
                d['bloque']
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
  createSheetResumen(workbook, nombre: string, data, tipo){
    let worksheet = workbook.addWorksheet(nombre);

    // Se establecen anchos de las columnas
    if(tipo=='Transaccional') {
      worksheet.getColumn(1).width = 14;
      worksheet.getColumn(2).width = 14;
      worksheet.getColumn(3).width = 14;
      worksheet.getColumn(4).width = 14;
      worksheet.getColumn(5).width = 14;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 12;
      worksheet.getColumn(8).width = 18;  
      worksheet.getColumn(9).width = 18;
    } else {
      worksheet.getColumn(1).width = 14;
      worksheet.getColumn(2).width = 14;
      worksheet.getColumn(3).width = 14;
      worksheet.getColumn(4).width = 14;
      worksheet.getColumn(5).width = 14;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 22;
      worksheet.getColumn(8).width = 12;
      worksheet.getColumn(9).width = 18;  
      worksheet.getColumn(10).width = 18;
    }
     
    const headerCS = [
        'Periodo',
        'Soporte',
        'Incidente',
        'Problema',
        'Gestión',
        'Mantenimiento',
    ];

    if(tipo!='Transaccional') headerCS.push('Gestión LD');

    headerCS.push('%');
    headerCS.push('HH Consumidas');
    headerCS.push('Presupuesto');

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
    
    this.monthNames.forEach(mes => {
      let newRow;
      newRow = [
        mes,
        data[mes]['Soporte'],
        data[mes]['Incidente'],
        data[mes]['Problema'],
        data[mes]['Gestion'],
        data[mes]['Mantenimiento'],
        data[mes]['GLD'],
        Number(data[mes]['Porcentaje']), 
        data[mes]['HHConsumidas'],
        data[mes]['Presupuesto']
      ];

      if(tipo == 'Transaccional'){
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
      }
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
      data['total']['GLD'],
      Number(data['total']['Porcentaje']), 
      data['total']['HHConsumidas'],
      data['total']['Presupuesto']
    ];

    if(tipo == 'Transaccional'){
      totalRow  = [
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
    }
    
  
    worksheet.addRow(totalRow);
  }  

  //genera un archivo PDF
  //tipo = '' -> resumen
  //tipo 'Comercial' | 'Transaccional'
  generaNuevoPDF(tipo: string){
    this.sweetAlertService.mensajeEsperar2().then(resp=>{
      
      
      if(tipo ==  ''){

        html2canvas(this.eBarrasHoras.nativeElement).then((canvas) => {
          const imgBarrasHoras = canvas.toDataURL('img/jpg');
  
          html2canvas(this.eBarrasPorcentaje.nativeElement).then((canvas) => {
            const imgBarrasPorcentaje = canvas.toDataURL('img/jpg');
  
            html2canvas(this.eHorasMes.nativeElement).then((canvas) => {
              const imgHorasMes = canvas.toDataURL('img/jpg');
  
              html2canvas(this.eHorasMesPorArea.nativeElement).then((canvas) => {
                const imgHorasMesPorArea = canvas.toDataURL('img/jpg');
  
                  this.pdfService.generaPDF(
                      '',
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
        
      } else if(tipo == 'Comercial') {

        html2canvas(this.eBarrasHorasComercial.nativeElement).then((canvas) => {
          const imgBarrasHoras = canvas.toDataURL('img/jpg');
  
          html2canvas(this.eBarrasPorcentajeComercial.nativeElement).then((canvas) => {
            const imgBarrasPorcentaje = canvas.toDataURL('img/jpg');
  
            html2canvas(this.eHorasMesComercial.nativeElement).then((canvas) => {
              const imgHorasMes = canvas.toDataURL('img/jpg');
  
              html2canvas(this.eHorasMesPorAreaComercial.nativeElement).then((canvas) => {
                const imgHorasMesPorArea = canvas.toDataURL('img/jpg');
  
                  this.pdfService.generaPDF(
                      'Comercial',
                      this.jsonDataHorasComercial,
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
        
      }if(tipo ==  'Transaccional'){
        
        html2canvas(this.eBarrasHorasTransaccional.nativeElement).then((canvas) => {
          const imgBarrasHoras = canvas.toDataURL('img/jpg');
  
          html2canvas(this.eBarrasPorcentajeTransaccional.nativeElement).then((canvas) => {
            const imgBarrasPorcentaje = canvas.toDataURL('img/jpg');
  
            html2canvas(this.eHorasMesTransaccional.nativeElement).then((canvas) => {
              const imgHorasMes = canvas.toDataURL('img/jpg');
  
              html2canvas(this.eHorasMesPorAreaTransaccional.nativeElement).then((canvas) => {
                const imgHorasMesPorArea = canvas.toDataURL('img/jpg');
  
                  this.pdfService.generaPDF(
                      'Transaccional',
                      this.jsonDataHorasTransaccional,
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

      }
    });
  }

  //le aplica Math.roud a todas las horas de 
  redondear(): void{
    this.monthNames.forEach(mes => {
      this.jsonDataHorasComercial[mes]['Detalles'].forEach(element => {
        element.horasIncurridas = Math.round(element.horasIncurridas);
      });

      this.jsonDataHorasTransaccional[mes]['Detalles'].forEach(element => {
        element.horasIncurridas = Math.round(element.horasIncurridas);
      });      
    });

  }
}