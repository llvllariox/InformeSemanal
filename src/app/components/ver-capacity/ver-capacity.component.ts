import { Component, OnInit, setTestabilityGetter } from '@angular/core';
import { CapacityService } from '../../services/capacity.service';
declare function init_customJS();
import * as moment from 'moment'; //
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { exit } from 'process';
import { Console } from 'console';
import { jsDocComment } from '@angular/compiler';

@Component({
  selector: 'app-ver-capacity',
  templateUrl: './ver-capacity.component.html',
  styleUrls: ['./ver-capacity.component.css']
})
export class VerCapacityComponent implements OnInit {

  fecha1;
  fecha2;
  hoy;
  Mttovalor1 = 2340.00;
  Mttovalor2 = 900.00;
  Mttovalor3 = 2340.00;
  Mttovalor4 = 900.00;
  Reservavalor1 = 0;
  Reservavalor2 = 0;
  Ejecucion2 = 0;
  fileName = 'ExcelSheet.xlsx';
  finMes;
  dias;
  mostrarVal = true;
  mostrarVal2 = true;
  textoVar = 'Detalle';

  jsonDataReq = null;
  tablaRequerimientos = [];
  arregloBloques = [];
  totalReq = [];

  primeraFecha;
  segundaFecha;
  terceraFecha;
  primeraFechaTabla;
  segundaFechaTabla;
  terceraFechaTabla;
  tablaReqPrimerMes = [];
  tablaReqSegundoMes = [];
  tablaReqTercerMes = [];
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  constructor(public capacityService: CapacityService) {
    init_customJS();

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Se obtienen fecha del mes en curso y el siguiente
    this.fecha1 = capitalizeFirstLetter(moment().lang('es').format('MMMM-YY'));
    this.hoy = moment().lang('es').format('DD-MM-YYYY');
    this.finMes = moment().endOf('month');
    this.fecha2 = capitalizeFirstLetter(moment().lang('es').add(1, 'months').format('MMMM-YY'));
    this.dias =  Number(this.finMes.format('DD'));

    // this.capacityService.horasMtto = this.Mttovalor1 + this.Mttovalor2;

    //Requerimientos
    this.jsonDataReq = capacityService.getJsonDataReqService();
    this.getFechasReq();
    this.getTablaRequerimientos(this.jsonDataReq);

    console.log('SALIDA');
    console.log(this.tablaRequerimientos);
  }

  ngOnInit(): void {
  }

  eliminar(i){
    // se elimina registro del arreglo y se recalculan los totales
    this.capacityService.jsonDataPlanService.splice(i, 1);
    this.capacityService.totalporDia();
    this.capacityService.totalEjecucion();
    this.capacityService.capacidadDisponible();
    this.capacityService.totCapacidadDisponible();
  }

  eliminarCS(i){
    // se elimina registro del arreglo y se recalculan los totales
    this.capacityService.jsonDataPlanServiceCS.splice(i, 1);
    this.capacityService.totalEjecucionCS();
  }
  cambiarTotal(){
    // Si se cambian valores de manteniemiento se recalculan la capacidad disponible y total de capacidad por dia.
    // this.capacityService.horasMtto = this.Mttovalor1 + this.Mttovalor2;
    this.capacityService.totalHorasMtto1 = this.capacityService.horasMttoBO1 + this.capacityService.horasMttoBE1;
    // this.capacityService.totalHorasMtto2 =  this.capacityService.horasMttoBO2 + this.capacityService.horasMttoBE2;
    this.capacityService.capacidadDisponible();
    this.capacityService.totCapacidadDisponible();

  }

  cambiarTotal2(){
    // Si se cambian valores de manteniemiento se recalculan la capacidad disponible y total de capacidad por dia.
    this.capacityService.totalHorasMtto2 =  this.capacityService.horasMttoBO2 + this.capacityService.horasMttoBE2;

  }
  cambiarTotalCS(){
    // Si se cambian valores de CS se recalcula el total
    this.capacityService.totalEjecucionCS();
  }

