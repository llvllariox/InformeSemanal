import { Component, OnInit } from '@angular/core';
import { CapacityService } from '../../services/capacity.service';
declare function init_customJS();
import * as moment from 'moment'; //
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-ver-capacity',
  templateUrl: './ver-capacity.component.html',
  styleUrls: ['./ver-capacity.component.css']
})
export class VerCapacityComponent implements OnInit {

  fecha1;
  fecha2;
  Mttovalor1 = 2700.00;
  Mttovalor2 = 900.00;
  Mttovalor3 = 0.00;
  Mttovalor4 = 0.00;
  Reservavalor1 = 0;
  Reservavalor2 = 0;
  Ejecucion2 = 0;
  fileName = 'ExcelSheet.xlsx';

  constructor(public capacityService: CapacityService ) {
    init_customJS();
    // numberMas
    // moment.lang('es');
    this.fecha1 = moment().format('MMMM-YY');
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

}
