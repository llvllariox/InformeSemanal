import { Component, OnInit } from '@angular/core';
import { ValidarHHService } from 'src/app/validarHH/services/validarHH.service';
import { FeriadosChileService } from 'src/app/shared/services/feriados-chile.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { element } from 'protractor';
//import { MywizardRvJspdfService } from 'src/app/metricas-am/services/mywizard-rv-jspdf.service';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarValidarHHComponent implements OnInit {
  jsonArrayHoras;

  //indica que las horas habiles fueron calculadas
  flagHorasHabiles: boolean = false;

  horasHabiles: number = 0;
  feriados = [];

  filaEnterpriseId: string[] = [];
  headers: string[] = [];

  detalles: Number[][] = [];
  validacionViernes: Number[][] = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  fechaInformeDate: Date;

  constructor(
    public validarHHService: ValidarHHService,
    private feriadosService: FeriadosChileService,
    private sweetAlertService: SweetAlertService,
    //public pdfService: MywizardRvJspdfService, 
  ) {
    this.fechaInformeDate = new Date(validarHHService.getFechaInforme() + '-05');

    if(this.validarHHService.getJsonDataValidarHH !== undefined) {    
      let year: number = this.fechaInformeDate.getFullYear();
      let month: number = this.fechaInformeDate.getMonth() + 1;

      this.feriadosService.getFeriadosMes(month, year).subscribe(resp => {
        this.feriados = resp;
        this.getHorasHabiles(year, month);
      }, err => {
          this.feriados = null;
          this.sweetAlertService.mensajeError('Error al obtener Feriados', err.og.message);
      });
    }
  }

  //obtiene las horas habiles del mes del informe
  getHorasHabiles(year: number, month: number){
    let cantidadDias: number = new Date(year, month, 0).getDate();

    for (let index = 1; index <= cantidadDias; index++) {
        let fecha: Date = new Date(year + '-' + month + '-' + index);

        //sacamos los sabados, domingos y feriados
        let monthTexto = month.toString();
        if(month < 10){ 
            monthTexto = '0' + month.toString();
        }

        let indexTexto = index.toString();
        if(index < 10){ 
            indexTexto = '0' + index.toString();
        }

        let fechaTexto = year + '-' + monthTexto + '-' + indexTexto; 
        let esFeriado = this.feriados.findIndex( feriado => feriado === fechaTexto );

        if(fecha.getDay() !=0 && fecha.getDay() != 6 && esFeriado==-1){
          if(fecha.getDay() == 5) {
            this.horasHabiles += 8;
          } else {
            this.horasHabiles += 9;
          }
        }
    }

    this.calcularMME();   
    this.flagHorasHabiles = true;
  }

  //obtiene los enterpriseID unicos
  getEnterpriseID (jsonArrayHoras): void{
    jsonArrayHoras.forEach(element => {
      let index = this.filaEnterpriseId.findIndex( enterpriseId => enterpriseId === element.enterpriseId );

      if(index == -1){
        this.filaEnterpriseId.push(element.enterpriseId);
      }
    });
  }

  /* 
    agrega la columnaa wbs que es la concatenacion
    de Charge Code y Charge Code Description  
  */
  agregarWbs():void {
    this.jsonArrayHoras.forEach(element => {
      element['WBS'] = element.chargeCode + '-' + element.chargeCodeDescription;
    });
  }

  //obtiene las WBS unicas
  getHeaders(jsonArrayHoras): void{
    jsonArrayHoras.forEach(element => {
      let index = this.headers.findIndex( wbs => wbs === element.WBS );

      if(index == -1){
        this.headers.push(element.WBS);
      }
    });
  }

  //obtiene la suma de horas por persona y WBS
  getDetalles(): void{
    this.filaEnterpriseId.forEach(eId => {
      this.detalles[eId] = [];
      this.validacionViernes[eId] = [];

      this.headers.forEach(wbs => {
        this.detalles[eId][wbs] = 0;
      });
    });

    //validacion viernes +8
    this.jsonArrayHoras.forEach(fila => {
      this.detalles[fila.enterpriseId][fila.WBS] += fila.hours;
      let filaDate = fila['date ']; 
      let fecha = new Date(filaDate);
      if(fecha.getDay() == 5){
        //buscamos la fecha en validacionViernes
        let valor = this.validacionViernes[fila.enterpriseId][filaDate];

        if(!valor){
          //se agrega
          //this.validacionViernes[fila.enterpriseId][filaDate] = fila.hours;
          this.validacionViernes[fila.enterpriseId][filaDate] = 0;
        }

        this.validacionViernes[fila.enterpriseId][filaDate] += fila.hours;
      }
    });

    this.filaEnterpriseId.forEach(eId => {
      this.detalles[eId]['validacionTexto'] = '';
      this.detalles[eId]['validacionFlag'] = 0;

      for (const fecha in this.validacionViernes[eId]) {
        if(this.validacionViernes[eId][fecha] > 8){
          let date = new Date(fecha);
  
          this.detalles[eId]['validacionTexto'] += ' ' + date.getDate().toString() + ',';
          this.detalles[eId]['validacionFlag'] = 1;
        }
      }

      this.detalles[eId]['validacionTexto'] = this.detalles[eId]['validacionTexto'].slice(0, this.detalles[eId]['validacionTexto'].length-1);
    });   
  }

  //calcula la columna MME
  calcularMME(){
    this.jsonArrayHoras = this.validarHHService.getJsonDataValidarHH();

    this.agregarWbs();
    this.getHeaders(this.jsonArrayHoras);
    this.getEnterpriseID(this.jsonArrayHoras);

    this.getDetalles();

    this.filaEnterpriseId.forEach(element => {
      let suma = 0;
      this.headers.forEach(header => { 
        if(
          header.trim() != 'A5DNN001-Transbank AO Phase 03'
          &&
          header.trim() != '970X00-Holiday'
        ){   
          suma += this.detalles[element][header];
        }
      });
      this.detalles[element]['MME'] = this.horasHabiles - suma;
    });   
    
    this.getTotal();
    this.getRevisar();
  }

  //calcula la columna total
  getTotal(){
    this.filaEnterpriseId.forEach(element => {
      let total: number = 0;

      this.headers.forEach(header => {    
        total += this.detalles[element][header];
      });
      this.detalles[element]['Total'] = total;
    });
  }

  //calcula el valor de la columna Revisar
  getRevisar(): void {
    this.filaEnterpriseId.forEach(element => {
      if(this.detalles[element]['MME'] != this.horasHabiles){
        this.detalles[element]['Revisar'] = 'DIFF';
      } else {
        this.detalles[element]['Revisar'] = '';
      }
    });

    console.log('Horashábiles: ' + this.horasHabiles);
  }

  //genera un archivo Excel
  generateExcel(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('validar HH');

    // Se establecen anchos de las columnas
    let ancho: number = 32;
    worksheet.getColumn(1).width = 28;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = ancho;
    worksheet.getColumn(4).width = ancho;
    worksheet.getColumn(5).width = ancho;
    worksheet.getColumn(6).width = ancho;
    worksheet.getColumn(7).width = ancho;
    worksheet.getColumn(8).width = ancho;
    worksheet.getColumn(9).width = ancho;
    worksheet.getColumn(10).width = ancho;
    worksheet.getColumn(11).width = ancho;
    worksheet.getColumn(12).width = ancho;
    worksheet.getColumn(13).width = ancho;
    worksheet.getColumn(14).width = ancho;
    worksheet.getColumn(15).width = ancho;
    worksheet.getColumn(16).width = ancho;
    worksheet.getColumn(17).width = ancho;
    worksheet.getColumn(18).width = ancho;
    worksheet.getColumn(19).width = ancho;
    worksheet.getColumn(20).width = ancho;
    worksheet.getColumn(21).width = 14;
    worksheet.getColumn(22).width = 20;

    //headers
    let headerCS = [
      'Enterprise ID',
      'Total'
    ];
    this.headers.forEach(element => {
      headerCS.push(element.trim());
    });
    headerCS.push('MME (HH Habiles - todas las WBS execpto holiday');
    headerCS.push('Revisar');
    headerCS.push('Viernes +8 horas');
  
    let headerRowCS = worksheet.addRow(headerCS);

    headerRowCS.height = 40;

    worksheet.autoFilter = {
      from: 'A1',
      to: 'U1',
    }

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
    
    //contenido
    this.filaEnterpriseId.forEach(eId => {
      let newRow = [
        eId,
        this.detalles[eId]['Total']
      ];

      this.headers.forEach(header => {
        newRow.push(this.detalles[eId][header]);
      });

      newRow.push(this.detalles[eId]['MME']);
      newRow.push(this.detalles[eId]['Revisar']);
      newRow.push(this.detalles[eId]['validacionTexto']);

      let insertedRow = worksheet.addRow(newRow);

      //let colorAmarillo = this.toARGB('#ffff00'); //amarillo
    });


    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let filename = 'ValidarHH ';
      filename += this.fechaInformeDate.getFullYear();
      filename += '-';
      filename +=  this.fechaInformeDate.getMonth()+1;
      
      filename += '.xlsx';
  
      fs.saveAs(blob, filename);
    });
  }

 /*  generateExcel(){
    
    
      
    

    

    

    

    
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
  
  
  } */

  ngOnInit(): void {
  }

}
