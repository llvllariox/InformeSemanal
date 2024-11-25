import { Component, OnInit } from '@angular/core';
import { ValidarHHService } from 'src/app/validarHH/services/validarHH.service';
import { FeriadosChileService } from 'src/app/shared/services/feriados-chile.service';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})

export class MostrarValidarHHComponent implements OnInit {
  jsonArrayHoras;

  //indica que las horas habiles fueron calculadas
  flagHorasHabiles: boolean = false;

  horasHabilesMes: number = 0;
  horasHabilesQ1: number = 0;
  horasHabilesQ2: number = 0;
  feriados = [];

  filaEnterpriseId: string[] = [];
  headers: string[] = [];

  detalles: Number[][] = [];
  validacionViernes: Number[][] = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  fechaInformeDate: Date;

  private headerA5DNN001 = 'A5DNN001-Transbank AO Phase 03                   ';
  private A5DNN001 = 'A5DNN001';

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

    let horasHabilesASumar = 9;
    let fecha: Date;
    for (let index = 1; index <= cantidadDias; index++) {
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
        fecha = new Date(fechaTexto + 'T00:00:00');

        let esFeriado = this.feriados.findIndex( feriado => feriado === fechaTexto );

        //si no es domingo ni sábado  ni feriado 
        if(fecha.getDay() != 0 && fecha.getDay() != 6 && esFeriado == -1){
          if(fecha.getDay() == 5) { //viernes
            horasHabilesASumar = 8;
          } else {
            horasHabilesASumar = 9;
          }

          if(index <= 15){ // Q1
            this.horasHabilesQ1 += horasHabilesASumar;
          } else { //Q2
            this.horasHabilesQ2 += horasHabilesASumar;
          }
          
          this.horasHabilesMes += horasHabilesASumar;
          console.log(fecha + ' - sumar: ' + horasHabilesASumar + ' - ' + fecha.getDay());
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
    agrega la columna wbs que es la concatenacion
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

        if(wbs == this.headerA5DNN001) {
          this.detalles[eId][this.A5DNN001 + '_Q1'] = 0;
          this.detalles[eId][this.A5DNN001 + '_Q2'] = 0;
        }
      });
    });

    this.jsonArrayHoras.forEach(fila => {
      this.detalles[fila.enterpriseId][fila.WBS] += fila.hours;

      let filaDate = fila['date ']; 
      let fecha = new Date(filaDate);

      //si es la WBS A5DNN001 la movemos segun su Q
      if(fila.WBS == this.headerA5DNN001) {

        if(fecha.getDate() <= 15) {
          this.detalles[fila.enterpriseId][this.A5DNN001 + '_Q1'] += fila.hours;
        } else {
          this.detalles[fila.enterpriseId][this.A5DNN001 + '_Q2'] += fila.hours;
        }
      }

      //validacion viernes +8
      if(fecha.getDay() == 5){
        //buscamos la fecha en validacionViernes
        let valor = this.validacionViernes[fila.enterpriseId][filaDate];

        if(!valor){
          //se agrega
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
      this.detalles[element]['MME'] = this.horasHabilesMes - suma;
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
      if(this.detalles[element]['MME'] != this.horasHabilesMes){
        this.detalles[element]['Revisar'] = 'DIFF';
      } else {
        this.detalles[element]['Revisar'] = '';
      }
    });

    console.log('HorashábilesQ1: ' + this.horasHabilesQ1);
    console.log('HorashábilesQ2: ' + this.horasHabilesQ2);
    console.log('Horashábiles: ' + this.horasHabilesMes);
  }

  //genera un archivo Excel
  generateExcel(): void {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Validar HH');

    // Se establecen anchos de las columnas
    let largo = this.headers.length;
    let ancho: number = 36;
    worksheet.getColumn(1).width = 28;
    worksheet.getColumn(2).width = 10;
    
    for (let index = 1; index <= largo; index++) {
      worksheet.getColumn(index + 2).width = ancho;
    }
    worksheet.getColumn(largo + 3).width = 40;
    worksheet.getColumn(largo + 4).width = 12;
    worksheet.getColumn(largo + 5).width = 20;

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
      to: this.getAutofiltro(headerCS)+'1',
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


    // --------------------------------------- Target Q1
    worksheet = workbook.addWorksheet('Target Q1');

    worksheet.getColumn(1).width = ancho;
    worksheet.getColumn(2).width = ancho;
    worksheet.getColumn(3).width = ancho;
    worksheet.getColumn(4).width = ancho/2;

    worksheet.autoFilter = {
      from: 'A4',
      to: 'D4',
    }

    //HH Habiles
    let hhHabilesQ1 = [
      'HH Habiles Q1',
      this.horasHabilesQ1
    ];
    let hhHabilesQ1Row = worksheet.addRow(hhHabilesQ1);
    hhHabilesQ1Row.height = 40;

    hhHabilesQ1Row.eachCell((cell, number) => {    
      cell.border = { 
        top: { style: 'thin' }, 
        left: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        right: { style: 'thin' }
      };
    
      cell.font = {
        bold: true
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    let hhTargetQ1 = Math.round(this.horasHabilesQ1*0.96);

    //HH Target
    let hhTargetQ1Header = [
      'HH Target Q1',
      hhTargetQ1,
    ];
    let hhTargetQ1Row = worksheet.addRow(hhTargetQ1Header);
    hhTargetQ1Row.height = 40;

    hhTargetQ1Row.eachCell((cell, number) => {
      cell.border = { 
        top: { style: 'thin' }, 
        left: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        right: { style: 'thin' }
      };
    
      cell.font = {
        bold: true
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    worksheet.addRow(null);

    //header Target Q1
    let headerTargetQ1 = [
      'Enterprise ID',
      this.headerA5DNN001.trim() + ' Q1',
      'Target Q1',
      'Diff Q1'
    ];
  
    let headerTargetQ1Row = worksheet.addRow(headerTargetQ1);

    headerTargetQ1Row.height = 40;

    headerTargetQ1Row.eachCell((cell, number) => {
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

    //contenido Target
    this.filaEnterpriseId.forEach(eId => {
      let newRow = [
        eId,
        this.detalles[eId][this.A5DNN001 + '_Q1'],
      ];

      if(this.detalles[eId][this.A5DNN001 + '_Q1'] - hhTargetQ1 > 0){
          newRow.push('Fuera de Target');
      } else {
        newRow.push('');
      }

      newRow.push(this.detalles[eId][this.A5DNN001 + '_Q1'] - hhTargetQ1);

      worksheet.addRow(newRow);
    });








    // --------------------------------------- Target Q2
    worksheet = workbook.addWorksheet('Target Q2');

    worksheet.getColumn(1).width = ancho;
    worksheet.getColumn(2).width = ancho;
    worksheet.getColumn(3).width = ancho;
    worksheet.getColumn(4).width = ancho/2;

    worksheet.autoFilter = {
      from: 'A4',
      to: 'D4',
    }

    //HH Habiles
    let hhHabilesQ2 = [
      'HH Habiles Q2',
      this.horasHabilesQ2
    ];
    let hhHabilesQ2Row = worksheet.addRow(hhHabilesQ2);
    hhHabilesQ2Row.height = 40;

    hhHabilesQ2Row.eachCell((cell, number) => {    
      cell.border = { 
        top: { style: 'thin' }, 
        left: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        right: { style: 'thin' }
      };
    
      cell.font = {
        bold: true
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    let hhTargetQ2 = Math.round(this.horasHabilesQ2*0.96);

    //HH Target
    let hhTargetQ2Header = [
      'HH Target Q2',
      hhTargetQ2,
    ];
    let hhTargetQ2Row = worksheet.addRow(hhTargetQ2Header);
    hhTargetQ2Row.height = 40;

    hhTargetQ2Row.eachCell((cell, number) => {
      cell.border = { 
        top: { style: 'thin' }, 
        left: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        right: { style: 'thin' }
      };
    
      cell.font = {
        bold: true
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    worksheet.addRow(null);

    //header Target Q2
    let headerTargetQ2 = [
      'Enterprise ID',
      this.headerA5DNN001.trim() + ' Q2',
      'Target Q2',
      'Diff Q2'
    ];
  
    let headerTargetQ2Row = worksheet.addRow(headerTargetQ2);

    headerTargetQ2Row.height = 40;

    headerTargetQ2Row.eachCell((cell, number) => {
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

    //contenido Target
    this.filaEnterpriseId.forEach(eId => {
      console.log(this.detalles[eId]);
      let newRow = [
        eId,
        this.detalles[eId][this.A5DNN001 + '_Q2'],
      ];

      if(this.detalles[eId][this.A5DNN001 + '_Q2'] - hhTargetQ2 > 0){
          newRow.push('Fuera de Target');
      } else {
        newRow.push('');
      }

      newRow.push(this.detalles[eId][this.A5DNN001 + '_Q2'] - hhTargetQ2);

      worksheet.addRow(newRow);
    });







    // --------------------------------------- Target MES
    worksheet = workbook.addWorksheet('Target MES');

    worksheet.getColumn(1).width = ancho;
    worksheet.getColumn(2).width = ancho;
    worksheet.getColumn(3).width = ancho;
    worksheet.getColumn(4).width = ancho/2;

    worksheet.autoFilter = {
      from: 'A4',
      to: 'D4',
    }

    //HH Habiles
    let hhHabiles = [
      'HH Habiles MES',
      this.horasHabilesMes
    ];
    let hhHabilesRow = worksheet.addRow(hhHabiles);
    hhHabilesRow.height = 40;

    hhHabilesRow.eachCell((cell, number) => {    
      cell.border = { 
        top: { style: 'thin' }, 
        left: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        right: { style: 'thin' }
      };
    
      cell.font = {
        bold: true
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    let hhTarget = Math.round(this.horasHabilesMes * 0.96);

    //HH Target
    let hhTargetHeader = [
      'HH Target',
      hhTarget,
    ];
    let hhTargetRow = worksheet.addRow(hhTargetHeader);
    hhTargetRow.height = 40;

    hhTargetRow.eachCell((cell, number) => {    
      cell.border = { 
        top: { style: 'thin' }, 
        left: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        right: { style: 'thin' }
      };
    
      cell.font = {
        bold: true
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    worksheet.addRow(null);

    //header Target
    let headerTarget = [
      'Enterprise ID',
      this.headerA5DNN001.trim(),
      'Target',
      'Diff'
    ];
  
    let headerTargetRow = worksheet.addRow(headerTarget);

    headerTargetRow.height = 40;

    headerTargetRow.eachCell((cell, number) => {
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

    //contenido Target
    this.filaEnterpriseId.forEach(eId => {
      let newRow = [
        eId,
        this.detalles[eId][this.headerA5DNN001],
      ];

      if(this.detalles[eId][this.headerA5DNN001] - hhTarget > 0){
          newRow.push('Fuera de Target');
      } else {
        newRow.push('');
      }

      newRow.push(this.detalles[eId][this.headerA5DNN001] - hhTarget);

      worksheet.addRow(newRow);
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


  //obtiene la celda hasta la que aplicar el autofiltro
  getAutofiltro(headers){
    let abc = ['A',	'B',	'C',	'D',	'E',	'F',	'G',	'H',	'I',	'J',	'K',	'L',
      'M',	'N',	'O',	'P',	'Q',	'R',	'S',	'T',	'U',	'V',	'W',	'X',
      'Y',	'Z',	'AA',	'AB',	'AC',
    ];

    return abc[headers.length-1];
  }

  ngOnInit(): void {
  }

}
