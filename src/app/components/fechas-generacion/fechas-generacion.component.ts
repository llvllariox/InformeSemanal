import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { DmsJsonDataService } from 'src/app/services/dms-json-data.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-fechas-generacion',
  templateUrl: './fechas-generacion.component.html'
})
export class FechasGeneracionComponent implements OnInit {
  JsonArrayDms: [] = [];
  JsonArrayDmsWeb: [] = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fechaInformeDate;

  constructor(
      public jsonDataService: DmsJsonDataService, 
      private route: ActivatedRoute, 
      //public pdfService: SlaJspdfService, 
      private sweetAlerService: SweetAlertService
  ){ 
    this.fechaInformeDate = new Date(jsonDataService.getFechaInforme() + '-05');

    if(this.jsonDataService.jsonDataDmsService !== undefined) {
      this.JsonArrayDms = this.jsonDataService.getJsonDataDmsService();
        
      //se ordena por ARS
      this.JsonArrayDms.sort((a, b) => {
        const arsA = a['ars'];
        const arsB = b['ars'];
        if (Number(arsA) < Number(arsB)) {
          return -1;
        }

        if (Number(arsA) > Number(arsB)) {
          return 1;
        }
        return 0;
      });

      //realizamos las validaciones
      this.JsonArrayDms.forEach(this.validarExcel);
      // this.JsonArrayDms.forEach(this.validarFechasVacias);
        //preparamos la vista web
        this.JsonArrayDms.forEach(element => {
          if(element['mostrar'] == 1){
            this.JsonArrayDmsWeb.push(element);
          }
        });
      }
  }

  ngOnInit(): void {
  }

  //mostrar=1 -> mostrar en web
  agregarCampoMostrar(item, index, arr){
    item['mostrar'] = 0;
  }

  //Validamos la fecha de inicio y fin de comprometido, planificado y real
  validarFechasVacias(item, index, arr){
    let fecha = new Date('1899-12-31T00:00:00');
    //let fecha = new Date('2023-01-03T00:00:00');

    let colorVacio = '#ff0000';

    //Inicio Comprometido
    if(item.inicioComprometido){
      if(fecha.getTime() === item.inicioComprometido.getTime()){
        item['validarFechaInicioComprometido'] = colorVacio;
        item['validarARS'] = colorVacio;
        item['mostrar'] = 1;
      }
    } else {
      item['validarFechaInicioComprometido'] = colorVacio;
      item['validarARS'] = colorVacio;
      item['mostrar'] = 1;
    }

    //Inicio Planificado
    if(item.inicioPlanificado){
      if(fecha.getTime() === item.inicioPlanificado.getTime()){
        item['validarFechaInicioPlanificado'] = colorVacio;
        item['validarARS'] = colorVacio;
        item['mostrar'] = 1;
      }
    } else {
      item['validarFechaInicioPlanificado'] = colorVacio;
      item['validarARS'] = colorVacio;
      item['mostrar'] = 1;
    }

    //Inicio Real
    if(item.inicioReal){
      if(fecha.getTime() === item.inicioReal.getTime()){
        item['validarFechaInicioReal'] = colorVacio;
        item['validarARS'] = colorVacio;
        item['mostrar'] = 1;
      }
    } else {
      item['validarFechaInicioReal'] = colorVacio;
      item['validarARS'] = colorVacio;
      item['mostrar'] = 1;
    }

    //Fin Comprometido
    if(item.finComprometido){
      if(fecha.getTime() === item.finComprometido.getTime()){
        item['validarFechaFinComprometido'] = colorVacio;
        item['validarARS'] = colorVacio;
        item['mostrar'] = 1;
      }
    } else {
      item['validarFechaFinComprometido'] = colorVacio;
      item['validarARS'] = colorVacio;
      item['mostrar'] = 1;
    }
    
    //Fin Planificado
    if(item.finPlanificado){
      if(fecha.getTime() === item.finPlanificado.getTime()){
        item['validarFechaFinPlanificado'] = colorVacio;
        item['validarARS'] = colorVacio;
        item['mostrar'] = 1;
      }
    } else {
      item['validarFechaFinPlanificado'] = colorVacio;
      item['validarARS'] = colorVacio;
      item['mostrar'] = 1;
    }

    //Fin Real
    if(item.finReal){
      if(fecha.getTime() === item.finReal.getTime()){
        item['validarFechaFinReal'] = colorVacio;
        item['validarARS'] = colorVacio;
        item['mostrar'] = 1;
      }
    } else {
      item['validarFechaFinReal'] = colorVacio;
      item['validarARS'] = colorVacio;
      item['mostrar'] = 1;
    }
  }
  
