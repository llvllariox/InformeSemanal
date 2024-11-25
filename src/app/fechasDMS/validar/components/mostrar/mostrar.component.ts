import { Component, OnInit } from '@angular/core';
import { DmsJsonDataService } from '../../services/dms-json-data.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarFechasDMSValidarComponent implements OnInit {
  JsonArrayDms: [] = [];
  JsonArrayDmsWeb: [] = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fechaInformeDate;

  constructor(
      public jsonDataService: DmsJsonDataService, 
  ){ 
    this.fechaInformeDate = new Date(jsonDataService.getFechaInforme() + '-05T00:00:00');

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

  //realiza las validaciones sobre la descarga de DMS
  validarExcel(item, index, arr){
    let colorNaranjo = '#ff6600'; //naranjo
    let colorRojo = '#ff0000'; //rojo
    let colorAmarillo = '#ffff00'; //amarillo

    let fechaVacio = new Date('1899-12-31T00:00:00');
    //let fechaVacio = new Date('2023-01-03T00:00:00');

    //color de cada regla
    item['validarFechaInicioPlanificado'] = '';
    item['validarFechaFinPlanificado'] = '';
    item['validarFechaInicioComprometido'] = '';
    item['validarFechaFinComprometido'] = '';
    item['validarFechaInicioReal'] = '';
    item['validarFechaFinReal'] = '';

    
    let fechaActual = new Date();
    fechaActual.setHours(0,0,0,0);

    // ***** FECHAS INICIO *****
    
    //si fecha de inicio comprometida es vacia vacia -> rojo
    if(item.inicioComprometido){
      item.inicioComprometido.setHours(0,0,0,0);

      if(item.inicioComprometido.getTime() == fechaVacio.getTime()){
        item['validarFechaInicioComprometido'] = colorRojo;
        item['mostrar'] = 1; 
      }
    }

    //si fecha de inicio planificada es vacia y 
    //fecha actual > fecha de inicio comprometida -> rojo
    if(item.inicioPlanificado){
      item.inicioPlanificado.setHours(0,0,0,0);

      if(item.inicioPlanificado.getTime() == fechaVacio.getTime()){
        if(item.inicioComprometido){
          item.inicioComprometido.setHours(0,0,0,0);

          if(fechaActual.getTime() > item.inicioComprometido.getTime()){
            item['validarFechaInicioPlanificado'] = colorRojo;
            item['mostrar'] = 1; 
          }
        }
      }
    }
    
    //si fecha de inicio real es vacia y
    //fecha actual > fecha de inicio planificada -> rojo
    if(item.inicioReal){
      item.inicioReal.setHours(0,0,0,0);

      if(item.inicioReal.getTime() == fechaVacio.getTime()){
        if(item.inicioPlanificado){
          item.inicioPlanificado.setHours(0,0,0,0);

          if(fechaActual.getTime() > item.inicioPlanificado.getTime()){
            item['validarFechaInicioReal'] = colorRojo;
            item['mostrar'] = 1; 
          }
        }
      }
    }

    //si fecha de inicio comprometida es diferente a fecha de inicio planificada 
    //y ambas no vacias -> amarillo
    if(item.inicioComprometido && item.inicioPlanificado){
      item.inicioComprometido.setHours(0,0,0,0);
      item.inicioPlanificado.setHours(0,0,0,0);

      if(
          (item.inicioComprometido.getTime() != fechaVacio.getTime())
          &&
          (item.inicioPlanificado.getTime() != fechaVacio.getTime())
          &&
          (item.inicioComprometido.getTime() != item.inicioPlanificado.getTime())
        ){
          item['validarFechaInicioComprometido'] = colorAmarillo;
          item['validarFechaInicioPlanificado'] = colorAmarillo;
          item['mostrar'] = 1; 
        }
    }

    //si fecha de inicio planificada es diferente a fecha de inicio real
    // y ambas no vacias -> amarillo
    if(item.inicioPlanificado && item.inicioReal){
      item.inicioPlanificado.setHours(0,0,0,0);
      item.inicioReal.setHours(0,0,0,0);

      if(
          (item.inicioPlanificado.getTime() != fechaVacio.getTime())
          &&
          (item.inicioReal.getTime() != fechaVacio.getTime())
          &&
          (item.inicioPlanificado.getTime() != item.inicioReal.getTime())
        ){
          item['validarFechaInicioPlanificado'] = colorAmarillo;
          item['validarFechaInicioReal'] = colorAmarillo;
          item['mostrar'] = 1; 
        }
    }

    // ***** FECHAS FIN *****
    //si fecha de fin comprometida es vacia vacia -> rojo
    if(item.finComprometido){
      item.finComprometido.setHours(0,0,0,0);

      if(item.finComprometido.getTime() == fechaVacio.getTime()){
        item['validarFechaFinComprometido'] = colorRojo;
        item['mostrar'] = 1; 
      }
    }

    //si fecha de fin planificada es vacia y 
    //fecha actual > fecha de fin comprometida -> rojo
    if(item.finPlanificado){
      item.finPlanificado.setHours(0,0,0,0);

      if(item.finPlanificado.getTime() == fechaVacio.getTime()){
        if(item.finComprometido){
          item.finComprometido.setHours(0,0,0,0);

          if(fechaActual.getTime() > item.finComprometido.getTime()){
            item['validarFechaFinPlanificado'] = colorRojo;
            item['mostrar'] = 1; 
          }
        }
      }
    }
    
    //si fecha de fin real es vacia y
    //fecha actual > fecha de fin planificada -> rojo
    if(item.finReal){
      item.finReal.setHours(0,0,0,0);

      if(item.finReal.getTime() == fechaVacio.getTime()){
        if(item.finPlanificado){
          item.finPlanificado.setHours(0,0,0,0);

          if(fechaActual.getTime() > item.finPlanificado.getTime()){
            item['validarFechaFinReal'] = colorRojo;
            item['mostrar'] = 1; 
          }
        }
      }
    }

    //si fecha de fin comprometida es diferente a fecha de fin planificada 
    //y ambas no vacias -> amarillo
    if(item.finComprometido && item.finPlanificado){
      item.finComprometido.setHours(0,0,0,0);
      item.finPlanificado.setHours(0,0,0,0);

      if(
          (item.finComprometido.getTime() != fechaVacio.getTime())
          &&
          (item.finPlanificado.getTime() != fechaVacio.getTime())
          &&
          (item.finComprometido.getTime() != item.finPlanificado.getTime())
        ){
          item['validarFechaFinComprometido'] = colorAmarillo;
          item['validarFechaFinPlanificado'] = colorAmarillo;
          item['mostrar'] = 1; 
        }
    }

    //si fecha de fin planificada es diferente a fecha de fin real
    // y ambas no vacias -> amarillo
    if(item.finPlanificado && item.finReal){
      item.finPlanificado.setHours(0,0,0,0);
      item.finReal.setHours(0,0,0,0);

      if(
          (item.finPlanificado.getTime() != fechaVacio.getTime())
          &&
          (item.finReal.getTime() != fechaVacio.getTime())
          &&
          (item.finPlanificado.getTime() != item.finReal.getTime())
        ){
          item['validarFechaFinPlanificado'] = colorAmarillo;
          item['validarFechaFinReal'] = colorAmarillo;
          item['mostrar'] = 1;
        }
    }

    // ***** HORAS *****
    //planif > estimadas
    if(item.horasPlanificadas && item.horasEstimadas){
      if(item.horasPlanificadas > item.horasEstimadas){
        item['validarHorasPlanificadas'] = colorNaranjo;
        item['validarHorasEstimadas'] = colorNaranjo;
        item['mostrar'] = 1;
      }      
    }

    //incu > planif
    if(item.horasIncurridas && item.horasPlanificadas){
      if(item.horasIncurridas > item.horasPlanificadas){
        item['validarHorasIncurridas'] = colorNaranjo;
        item['validarHorasPlanificadas'] = colorNaranjo;
        item['mostrar'] = 1;
      }      
    }

    //marcar en naranjo si las horas estimadas y las planificadas son distintas

    if(item.horasEstimadas && item.horasPlanificadas){ //&& item.finReal){
      if(
        (item.horasEstimadas != item.horasPlanificadas)
      ){
        item['validarHorasEstimadas'] = colorNaranjo;
        item['validarHorasPlanificadas'] = colorNaranjo;
        item['mostrar'] = 1;
      }
    }
  }
  
  //realiza las validaciones que hay en el archivo DMS Controles 2023-01
  validarExcel_old(item, index, arr){
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
    ws_hoy.setHours(0,0,0,0);

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

    //Validamos la fecha de inicio y fin comprometido, consistencia
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
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 38;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
      
    const headerCS = [
      'Responsable',
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
      'Grupo de Trabajo'
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

    worksheet.autoFilter = {
      from: 'A1',
      to: 'P1',
    }

    let newRow; 
    this.JsonArrayDms.forEach(d => {
      if(d['mostrar'] == 1){
          newRow = [
            d['responsable'],
            d['contrato'], 
            "***" + d['ars'], 
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
          ];

      } else {
      newRow = [
          d['responsable'],
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
        ];
      }
    
      let insertedRow = worksheet.addRow(newRow);

      let colorAmarillo = this.toARGB('#ffff00'); //amarillo

    insertedRow.eachCell((cell, number) => {
      if(number == 3){
        if(cell.value.toString().slice(0, 3) == "***"){
          cell.value = Number(cell.value.toString().slice(3));
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colorAmarillo },
            bgColor: { argb: colorAmarillo },
          };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'right'
          };
        }
      } else if(number == 6){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarHorasEstimadas']) },
          bgColor: { argb: this.toARGB(d['validarHorasEstimadas']) },
        };
      } else if(number == 7){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarHorasPlanificadas']) },
          bgColor: { argb: this.toARGB(d['validarHorasPlanificadas']) },
        };
      } else if(number == 8){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarHorasIncurridas']) },
          bgColor: { argb: this.toARGB(d['validarHorasIncurridas']) },
        };
      } else if(number == 10){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaInicioComprometido']) },
          bgColor: { argb: this.toARGB(d['validarFechaInicioComprometido']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 11){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaInicioPlanificado']) },
          bgColor: { argb: this.toARGB(d['validarFechaInicioPlanificado']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 12){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaInicioReal']) },
          bgColor: { argb: this.toARGB(d['validarFechaInicioReal']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 13){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaFinComprometido']) },
          bgColor: { argb: this.toARGB(d['validarFechaFinComprometido']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 14){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaFinPlanificado']) },
          bgColor: { argb: this.toARGB(d['validarFechaFinPlanificado']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      } else if(number == 15){
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.toARGB(d['validarFechaFinReal']) },
          bgColor: { argb: this.toARGB(d['validarFechaFinReal']) },
        };
        cell.numFmt = 'dd/mm/yyyy';
      }

      cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
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