  cambiaValor() {
    this.mostrarVal = !this.mostrarVal;
  }
  cambiaValor2() {
    this.mostrarVal2 = !this.mostrarVal2;

    if (!this.mostrarVal2){
      this.textoVar = 'Resumen';
    } else {
      this.textoVar = 'Detalle';
    }
  }

  generateExcel() {

    // Se crea Tabla de Capacity
    const title = 'Capacity';
    const header = ['Distribución Capacity en HH	', this.fecha1, this.fecha2];
    const data = [
      ['FTE Comprometido', 18.00, 18.00],
      ['Total Capacity Mes Comprometido', 3240.00,  3240.00],
      ['Evolutivos', this.capacityService.totalMes1 + this.Reservavalor1,  this.capacityService.totalMes2 + this.Reservavalor2],
      ['   En ejecución	', this.capacityService.totalMes1, this.capacityService.totalMes2],
      ['Mantención', this.capacityService.totalHorasMtto1, this.capacityService.totalHorasMtto2],
      ['   Mantención Backoffice', this.capacityService.horasMttoBO1 , this.capacityService.horasMttoBO2],
      ['   Mantención Backend		', this.capacityService.horasMttoBE1 , this.capacityService.horasMttoBE2],
      // tslint:disable-next-line: max-line-length
      ['Uso Baseline SWF	', this.capacityService.totalMes1 + this.capacityService.totalHorasMtto1, this.capacityService.totalMes2 + this.capacityService.totalHorasMtto2],
      // tslint:disable-next-line: max-line-length,
      ['','' ,''],
    ];

    let HorasDisp1 = 0;
    let HorasDisp2 = 0;

    if(3240 - this.capacityService.totalMes1 + this.capacityService.totalHorasMtto1 <= 0){
      HorasDisp1 = 0;
    }
    else
    {
      HorasDisp1 = 3240 - this.capacityService.totalMes1 + this.capacityService.totalHorasMtto1;
    }

    if(3240 - this.capacityService.totalMes2 + this.capacityService.totalHorasMtto2 <= 0){
      HorasDisp2 = 0;
    }
    else
    {
      HorasDisp2 = 3240 - this.capacityService.totalMes2 + this.capacityService.totalHorasMtto2;
    }

    data.push(['HH disponibles SWF (Fuera de Baseline)', HorasDisp1, HorasDisp2],);
    data.push(['','' ,'']);
    data.push(['Capacity Services', this.capacityService.totalMes1CS, this.capacityService.totalMes2CS],);
    data.push(['','' ,'']);
    data.push(['Total Uso Fábrica', this.capacityService.totalMes1 + this.capacityService.totalHorasMtto1 + this.capacityService.totalMes1CS,  this.capacityService.totalMes2 + this.capacityService.totalHorasMtto2 + this.capacityService.totalMes2CS],);

    // Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Capacity');
    let subTitleRow = worksheet.addRow(['Fecha Reporte : ' + this.hoy]);

    worksheet.mergeCells('A1:C2');
    // Blank Row;
    worksheet.addRow([]);
    // Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },

      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = {
        color: {argb: 'FFFFFF'},
        bold: true,
        italic: true
      };
    });
    // se correo arreglo de tabla de capacity dandole formato a cada celda
    data.forEach(d => {
      let row = worksheet.addRow(d);
      row.getCell(2).style = {numFmt: '#,##0.00'};
      row.getCell(3).style = {numFmt: '#,##0.00'};
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    }
    );

    // Se establecen anchos de las columnas
    worksheet.getColumn(1).width = 55;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 30;

    // se formateando alguna celdas segun tabla de capacity(Backgournd color, bold, italic entre otras)
    worksheet.getRow(5).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' }, bgColor: { argb: 'F2F2F2' }};
    worksheet.getRow(5).getCell(1).alignment = {horizontal: 'center'};
    worksheet.getRow(5).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' }, bgColor: { argb: 'F2F2F2' }};
    worksheet.getRow(5).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' }, bgColor: { argb: 'F2F2F2' }};
    worksheet.getRow(6).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' }, bgColor: { argb: 'D9E1F2' }};
    worksheet.getRow(6).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' }, bgColor: { argb: 'D9E1F2' }};
    worksheet.getRow(6).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9E1F2' }, bgColor: { argb: 'D9E1F2' }};
    worksheet.getRow(7).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(7).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(7).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(9).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(9).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(9).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(12).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(12).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(12).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(14).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' }, bgColor: { argb: 'D9D9D9' }};
    worksheet.getRow(14).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' }, bgColor: { argb: 'D9D9D9' }};
    worksheet.getRow(14).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' }, bgColor: { argb: 'D9D9D9' }};
    worksheet.getRow(16).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(16).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(16).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(18).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' }};
    worksheet.getRow(18).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(18).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};

    worksheet.getRow(6).getCell(1).font = {bold: true};
    worksheet.getRow(6).getCell(2).font = {bold: true};
    worksheet.getRow(6).getCell(3).font = {bold: true};
    worksheet.getRow(7).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(7).getCell(2).font = {bold: true, italic: true};
    worksheet.getRow(7).getCell(3).font = {bold: true, italic: true};
    worksheet.getRow(9).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(9).getCell(2).font = {bold: true, italic: true};
    worksheet.getRow(9).getCell(3).font = {bold: true, italic: true};
    worksheet.getRow(12).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(12).getCell(2).font = {bold: true, italic: true}
    worksheet.getRow(12).getCell(3).font = {bold: true, italic: true}
    worksheet.getRow(14).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(14).getCell(2).font = {bold: true, italic: true};
    worksheet.getRow(14).getCell(3).font = {bold: true, italic: true};
    worksheet.getRow(16).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(16).getCell(2).font = {bold: true, italic: true};
    worksheet.getRow(16).getCell(3).font = {bold: true, italic: true};
    worksheet.getRow(18).getCell(1).font = {bold: true, italic: true, color: {argb: 'FFFFFF'}};
    worksheet.getRow(18).getCell(2).font = {bold: true};
    worksheet.getRow(18).getCell(3).font = {bold: true};

    // Se elinan bordes de celdas en blanco
    worksheet.getRow(13).getCell(1).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(13).getCell(2).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(13).getCell(3).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(15).getCell(1).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(15).getCell(2).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(15).getCell(3).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(17).getCell(1).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(17).getCell(2).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };
    worksheet.getRow(17).getCell(3).border = {
      right: {style:'thin',color: {argb:'F2F2F2'}},
      left: {style:'thin',color: {argb:'F2F2F2'}}
    };


    worksheet.addRow([]);

    // se crear arreglo para tabla de capacidad adicional
    const headerCS = [
      'Capacidad Adicional', this.fecha1, this.fecha2,'Responsable'
    ];
    let headerRowCS = worksheet.addRow(headerCS);

    // Cell Style : Fill and Border
    headerRowCS.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },

      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = {
        color: {argb: 'FFFFFF'},
        bold: true,
        italic: true
      };
    });

    // se recorre arreglo de planCS dandole formate a las celdas
    this.capacityService.jsonDataPlanServiceCS.forEach(d => {
      let row = worksheet.addRow([d.descripcion , d.mes1.totalMes1, d.mes2.totalMes2,d.solicitante]);
      row.getCell(2).style = {numFmt: '#,##0.00'};
      row.getCell(3).style = {numFmt: '#,##0.00'};
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      row.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

    });

    // se crear arreglo con el total de la tabla de capacidad adicional
    const totalCS = [
      'Total', this.capacityService.totalMes1CS, this.capacityService.totalMes2CS
    ];
    let totalRowCS = worksheet.addRow(totalCS);

    // se formatean celdas de total de capcidad adicional
    totalRowCS.getCell(1).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' }};
    totalRowCS.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    totalRowCS.getCell(1).font = {color: {argb: 'FFFFFF'}, bold: true, italic: true};
    totalRowCS.getCell(2).style = {numFmt: '#,##0.00'};
    totalRowCS.getCell(2).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'C5D9F1' }, bgColor: { argb: 'C5D9F1' }};
    totalRowCS.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    totalRowCS.getCell(2).font = {bold: true};
    totalRowCS.getCell(3).style = {numFmt: '#,##0.00'};
    totalRowCS.getCell(3).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'C5D9F1' }, bgColor: { argb: 'C5D9F1' }};
    totalRowCS.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    totalRowCS.getCell(3).font = {bold: true};
    // totalRowCS.getCell(4).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' }};
    // totalRowCS.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    // totalRowCS.getCell(4).font = {color: {argb: 'FFFFFF'}, bold: true, italic: true};

    worksheet.addRow([]);
    worksheet.addRow([]);
    // Se crea areglo de requerimientos mas horas mes 1
     const headerHH1 = [
      'Requerimientos con mas Horas ' + this.fecha1, 'Total HH'
    ];
    let headerRowHH1 = worksheet.addRow(headerHH1);


    // Cell Style : Fill and Border
    headerRowHH1.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },

      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = {
        color: {argb: 'FFFFFF'},
        bold: true,
        italic: true
      };
    });

    for (let i = 0; i < this.capacityService.jsonDataMayores1.length; i++) {
      let row = worksheet.addRow([this.capacityService.jsonDataMayores1[i].descripcion , this.capacityService.jsonDataMayores1[i].mes1.totalMes1]);
      row.getCell(2).style = {numFmt: '#,##0.00'};
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

      if (i==9) {
        break;
      }
    } 

    // se crear arreglo con el total de la tabla de capacidad adicional
    const totalHH1 = [
      'Total', this.capacityService.totalMes1Mayores
    ];
    let totalRowHH1 = worksheet.addRow(totalHH1);

    // se formatean celdas de total de capcidad adicional
    totalRowHH1.getCell(1).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' }};
    totalRowHH1.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    totalRowHH1.getCell(1).font = {color: {argb: 'FFFFFF'}, bold: true, italic: true};
    totalRowHH1.getCell(2).style = {numFmt: '#,##0.00'};
    totalRowHH1.getCell(2).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'C5D9F1' }, bgColor: { argb: 'C5D9F1' }};
    totalRowHH1.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    totalRowHH1.getCell(2).font = {bold: true};
    totalRowHH1.getCell(3).style = {numFmt: '#,##0.00'};
    

    worksheet.addRow([]);
    worksheet.addRow([]);
    // Se crea areglo de requerimientos mas horas mes 2
     const headerHH2 = [
      'Requerimientos con mas Horas ' + this.fecha2, 'Total HH'
    ];
    let headerRowHH2 = worksheet.addRow(headerHH2);


    // Cell Style : Fill and Border
    headerRowHH2.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },

      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = {
        color: {argb: 'FFFFFF'},
        bold: true,
        italic: true
      };
    });

    for (let i = 0; i < this.capacityService.jsonDataMayores2.length; i++) {
      let row = worksheet.addRow([this.capacityService.jsonDataMayores2[i].descripcion , this.capacityService.jsonDataMayores2[i].mes2.totalMes2]);
      row.getCell(2).style = {numFmt: '#,##0.00'};
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

      if (i==9) {
        break;
      }
    } 

    // se crear arreglo con el total de la tabla de capacidad adicional
    const totalHH2 = [
      'Total', this.capacityService.totalMes2Mayores
    ];
    let totalRowHH2 = worksheet.addRow(totalHH2);

    // se formatean celdas de total de capcidad adicional
    totalRowHH2.getCell(1).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' }};
    totalRowHH2.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    totalRowHH2.getCell(1).font = {color: {argb: 'FFFFFF'}, bold: true, italic: true};
    totalRowHH2.getCell(2).style = {numFmt: '#,##0.00'};
    totalRowHH2.getCell(2).fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'C5D9F1' }, bgColor: { argb: 'C5D9F1' }};
    totalRowHH2.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    totalRowHH2.getCell(2).font = {bold: true};
    totalRowHH2.getCell(3).style = {numFmt: '#,##0.00'};


    // Se crear segunda hoja para el detalle de horas
    let worksheet2 = workbook.addWorksheet(`Detalle ${this.fecha1}`);

    // se crea arreglo para las cabeceras
    let headerHH = [
      'Requerimiento'];

    // se recorren los dias del mes para agregar un header por dia
    for (let i = 0; i < this.capacityService.dias.length; i++) {
      let dia = (i + 1).toString();
      headerHH.push(dia);
    }
    headerHH.push('Total');
    let headerRowHH = worksheet2.addRow(headerHH);

    // se recorren headers para insertarlos en excel y formatear celdas
    headerRowHH.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },

      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = {
        color: {argb: 'FFFFFF'},
        bold: true,
      };
    });
    let filaCS = false;
    // se recorre arreglo de planificacion para incorporar en excel
    this.capacityService.jsonDataPlanService.forEach(d => {
      let dFinal = [];
      dFinal.push(d.descripcion);
      for (const dia of d.mes1) {
        dFinal.push(dia.total);
      }
      // se agrega el total de planificacion del mes.
      dFinal.push(d.mes1.totalMes1);

      let row = worksheet2.addRow(dFinal);
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

      // se formatean solo las celdas que son numericas
      for (let i = 2; i < this.capacityService.dias.length + 2; i++) {
        row.getCell(i).style = {numFmt: '#,##0.00'};
        row.getCell(i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }

      // se formatea celda total
      row.getCell(this.capacityService.dias.length + 2).style = {numFmt: '#,##0.00'};
      // tslint:disable-next-line: max-line-length
      row.getCell(this.capacityService.dias.length + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

      // si la celda es comienza con CS se marca toda la fila amarillo
      row.eachCell((cell:any, num) => {
        let valor = cell._value.model.value;
        let valorString = valor.toString();
        if (valorString.substr(0, 2) === 'CS'){
          filaCS = true;
          cell.fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCFFA8' }, bgColor: { argb: 'FCFFA8' }};
        }else{
          if (filaCS && num > 1){
            cell.fill  = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCFFA8' }, bgColor: { argb: 'FCFFA8' }};
          }else{
            filaCS = false;
          }
        }

        if (cell._value.model.value == 0){
          cell.font = {color: {argb: 'FFFFFF'}};
        }

      });
    }
    );

    // se crear arreglo para total capacidad utilizada
    let dTotal = [];
    dTotal.push('Capacidad Utilizada');

    // se agregan los dias del mes en arreglo
    for (const dias of this.capacityService.totalDia) {
      dTotal.push(dias.total);
    }

    // se agrega al final el total de toda la capcidad utilizada
    dTotal.push(this.capacityService.totalMes1);


    let row = worksheet2.addRow(dTotal);
    row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row.getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
    row.getCell(1).font = {color: {argb: 'FFFFFF'}, bold: true};

    // se formatean solo celdas numericas
    for (let i = 2; i < this.capacityService.dias.length + 2; i++) {
      row.getCell(i).style = {numFmt: '#,##0.00'};
      row.getCell(i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // se formatean celtas de total
    row.getCell(this.capacityService.dias.length + 2).style = {numFmt: '#,##0.00'};
    // tslint:disable-next-line: max-line-length
    row.getCell(this.capacityService.dias.length + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


    // se crea arreglo para capacidad disponible por dia
    let dTotalDisp = [];
    dTotalDisp.push('Capacidad Disponible');
    // se agregan los dias del mes
    for (const dias of this.capacityService.capacidadporDia) {
      dTotalDisp.push(dias.total);
    }
    // se agrega total disponible
    dTotalDisp.push(this.capacityService.totalDisponible);


    let row2 = worksheet2.addRow(dTotalDisp);
    row2.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row2.getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
    row2.getCell(1).font = {color: {argb: 'FFFFFF'}, bold: true};

    // se formatean solo numericos
    for (let i = 2; i < this.capacityService.dias.length + 2; i++) {
      row2.getCell(i).style = {numFmt: '#,##0.00'};
      row2.getCell(i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // se formatean celdas total
    row2.getCell(this.capacityService.dias.length + 2).style = {numFmt: '#,##0.00'};
    // tslint:disable-next-line: max-line-length
    row2.getCell(this.capacityService.dias.length + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    // se crea arreglo para total (plan - disponible)
    let dTotalTotal = [];
    dTotalTotal.push('Total');
    // se agregan dias del mes
    for (const dias of this.capacityService.TotalcapacidadporDia) {
      dTotalTotal.push(dias.total);
    }
    // se agrega total final
    dTotalTotal.push(this.capacityService.totalTotal);


    let row3 = worksheet2.addRow(dTotalTotal);
    row3.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row3.getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
    row3.getCell(1).font = {color: {argb: 'FFFFFF'}, bold: true};

    // se formatean celdas numericas
    for (let i = 2; i < this.capacityService.dias.length + 2; i++) {
      row3.getCell(i).style = {numFmt: '#,##0.00'};
      row3.getCell(i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row3.getCell(i).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
      row3.getCell(i).font = {color: {argb: 'FFFFFF'}, bold: true};
    }

    // se formatea celdas total
    row3.getCell(this.capacityService.dias.length + 2).style = {numFmt: '#,##0.00'};
    // tslint:disable-next-line: max-line-length
    row3.getCell(this.capacityService.dias.length + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    // tslint:disable-next-line: max-line-length
    row3.getCell(this.capacityService.dias.length + 2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
    row3.getCell(this.capacityService.dias.length + 2).font = {color: {argb: 'FFFFFF'}, bold: true};

    // se establece ancho de primera columna
    worksheet2.getColumn(1).width = 65;

    //agregamos una hoja referente a los Requerimientos
    let worksheet3 = workbook.addWorksheet(`Requerimientos`);

    //A1
    let A1Row = worksheet3.addRow(['Asignación Capacity Services']);
    A1Row.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },

      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = {
        color: {argb: 'FFFFFF'},
        bold: true,
      };

      cell.alignment = {
        horizontal: 'center'
      };
    });

    worksheet3.mergeCells('A1:H1');

    //B
    let headerBReq = [
      'VS',
      'Responsable',
      this.primeraFechaTabla,
      '',
      this.segundaFechaTabla,
      '',
      this.terceraFechaTabla,
      ''
    ];

    let headerBRowReq = worksheet3.addRow(headerBReq);

    headerBRowReq.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },
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
      };

      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
    });


    //C
    let headerCReq = [
      '',
      '',
      'Cantidad',
      'Valor UF',
      'Cantidad',
      'Valor UF',
      'Cantidad',
      'Valor UF'
    ];

    let headerCRowReq = worksheet3.addRow(headerCReq);

    headerCRowReq.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '203764' },
        bgColor: { argb: '203764' },
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
      };

     
        cell.alignment = {
          horizontal: 'center',
        };
     

     
    });

    worksheet3.mergeCells('A2:A3');
    worksheet3.mergeCells('B2:B3');
    worksheet3.mergeCells('C2:D2');
    worksheet3.mergeCells('E2:F2');
    worksheet3.mergeCells('G2:H2');

    worksheet3.getColumn(1).width = 44;
    worksheet3.getColumn(2).width = 24;
    worksheet3.getColumn(3).width = 14;
    worksheet3.getColumn(4).width = 14;
    worksheet3.getColumn(5).width = 14;
    worksheet3.getColumn(6).width = 14;
    worksheet3.getColumn(7).width = 14;
    worksheet3.getColumn(8).width = 14;

    let newReqRow;
    let bloque;

    this.tablaRequerimientos.forEach(element => {
      if(element['mostrar'] == 1){
        bloque = element['bloque'];
      } else {
        bloque = '';
      }


       newReqRow = [
        bloque, 
        element['origen'],
        element['cuenta1M'],
        element['suma1M'],
        element['cuenta2M'],
        element['suma2M'],
        element['cuenta3M'],
        element['suma3M']
      ];
      
      let dataReq = worksheet3.addRow(newReqRow);  

      dataReq.eachCell((cell, number) => {
        console.log(number);
          if(number==1 || number==2){
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'left'
            };
          } else{
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            };
          }      
      });
    });

    //Total
    let totalReq = [
      '',
      'Total CS',
      this.totalReq['cuenta1M'],
      this.totalReq['suma1M'],
      this.totalReq['cuenta2M'],
      this.totalReq['suma2M'],
      this.totalReq['cuenta3M'],
      this.totalReq['suma3M']
    ];

    let totalRowReq = worksheet3.addRow(totalReq);

    totalRowReq.eachCell((cell, number) => {

      if(number == 1){

      } else if(number == 2){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '203764' },
          bgColor: { argb: '203764' },
  
        };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.font = {
          color: {argb: 'FFFFFF'},
          bold: true,
        }; 
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'B4C6E7' },
          bgColor: { argb: 'B4C6E7' },
        };
        cell.font = {
          bold: true,
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
      }
    });

    // se genera excel para descargar
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `Capacity_${this.hoy}.xlsx`);
    });
  }

  //obtiene la data de los requerimientos con fecha de recepcion hasta fecha
  getReqMes(fecha){
    let tabla = [];
    return tabla;
  }

  //se obtienen las fechas para los Requerimientos
  getFechasReq(){
    let primeraFecha; // 1 del mes anterior al actual
    let segundaFecha; // 1 del mes actual
    let terceraFecha; // 1 del siguiente mes al actual

    //terceraFecha
    let fechaActual = new Date();
    fechaActual.setHours(0,0,0,0);

    let terceraFechaMes = fechaActual.getMonth();
    let terceraFechaYear = fechaActual.getFullYear();

    if(terceraFechaMes == 11){
      terceraFechaMes = 1;
      terceraFechaYear += 1;
    } else {
      terceraFechaMes += 2;
    }

    terceraFecha = new Date(terceraFechaMes.toString() + '-1-' + terceraFechaYear.toString());

    //segundaFecha
    let segundaFechaMes = terceraFecha.getMonth(); 
    let segundaFechaYear = terceraFecha.getFullYear();

    if(segundaFechaMes == 0){
      segundaFechaMes = 12;
      segundaFechaYear += -1;
    }

    segundaFecha = new Date(segundaFechaMes.toString() + '-1-' + segundaFechaYear.toString());


    //primeraFecha
    let primeraFechaMes = segundaFecha.getMonth(); 
    let primeraFechaYear = segundaFecha.getFullYear();

    if(primeraFechaMes == 0){
      primeraFechaMes = 12;
      primeraFechaYear += -1;
    }

    primeraFecha = new Date(primeraFechaMes.toString() + '-1-' + primeraFechaYear.toString());

    this.primeraFecha = primeraFecha;
    this.segundaFecha = segundaFecha;
    this.terceraFecha = terceraFecha;

    //obtenemos las fechas a mostrar en las tablas
    if(this.primeraFecha.getMonth() == 0){
      this.primeraFechaTabla = 'Diciembre-'+ (this.primeraFecha.getFullYear()-1);
    } else {
      this.primeraFechaTabla = this.monthNames[this.primeraFecha.getMonth()-1] + '-' + this.primeraFecha.getFullYear();
    }

    if(this.segundaFecha.getMonth() == 0){
      this.segundaFechaTabla = 'Diciembre-'+ (this.segundaFecha.getFullYear()-1);
    } else {
      this.segundaFechaTabla = this.monthNames[this.segundaFecha.getMonth()-1] + '-' + this.segundaFecha.getFullYear();
    }

    if(this.terceraFecha.getMonth() == 0){
      this.terceraFechaTabla = 'Diciembre-'+ (this.terceraFecha.getFullYear()-1);
    } else {
      this.terceraFechaTabla = this.monthNames[this.terceraFecha.getMonth()-1] + '-' + this.terceraFecha.getFullYear();
    }
  }

  //se agrupa por bloque y origen y se cuentan y suman las prioridades
  //para la fecha (mes) dada mas 2 meses antes
  getTablaRequerimientos(jsonDataReq){
    let indexFind = -1;

    
    this.totalReq['cuenta1M'] = 0;
    this.totalReq['suma1M'] = 0;
    this.totalReq['cuenta2M'] = 0;
    this.totalReq['suma2M'] = 0;
    this.totalReq['cuenta3M'] = 0;
    this.totalReq['suma3M'] = 0;

    indexFind = -1;

    //tercera fecha
    
    jsonDataReq = jsonDataReq.filter(a => {
      return (a.fechaRecepcion < this.terceraFecha);
    });

    jsonDataReq.forEach(element => {
      indexFind = this.tablaRequerimientos.findIndex(
        req => (req.bloque === element.bloque && req.origen === element.origen)
      );
     
      if(indexFind == -1){
        let jsonReq = [];
        jsonReq['bloque'] = element.bloque;
        jsonReq['origen'] = element.origen;
        jsonReq['suma1M'] = 0;
        jsonReq['cuenta1M'] = 0;
        jsonReq['suma2M'] = 0;
        jsonReq['cuenta2M'] = 0;
        jsonReq['suma3M'] = Number(element.prioridad);
        jsonReq['cuenta3M'] = 1;
        jsonReq['mostrar'] = 1;

        this.tablaRequerimientos.push(jsonReq);
      } else {
        this.tablaRequerimientos[indexFind]['cuenta3M'] += 1;
        this.tablaRequerimientos[indexFind]['suma3M'] += Number(element.prioridad);
      }
    });
  


    //segunda fecha
    jsonDataReq = jsonDataReq.filter(a => {
      return (a.fechaRecepcion < this.segundaFecha);
    });

    jsonDataReq.forEach(element => {
      indexFind = this.tablaRequerimientos.findIndex(
        req => (req.bloque === element.bloque && req.origen === element.origen)
      );

      this.tablaRequerimientos[indexFind]['cuenta2M'] += 1;
      this.tablaRequerimientos[indexFind]['suma2M'] += Number(element.prioridad);
    });



    //primera fecha
    jsonDataReq = jsonDataReq.filter(a => {
      return (a.fechaRecepcion < this.primeraFecha);
    });

    jsonDataReq.forEach(element => {
      indexFind = this.tablaRequerimientos.findIndex(
        req => (req.bloque === element.bloque && req.origen === element.origen)
      );

      this.tablaRequerimientos[indexFind]['cuenta1M'] += 1;
      this.tablaRequerimientos[indexFind]['suma1M'] += Number(element.prioridad);
    });

    this.tablaRequerimientos.forEach((elementToFixed, indexToFixed) => {
      this.tablaRequerimientos[indexToFixed].suma3M = this.tablaRequerimientos[indexToFixed].suma3M.toFixed(2);
      this.tablaRequerimientos[indexToFixed].suma2M = this.tablaRequerimientos[indexToFixed].suma2M.toFixed(2);
      this.tablaRequerimientos[indexToFixed].suma1M = this.tablaRequerimientos[indexToFixed].suma1M.toFixed(2);
    });

    //ordenamos la tabla por su bloque
    this.tablaRequerimientos.sort((a, b) => {
      const reqA = a['bloque'];
      const reqB = b['bloque'];
      if (reqA < reqB) {
        return -1;
      }

      if (reqA > reqB) {
        return 1;
      }
      return 0;
    });

    //si el bloque ya fue agregado lo marcamos para no mostrarlo
    let indexBloque = -1;
    this.tablaRequerimientos.forEach(element => {
      indexBloque = this.arregloBloques.findIndex(req => (req == element.bloque));
      
      if(indexBloque == -1){        
        this.arregloBloques.push(element.bloque);
      } else {
        element.mostrar = 0;
      }   
    });

    //calculamos los totales
    this.tablaRequerimientos.forEach(element => {
      this.totalReq['cuenta3M'] += element.cuenta3M;
      this.totalReq['suma3M'] += Number(element.suma3M);
      this.totalReq['cuenta2M'] += element.cuenta2M;
      this.totalReq['suma2M'] += Number(element.suma2M);
      this.totalReq['cuenta1M'] += element.cuenta1M;
      this.totalReq['suma1M'] += Number(element.suma1M);
    });
    this.totalReq['suma3M'] = this.totalReq['suma3M'].toFixed(2);
    this.totalReq['suma2M'] = this.totalReq['suma2M'].toFixed(2);
    this.totalReq['suma1M'] = this.totalReq['suma1M'].toFixed(2);
   
  }

}