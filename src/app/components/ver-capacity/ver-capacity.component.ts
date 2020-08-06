import { Component, OnInit } from '@angular/core';
import { CapacityService } from '../../services/capacity.service';
declare function init_customJS();
import * as moment from 'moment'; //
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-ver-capacity',
  templateUrl: './ver-capacity.component.html',
  styleUrls: ['./ver-capacity.component.css']
})
export class VerCapacityComponent implements OnInit {

  fecha1;
  fecha2;
  hoy;
  Mttovalor1 = 2880.00;
  Mttovalor2 = 900.00;
  Mttovalor3 = 2880.00;
  Mttovalor4 = 900.00;
  Reservavalor1 = 0;
  Reservavalor2 = 0;
  Ejecucion2 = 0;
  fileName = 'ExcelSheet.xlsx';
  finMes;
  dias;

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

    this.capacityService.horasMtto = this.Mttovalor1 + this.Mttovalor2;
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
  cambiarTotal(){
    // Si se cambian valores de manteniemiento se recalculan la capacidad disponible y total de capacidad por dia.
    this.capacityService.horasMtto = this.Mttovalor1 + this.Mttovalor2;
    this.capacityService.capacidadDisponible();
    this.capacityService.totCapacidadDisponible();
  }
  cambiarTotalCS(){
    // Si se cambian valores de CS se recalcula el total
    this.capacityService.totalEjecucion();
  }
  generateExcel() {

    // Se crea Tabla de Capacity
    const title = 'Capacity';
    const header = ['Distribución Capacity en HH	', this.fecha1, this.fecha2];
    const data = [
      ['FTE Comprometido', 49.50, 49.50],
      ['Total Capacity Mes Comprometido', 8910.00,  8910.00],
      ['Evolutivos', this.capacityService.totalMes + this.Reservavalor1,  this.capacityService.totalMes2 + this.Reservavalor2],
      ['   En ejecución	', this.capacityService.totalMes1, this.capacityService.totalMes2],
      ['   Reservado	', this.Reservavalor1, this.Reservavalor2],
      ['Mantención y Centro de Compentencia', this.Mttovalor1 + this.Mttovalor2, this.Mttovalor3 + this.Mttovalor4],
      ['   Mantención y Centro de Compentencia + BUC	', this.Mttovalor1 , this.Mttovalor3],
      ['   Mantención Backend		', this.Mttovalor2 , this.Mttovalor4],
      // tslint:disable-next-line: max-line-length
      ['Capacity disponible SWF	', 8910 - this.capacityService.totalMes1 - (this.Mttovalor1 + this.Mttovalor2), 8910 - this.capacityService.totalMes2 - (this.Mttovalor3 + this.Mttovalor4)],
      // tslint:disable-next-line: max-line-length
      ['Capacity sin asignar SWF', 8910 - (this.capacityService.totalMes1 + this.Reservavalor1) - (this.Mttovalor1 + this.Mttovalor2), 8910 - (this.capacityService.totalMes2 + this.Reservavalor2) - (this.Mttovalor3 + this.Mttovalor4)],
    ];
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
    worksheet.getRow(10).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(10).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(10).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(13).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(13).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(13).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(14).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(14).getCell(2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};
    worksheet.getRow(14).getCell(3).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'B4C6E7' }, bgColor: { argb: 'B4C6E7' }};

    worksheet.getRow(6).getCell(1).font = {bold: true};
    worksheet.getRow(6).getCell(2).font = {bold: true};
    worksheet.getRow(6).getCell(3).font = {bold: true};
    worksheet.getRow(7).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(10).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(13).getCell(1).font = {bold: true, italic: true};
    worksheet.getRow(14).getCell(1).font = {bold: true, italic: true};
    worksheet.addRow([]);

    // se crear arreglo para tabla de capacidad adicional
    const headerCS = [
      'Capacidad Adicional', this.fecha1, this.fecha2
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
      let row = worksheet.addRow([d.descripcion , d.mes1.totalMes1, d.mes2.totalMes2]);
      row.getCell(2).style = {numFmt: '#,##0.00'};
      row.getCell(3).style = {numFmt: '#,##0.00'};
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
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

    // Se crear segunda hoja para el detalle de horas
    let worksheet2 = workbook.addWorksheet('Horas');

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
    // se genera excel para descargar
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `Capacity_${this.hoy}.xlsx`);
    });
  }
}
