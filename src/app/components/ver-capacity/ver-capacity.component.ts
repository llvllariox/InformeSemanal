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
  // datePipeString : string;

  constructor(public capacityService: CapacityService) {
    init_customJS();
    // numberMas
    // moment.lang('es');
    this.fecha1 = moment().format('MMMM-YY');
    this.hoy = moment().format('DD-MMMM-YY');
    this.fecha2 = moment().add(1, 'months').format('MMMM-YY');
    console.log(new Intl.NumberFormat('es-ES', {minimumFractionDigits: 2}).format(this.Ejecucion2));
  }

  ngOnInit(): void {
  }

  eliminar(i){
    this.capacityService.jsonDataPlanService.splice(i, 1);
    this.capacityService.totalesDia();
  }
  /*name of the excel-file which will be downloaded. */ 
  

  exportexcel(): void
    {
       /* table id is passed over here */
       let element1 = document.getElementById('excel-table1');
       const ws1: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element1);
       let element2 = document.getElementById('excel-table2');
       const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element2);
       let element3 = document.getElementById('excel-table3');
       const ws3: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element3);
      //  console.log(ws1);
      //  console.log(element3);
      //  element3.removeAttribute('Col1');
      //  let col1 = document.getElementById('Col1');
      //  console.log(col1);
      //  col1.remove();

      //  ws1["A1"].s = {
      //  font: {
      //     name: ' ',
      //     sz: 24,
      //     bold: true,
      //     underline: true,
      //     color: {
      //         rgb: "FFFFAA00"
      //     }
      //  },
      // alignment: {
      //     horizontal: "center",
      //     vertical: "center",
      //     wrap_text: true
      //  },
      // fill: {
      //      bgColor: {
      //          rgb: 'ffff00'
      //      }
      //  }
      // };

      //  delete ws1["A1"].s; // delete old formatted text if it exists
      //  XLSX.utils.format_cell(ws1["A1"]); // refresh cell
       const wscols = [
        {wch: 40},
        {wch: 12},
        {wch: 12},
       ];

       const wscols3 = [
        {wch: -1},
        {wch: 60},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
        {wch: 7.25},
       ];

       ws1['!cols'] = wscols;
       ws2['!cols'] = wscols;
       ws3['!cols'] = wscols3;
      //  ws1["C5"].v = new Intl.NumberFormat('es-ES', {minimumFractionDigits: 2}).format(this.Ejecucion2);
      //  ws1["C5"].t = "n";
       ws1["C5"].v = this.Ejecucion2;
       ws1["C5"].t = "n";
       ws1["B6"].v = this.Reservavalor1;
       ws1["B6"].t = "n";
       ws1["C6"].v = this.Reservavalor2;
       ws1["C6"].t = "n";
       ws1["B8"].v = this.Mttovalor1;
       ws1["B8"].t = "n";
       ws1["C8"].v = this.Mttovalor2;
       ws1["C8"].t = "n";
       ws1["B9"].v = this.Mttovalor3;
       ws1["B9"].t = "n";
       ws1["C9"].v = this.Mttovalor4;
       ws1["C9"].t = "n";
       

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1');
       XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');
       XLSX.utils.book_append_sheet(wb, ws3, 'Sheet3');

        console.log(wb);
       /* save to file */
       XLSX.writeFile(wb, this.fileName);

    }

  // static toExportFileName(excelFileName: string): string {
  //   return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  // }

  // public exportAsExcelFile(json: any[], excelFileName: string): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  //   const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
  //   XLSX.writeFile(workbook, VerCapacityComponent.toExportFileName(excelFileName));
  // }

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
      ['   Mantención y Centro de Compentencia + BUC	', this.Mttovalor1 , this.Mttovalor2],
      ['   Mantención Backend		', this.Mttovalor3 , this.Mttovalor4],
      // tslint:disable-next-line: max-line-length
      ['Capacity disponible SWF	', 8910 - this.capacityService.totalMes - (this.Mttovalor1 + this.Mttovalor2), 8910 - this.Ejecucion2 - (this.Mttovalor3 + this.Mttovalor4)],
      // tslint:disable-next-line: max-line-length
      ['Capacity sin asignar SWF', 8910 - (this.capacityService.totalMes + this.Reservavalor1) - (this.Mttovalor1 + this.Mttovalor2), 8910 - (this.Ejecucion2 + this.Reservavalor2) - (this.Mttovalor3 + this.Mttovalor4)],
    ];
    // Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Capacity');
    let subTitleRow = worksheet.addRow(['Date : ' + this.hoy]);

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

    worksheet.getRow(7).getCell(1).font = {bold: true};
    worksheet.getRow(7).getCell(2).font = {bold: true};
    worksheet.getRow(7).getCell(3).font = {bold: true};
    worksheet.getRow(10).getCell(1).font = {bold: true};
    worksheet.getRow(10).getCell(2).font = {bold: true};
    worksheet.getRow(10).getCell(3).font = {bold: true};
    worksheet.getRow(13).getCell(1).font = {bold: true};
    worksheet.getRow(13).getCell(2).font = {bold: true};
    worksheet.getRow(13).getCell(3).font = {bold: true};
    worksheet.getRow(14).getCell(1).font = {bold: true};
    worksheet.getRow(14).getCell(2).font = {bold: true};
    worksheet.getRow(14).getCell(3).font = {bold: true};
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

    totalRowCS.getCell(2).style = {numFmt: '#,##0.00'};
    totalRowCS.getCell(3).style = {numFmt: '#,##0.00'};

    totalRowCS.eachCell((cell, number) => {
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

    workbook.addWorksheet('Horas');


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Capacity.xlsx');
    });
  }
  
}
