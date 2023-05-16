import { Component, OnInit } from '@angular/core';
import { ArsJiraService } from 'src/app/services/ars-jira.service';
import * as moment from 'moment'; //
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare function init_customJS();

@Component({
  selector: 'app-ver-ars-jira-plan',
  templateUrl: './ver-ars-jira-plan.component.html',
  styleUrls: ['./ver-ars-jira-plan.component.css']
})
export class VerArsJiraPlanComponent implements OnInit {

  hoy;



  constructor(public arsJiraService: ArsJiraService) { 
    init_customJS();
    this.hoy = moment().locale('es').format('DD-MM-YYYY');
  }

  ngOnInit(): void {
  }

  generateExcel(){
    // Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('ARS-PLANIFICADO-JIRA');

    // Se establecen anchos de las columnas
      worksheet.getColumn(1).width = 19;
      worksheet.getColumn(2).width = 60;
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(4).width = 14;
      worksheet.getColumn(5).width = 16;
      worksheet.getColumn(6).width = 26;
      worksheet.getColumn(7).width = 19;
      worksheet.getColumn(8).width = 20;
      worksheet.getColumn(9).width = 12;
      worksheet.getColumn(10).width = 27;
      worksheet.getColumn(11).width = 16;
      worksheet.getColumn(12).width = 16;
      worksheet.getColumn(13).width = 18;
      worksheet.getColumn(14).width = 16;
      worksheet.getColumn(15).width = 17;
      worksheet.getColumn(16).width = 10;
      worksheet.getColumn(17).width = 50;
      worksheet.getColumn(18).width = 24;
      worksheet.getColumn(19).width = 15;
      worksheet.getColumn(20).width = 15;
      worksheet.getColumn(21).width = 15;
      worksheet.getColumn(22).width = 15;

      worksheet.autoFilter = {
        from: 'A1',
        to: 'V1',
      }

      worksheet.views = [
        {state: 'frozen', xSplit: 2, ySplit: 1}
      ];

    const headerCS = [
      'Nro. ARS','Descripción','Etapa','Estado','Línea de Servicio','Origen',
      'Solicitante','Código Externo','Req. Origen','Responsable ARS','Fecha Recepción',
      'Horas Estimadas','Horas Planificadas','Horas Incurridas','Tipo de Incidencia','Clave',
      'Responsable JIRA','Estado','Duración','Tarifa HH/UF','HH Consumidas','HH Restantes'
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
    this.arsJiraService.jsonDataReqPlanService.forEach(d => {
      let row = worksheet.addRow([
              d.numeroArs,
              d.descripcion, 
              d.etapa,
              d.estado, 
              d.lineaDeServicio,
              d.origen,
              d.solicitante,
              d.codigoExterno,
              d.reqOrigen,
              d.responsable,
              d.fechaRecepcion,
              d.horasEstimadas,
              d.horasPlanificadas,
              d.horasIncurridas, 
              d.jira.tipoDeIncidencia,
              d.jira.clave,
              d.jira.responsable,
              d.jira.estado,
              parseFloat(d.jira["Duración en HH"]),
              parseFloat(d.jira["Tarifa HH/UF"]),
              parseFloat(d.jira["HH Consumidas"]),
              parseFloat(d.jira["HH Restantes"])
            ]);

      row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(6).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(7).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(8).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(9).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(10).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(11).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(12).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(13).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(14).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(15).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(16).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(17).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(18).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

      row.getCell(19).style = {numFmt: '#,##0.00'};
      row.getCell(20).style = {numFmt: '#,##0.00'};
      row.getCell(21).style = {numFmt: '#,##0.00'};
      row.getCell(22).style = {numFmt: '#,##0.00'};
      
      row.getCell(19).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(20).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(21).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      row.getCell(22).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    /*
    //se muestran JIRA sin ARS
    this.arsJiraService.jsonDataJiraSinArsService.forEach(d => {
      let row = worksheet.addRow([
              '-' , 
              '-', 
              '-',
              '-', 
              '-',
              '-',
              '-',
              '-',
              '-',
              '-',
              '-',
              '-',
              '-',
              '-',
              d.tipoDeIncidencia,
              d.clave,
              d.responsable,
              d.estado,
              parseFloat(d["Duración en HH"]),
              parseFloat(d["Tarifa HH/UF"]),
              parseFloat(d["HH Consumidas"]),
              parseFloat(d["HH Restantes"])
            ]);
            row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(6).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(7).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(8).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(9).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(10).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(11).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(12).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(13).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(14).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(15).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(16).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(17).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(18).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(19).style = {numFmt: '#,##0.00'};
            row.getCell(20).style = {numFmt: '#,##0.00'};
            row.getCell(21).style = {numFmt: '#,##0.00'};
            row.getCell(22).style = {numFmt: '#,##0.00'};
            row.getCell(19).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(20).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(21).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            row.getCell(22).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });

    */
    
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `ARS-PLANIFICADO-JIRA_${this.hoy}.xlsx`);
    });
  }
}