  //realiza las validaciones que hay en el archivo DMS Controles 2023-01
  validarExcel(item, index, arr){
    let colorConsistencia = '#ff6600'; //naranjo
    let colorVacio = '#ff0000'; //rojo
    let colorMes = '#ffff00'; //amarillo

    item['validarFechaInicioComprometido'] = '';
    item['validarFechaInicioPlanificado'] = '';
    item['validarFechaInicioReal'] = '';

    item['validarFechaFinComprometido'] = '';
    item['validarFechaFinPlanificado'] = '';
    item['validarFechaFinReal'] = '';

    item['validarARS'] = '';
    item['validarHorasEstimadas'] = '';

    let fecha = new Date('1899-12-31T00:00:00');
    //let fecha = new Date('2023-01-03T00:00:00');

    let ws_control = "no";
    let ws_hoy = new Date();

    //horas en cero
    if(item.inicioPlanificado){
      item.inicioPlanificado.setHours(0,0,0,0);
    }

    if(item.finPlanificado){
      item.finPlanificado.setHours(0,0,0,0);
    }

    if(item.inicioReal){
      item.inicioReal.setHours(0,0,0,0);
    }

    if(item.finReal){
      item.finReal.setHours(0,0,0,0);
    }

    if(item.inicioComprometido){
      item.inicioComprometido.setHours(0,0,0,0);
    }

    if(item.finComprometido){
      item.finComprometido.setHours(0,0,0,0);
    }

     //Validamos la fecha de inicio comprometido
     if(item.inicioComprometido){
      if(fecha.getTime() === item.inicioComprometido.getTime()){
        item['validarFechaInicioComprometido'] = colorVacio;
        item['mostrar'] = 1;
        ws_control = "si";
      }
    } else {
      item['validarFechaInicioComprometido'] = colorVacio;
      item['mostrar'] = 1;
      ws_control = "si";
    }
	

    //Validamos la fecha de fin comprometido
    if(item.finComprometido){
      if(fecha.getTime() === item.finComprometido.getTime()){
        item['validarFechaFinComprometido'] = colorVacio;
        item['mostrar'] = 1;
        ws_control = "si";
      }
    } else {
      item['validarFechaFinComprometido'] = colorVacio;
      item['mostrar'] = 1;
      ws_control = "si";
    }

    //Validamos la fecha de inicio y fin comprometido, |tencia
    if(ws_control == "no"){
      if( item.inicioComprometido > item.finComprometido ) {
        item['validarFechaInicioComprometido'] = colorConsistencia;
        item['validarFechaFinComprometido'] = colorConsistencia;
        item['mostrar'] = 1;
        ws_control = "si"
      }
    }

    //Validamos el inicio planificado v/s el real
    if( 
      (item.inicioPlanificado && item.inicioPlanificado.getTime() === fecha.getTime()) 
      && 
      (item.inicioReal && item.inicioReal.getTime() != fecha.getTime())
    ){
        item['validarFechaInicioPlanificado'] = colorVacio; 
        item['mostrar'] = 1;
        ws_control = "si"
      }

    if( 
      (item.inicioPlanificado && item.inicioPlanificado.getTime() != fecha.getTime())
      &&
      (item.inicioReal && item.inicioReal.getTime() === fecha.getTime())  
    ){
      if(item.inicioPlanificado && item.inicioPlanificado < ws_hoy){
        item['validarFechaInicioReal'] = colorVacio;
        item['mostrar'] = 1;
        ws_control = "si"
      }      
    }
  
    //Validamos el fin planificado v/s el real
    if( 
        (item.finPlanificado && item.finPlanificado.getTime() === fecha.getTime())
        &&
        (item.finReal && item.finReal.getTime() != fecha.getTime())        
    ){
        item['validarFechaFinPlanificado'] = colorVacio;
        item['mostrar'] = 1;
        ws_control = "si"
    }

    if( 
        (item.finPlanificado && item.finPlanificado.getTime() != fecha.getTime())
        &&
        (item.finReal && item.finReal.getTime() === fecha.getTime())
    ){
        if(item.finPlanificado && item.finPlanificado < ws_hoy){
          item['validarFechaFinReal'] = colorVacio;
          item['mostrar'] = 1;
          ws_control = "si"
        }
    }

    if(ws_control == "si"){
      item['validarARS'] = colorVacio;
      item['mostrar'] = 1;
    }

    //Validamos las fechas de fin comprometidas contra el fin real, si alguna esta fuera del mes de proceso afecta al EV y PV

    

    if(ws_control == "no"){
      if( 
        item.finComprometido && item.finReal &&
        (
          item.finComprometido.getMonth() != item.finReal.getMonth() 
          ||
          item.finComprometido.getFullYear() != item.finReal.getFullYear()
        )
      ){
        item['validarHorasEstimadas'] = colorMes;
        item['validarFechaFinComprometido'] = colorMes;
        item['validarFechaFinReal'] = colorMes;
        item['mostrar'] = 1;
      }
    }
  }

