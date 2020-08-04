import { Component, OnInit } from '@angular/core';
import { CapacityService } from '../../services/capacity.service';
declare function init_customJS();
import * as moment from 'moment'; //
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
// import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';


// import * as ExcelJS from 'exceljs';
// const exportToExcel = require('export-to-excel')
@Component({
  selector: 'app-ver-capacity',
  templateUrl: './ver-capacity.component.html',
  styleUrls: ['./ver-capacity.component.css']
})
export class VerCapacityComponent implements OnInit {

  fecha1;
  fecha2;
  hoy;
  Mttovalor1 = 2700.00;
  Mttovalor2 = 900.00;
  Mttovalor3 = 0.00;
  Mttovalor4 = 0.00;
  Reservavalor1 = 0;
  Reservavalor2 = 0;
  Ejecucion2 = 0;
  fileName = 'ExcelSheet.xlsx';
  finMes;
  dias;
  // datePipeString : string;

  constructor(public capacityService: CapacityService) {
    init_customJS();

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    // numberMas
    // moment.lang('es');
    this.fecha1 = capitalizeFirstLetter(moment().lang('es').format('MMMM-YY'));
    this.hoy = moment().lang('es').format('DD-MM-YYYY');
    this.finMes = moment().endOf('month');
    this.fecha2 = capitalizeFirstLetter(moment().lang('es').add(1, 'months').format('MMMM-YY'));
    this.dias =  Number(this.finMes.format('DD'));
    // console.log(this.dias);
    // console.log(new Intl.NumberFormat('es-ES', {minimumFractionDigits: 2}).format(this.Ejecucion2));
  }

  ngOnInit(): void {
  }

  eliminar(i){
    this.capacityService.jsonDataPlanService.splice(i, 1);
    this.capacityService.totalesDia();
  }

  generateExcel() {

    // Excel Title, Header, Data
    const title = 'Capacity';
    const header = ['Distribución Capacity en HH	', this.fecha1, this.fecha2];
    const data = [
      ['FTE Comprometido', 49.50, 49.50],
      ['Total Capacity Mes Comprometido', 8910.00,  8910.00],
      ['Evolutivos', this.capacityService.totalMes + this.Reservavalor1,  this.Ejecucion2 + this.Reservavalor2],
      ['   En ejecución	', this.capacityService.totalMes, this.Ejecucion2],
      ['   Reservado	', this.Reservavalor1, this.Reservavalor2],
      ['Mantención y Centro de Compentencia', this.Mttovalor1 + this.Mttovalor2, this.Mttovalor3 + this.Mttovalor4],
      ['   Mantención y Centro de Compentencia + BUC	', this.Mttovalor1 , this.Mttovalor3],
      ['   Mantención Backend		', this.Mttovalor2 , this.Mttovalor4],
      // tslint:disable-next-line: max-line-length
      ['Capacity disponible SWF	', 8910 - this.capacityService.totalMes - (this.Mttovalor1 + this.Mttovalor2), 8910 - this.Ejecucion2 - (this.Mttovalor3 + this.Mttovalor4)],
      // tslint:disable-next-line: max-line-length
      ['Capacity sin asignar SWF', 8910 - (this.capacityService.totalMes + this.Reservavalor1) - (this.Mttovalor1 + this.Mttovalor2), 8910 - (this.Ejecucion2 + this.Reservavalor2) - (this.Mttovalor3 + this.Mttovalor4)],
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
    // Add Data and Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);
      row.getCell(2).style = {numFmt: '#,##0.00'};
      row.getCell(3).style = {numFmt: '#,##0.00'};
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    }
    );

    worksheet.getColumn(1).width = 42;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getRow(5).getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' }, bgColor: { argb: 'F2F2F2' }};
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

