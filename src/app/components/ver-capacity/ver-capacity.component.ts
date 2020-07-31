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
       let element = document.getElementById('excel-table');
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

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