  generateExcel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('DMS Detalle');
    
      // Se establecen anchos de las columnas
      worksheet.getColumn(1).width = 12;
      worksheet.getColumn(2).width = 10;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 38;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 20;
      worksheet.getColumn(8).width = 10;
      worksheet.getColumn(9).width = 20;
      worksheet.getColumn(10).width = 20;
      worksheet.getColumn(11).width = 20;
      worksheet.getColumn(12).width = 20;
      worksheet.getColumn(13).width = 20;
      worksheet.getColumn(14).width = 20;
      worksheet.getColumn(15).width = 20;
      worksheet.getColumn(16).width = 20;

      const headerCS = [
        'Contrato',
        'ARS',
        'Línea de Servicio',
        'Tarea',
        'Horas Estimadas',
        'Horas Planificadas',
        'Horas Incurridas',
        'ETC',
        'Inicio Comprometido',
        'Inicio Planificado',
        'Inicio Real',
        'Fin Comprometido',
        'Fin Planificado',
        'Fin Real',
        'Grupo de Trabajo',
        'Responsable'
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
 

  let newRow; 
  this.JsonArrayDms.forEach(d => {
    newRow = [
              d['contrato'], 
              d['ars'], 
              d['lineaDeServicio'], 
              d['tarea'], 
              d['horasEstimadas'], 
              d['horasPlanificadas'], 
              d['horasIncurridas'], 
              d['etc'], 
              d['inicioComprometido'], 
              d['inicioPlanificado'], 
              d['inicioReal'], 
              d['finComprometido'], 
              d['finPlanificado'], 
              d['finReal'], 
              d['grupoDeTrabajo'], 
              d['responsable']
    ];
    
    let insertedRow = worksheet.addRow(newRow);

    insertedRow.eachCell((cell, number) => {

      if(number == 2){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarARS']) },
          bgColor: { argb: this.toARGB(d['validarARS']) },
        };
      } else if(number == 5){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarHorasEstimadas']) },
          bgColor: { argb: this.toARGB(d['validarHorasEstimadas']) },
        };
      } else if(number == 9){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaInicioComprometido']) },
          bgColor: { argb: this.toARGB(d['validarFechaInicioComprometido']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 10){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaInicioPlanificado']) },
          bgColor: { argb: this.toARGB(d['validarFechaInicioPlanificado']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 11){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaInicioReal']) },
          bgColor: { argb: this.toARGB(d['validarFechaInicioReal']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 12){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaFinComprometido']) },
          bgColor: { argb: this.toARGB(d['validarFechaFinComprometido']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 13){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaFinPlanificado']) },
          bgColor: { argb: this.toARGB(d['validarFechaFinPlanificado']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 14){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaFinReal']) },
          bgColor: { argb: this.toARGB(d['validarFechaFinReal']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      }

    });
  });
  
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    let filename = 'DMS Controles ';
    filename += this.fechaInformeDate.getFullYear();
    filename += '-';
    filename +=  this.fechaInformeDate.getMonth()+1;
    
    filename += '.xlsx';

    fs.saveAs(blob, filename);
  });
  }

  //convierte un color de hex a argb
  toARGB(hex){
    if(hex){
      let salida: string = '';

      salida += hex.charAt(1);
      salida += hex.charAt(2);
      salida += hex.charAt(1);
      salida += hex.charAt(2);

      salida += hex.charAt(3);
      salida += hex.charAt(4);

      salida += hex.charAt(5);
      salida += hex.charAt(6);

      return salida;
    } else {
      return 'ffffffff';
    }
    
  }
}