    worksheet.getRow(7).getCell(1).font = {bold: true, italic: true};
    // worksheet.getRow(7).getCell(2).font = {bold: true};
    // worksheet.getRow(7).getCell(3).font = {bold: true};
    worksheet.getRow(10).getCell(1).font = {bold: true, italic: true};
    // worksheet.getRow(10).getCell(2).font = {bold: true};
    // worksheet.getRow(10).getCell(3).font = {bold: true};
    worksheet.getRow(13).getCell(1).font = {bold: true, italic: true};
    // worksheet.getRow(13).getCell(2).font = {bold: true};
    // worksheet.getRow(13).getCell(3).font = {bold: true};
    worksheet.getRow(14).getCell(1).font = {bold: true, italic: true};
    // worksheet.getRow(14).getCell(2).font = {bold: true};
    // worksheet.getRow(14).getCell(3).font = {bold: true};
    worksheet.addRow([]);

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
      };
      if (cell.address === 'A16'){
         cell.font = cell.font = {color: {argb: 'FFFFFF'}, bold: true, italic: true};
      }
    });

    this.capacityService.jsonDataPlanServiceCS.forEach(d => {
      // let rowCS = [d.descripcion , 180, 180];
      let row = worksheet.addRow([d.descripcion , 180, 180]);
      row.getCell(2).style = {numFmt: '#,##0.00'};
      row.getCell(3).style = {numFmt: '#,##0.00'};
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    const totalCS = [
      'Total', 180.00 * this.capacityService.jsonDataPlanServiceCS.length, 180.00 * this.capacityService.jsonDataPlanServiceCS.length
    ];
    let totalRowCS = worksheet.addRow(totalCS);

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

    // totalRowCS.eachCell((cell, number) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: '203764' },
    //     bgColor: { argb: '203764' },

    //   };
    //   cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    //   cell.font = {
    //     color: {argb: 'FFFFFF'},
    //     bold: true,
    //   };
    // });

    let worksheet2 = workbook.addWorksheet('Horas');
    // for
    let headerHH = [
      'Requerimiento'];

    for (let i = 0; i < 28; i++) {
      // let diaN = `dia${i + 1}`;
      let dia = i + 1;
      // console.log(this.capacityService.totales[diaN]);
      headerHH.push(dia.toString());
      }
    if (29 <= Number(this.dias)){
     headerHH.push('29');
    }
    if (30 <= Number(this.dias)){
      headerHH.push('30');
    }
    if (31 <= Number(this.dias)){
      headerHH.push('31');
    }

    // for (let i = 0; i < 31; i++) {
    //   let diaN = `dia${i + 1}`;
    //   let dia = i + 1;
    //   console.log(this.capacityService.totales[diaN]);
    //   if (this.capacityService.totales[diaN] > 0){
    //     headerHH.push(dia.toString());
    //   }
    // }
    headerHH.push('Total');
    // console.log(headerHH);


    let headerRowHH = worksheet2.addRow(headerHH);

    // Cell Style : Fill and Border
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

    this.capacityService.jsonDataPlanService.forEach(d => {
      let dFinal = [d.descripcion, d.dia1, d.dia2, d.dia3, d.dia4, d.dia5, d.dia6, d.dia7,
                                  d.dia8, d.dia9, d.dia10, d.dia11, d.dia12, d.dia13, d.dia14,
                                  d.dia15, d.dia16, d.dia17, d.dia18, d.dia19, d.dia20, d.dia21,
                                  d.dia22, d.dia23, d.dia24, d.dia25, d.dia26, d.dia27, d.dia28];

      if (29 <= Number(this.dias)){
        dFinal.push(d.dia29);
      }
      if (30 <= Number(this.dias)){
        dFinal.push(d.dia30);
      }
      if (31 <= Number(this.dias)){
        dFinal.push(d.dia31);
      }

      let totaldia = 0;
      totaldia = d.dia1 +  d.dia2 +  d.dia3 +  d.dia4 +  d.dia5 +  d.dia6 +  d.dia7 +
                 d.dia8 +  d.dia9 +  d.dia10 +  d.dia11 +  d.dia12 +  d.dia13 +  d.dia14 +
                 d.dia15 +  d.dia16 +  d.dia17 +  d.dia18 +  d.dia19 +  d.dia20 +  d.dia21 +
                 d.dia22 +  d.dia23 +  d.dia24 +  d.dia25 +  d.dia26 +  d.dia27 +  d.dia28 + d.dia29 + d.dia30 + d.dia31;

      dFinal.push(totaldia);

 
      let row = worksheet2.addRow(dFinal);
      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

      for (let i = 2; i < 30; i++) {
        row.getCell(i).style = {numFmt: '#,##0.00'};
        row.getCell(i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }

      if (29 <= Number(this.dias)){
        row.getCell(30).style = {numFmt: '#,##0.00'};
        row.getCell(30).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
      if (30 <= Number(this.dias)){
        row.getCell(31).style = {numFmt: '#,##0.00'};
        row.getCell(31).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
      if (31 <= Number(this.dias)){
        row.getCell(32).style = {numFmt: '#,##0.00'};
        row.getCell(32).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      }
      row.getCell(this.dias + 2).style = {numFmt: '#,##0.00'};
      row.getCell(this.dias + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }
    );

    const dTotal = ['Capacidad Utilizada', this.capacityService.totales.dia1, this.capacityService.totales.dia2,
                                           this.capacityService.totales.dia3, this.capacityService.totales.dia4,
                                           this.capacityService.totales.dia5, this.capacityService.totales.dia6,
                                           this.capacityService.totales.dia7, this.capacityService.totales.dia8,
                                           this.capacityService.totales.dia9, this.capacityService.totales.dia10,
                                           this.capacityService.totales.dia11, this.capacityService.totales.dia12,
                                           this.capacityService.totales.dia13, this.capacityService.totales.dia14,
                                           this.capacityService.totales.dia15, this.capacityService.totales.dia16,
                                           this.capacityService.totales.dia17, this.capacityService.totales.dia18,
                                           this.capacityService.totales.dia19, this.capacityService.totales.dia20,
                                           this.capacityService.totales.dia21, this.capacityService.totales.dia22,
                                           this.capacityService.totales.dia23, this.capacityService.totales.dia24,
                                           this.capacityService.totales.dia25, this.capacityService.totales.dia26,
                                           this.capacityService.totales.dia27, this.capacityService.totales.dia28];

    if (29 <= Number(this.dias)){
      dTotal.push(this.capacityService.totales.dia29);
    }
    if (30 <= Number(this.dias)){
      dTotal.push(this.capacityService.totales.dia30);
    }
    if (31 <= Number(this.dias)){
      dTotal.push(this.capacityService.totales.dia31);
    }

    let totaldia = 0;
    totaldia =  this.capacityService.totales.dia1 + this.capacityService.totales.dia2 +
                this.capacityService.totales.dia3 + this.capacityService.totales.dia4 +
                this.capacityService.totales.dia5 + this.capacityService.totales.dia6 +
                this.capacityService.totales.dia7 + this.capacityService.totales.dia8 +
                this.capacityService.totales.dia9 + this.capacityService.totales.dia10 +
                this.capacityService.totales.dia11 + this.capacityService.totales.dia12 +
                this.capacityService.totales.dia13 + this.capacityService.totales.dia14 +
                this.capacityService.totales.dia15 + this.capacityService.totales.dia16 +
                this.capacityService.totales.dia17 + this.capacityService.totales.dia18 +
                this.capacityService.totales.dia19 + this.capacityService.totales.dia20 +
                this.capacityService.totales.dia21 + this.capacityService.totales.dia22 +
                this.capacityService.totales.dia23 + this.capacityService.totales.dia24 +
                this.capacityService.totales.dia25 + this.capacityService.totales.dia26 +
                this.capacityService.totales.dia27 + this.capacityService.totales.dia28 +
                this.capacityService.totales.dia29 + this.capacityService.totales.dia30 +
                this.capacityService.totales.dia31;

    dTotal.push(totaldia);


    let row = worksheet2.addRow(dTotal);
    row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row.getCell(1).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
    row.getCell(1).font = {color: {argb: 'FFFFFF'}, bold: true,};

    for (let i = 2; i < 30; i++) {
      row.getCell(i).style = {numFmt: '#,##0.00'};
      row.getCell(i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(i).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
      row.getCell(i).font = {color: {argb: 'FFFFFF'}, bold: true,};
    }

    if (29 <= Number(this.dias)){
      row.getCell(30).style = {numFmt: '#,##0.00'};
      row.getCell(30).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(30).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
      row.getCell(30).font = {color: {argb: 'FFFFFF'}, bold: true,};
    }
    if (30 <= Number(this.dias)){
      row.getCell(31).style = {numFmt: '#,##0.00'};
      row.getCell(31).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(31).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
      row.getCell(31).font = {color: {argb: 'FFFFFF'}, bold: true,};
    }
    if (31 <= Number(this.dias)){
      row.getCell(32).style = {numFmt: '#,##0.00'};
      row.getCell(32).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(32).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
      row.getCell(32).font = {color: {argb: 'FFFFFF'}, bold: true,};
    }
    row.getCell(this.dias + 2).style = {numFmt: '#,##0.00'};
    // tslint:disable-next-line: max-line-length
    row.getCell(this.dias + 2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    row.getCell(this.dias + 2).fill = {type: 'pattern', pattern: 'solid', fgColor: { argb: '203764' }, bgColor: { argb: '203764' } };
    row.getCell(this.dias + 2).font = {color: {argb: 'FFFFFF'}, bold: true,};

    worksheet2.getColumn(1).width = 65;
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `Capacity_${this.hoy}.xlsx`);
    });
  }
}
