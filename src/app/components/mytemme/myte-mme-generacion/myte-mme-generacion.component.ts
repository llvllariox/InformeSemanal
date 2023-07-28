import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-myte-mme-generacion',
  templateUrl: './myte-mme-generacion.component.html',
  styleUrls: ['./myte-mme-generacion.component.css']
})
export class MyteMmeGeneracionComponent implements OnInit {

  //contiene los headers de las columnas a mostrar
  cabeceras = [];

  //arreglo con todos los enterpriseId que se deben mostrar
  enterpriseId = [];

  //contiene la lista de archivos a mostrar
  archivos;

  //arreglo con la data que se debe mostrar
  arreglo = [];
  arregloWeb = [];

  jsonTemp;
  jsonZH02 = null;
  jsonReviewerTrackingReport = null;
  jsonResourceTrend = null;
  jsonForecastedTimeDetails = null;
  jsonAuthorizationListReport = null;
  jsonPlanillaCompleta = null;

  estadoZH02;
  estadoReviewerTrackingReport;
  estadoResourceTrend;
  estadoForecastedTimeDetails;
  estadoAuthorizationListReport;
  estadoPlanillaCompleta;

  isFiltroOn;
  isFiltroOff;

  constructor(
     private sweetAlertService: SweetAlertService,
  ) {
    this.archivos = [];

    this.cabeceras.push("Enterprise ID");
    this.archivos.push("Enterprise ID");
   }

  ngOnInit(): void {
    this.filtro();
  }

  //agrega el archivo desde el formulario a la tabla
  agregarFile(archivo, event){

    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];

    // ARCHIVO ZH02
    if(archivo=="ZH02"){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
        if (workBook.SheetNames[0] !== 'Sheet1'){
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }
  
        this.jsonZH02 = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, 'AK', 1);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
      
        if (this.jsonZH02['Sheet1'] === undefined) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.jsonZH02 = null;
        } else {
          this.estadoZH02 = true;
          this.jsonZH02 = this.jsonZH02['Sheet1']

          //this.filtrar();

          this.agregarEnterpriseId('ZH02');
          this.preparaArreglo();
          this.preparaDataMostrar();
        }
      };
    }

    //ARCHIVO Reviewer Tracking Report
    else if(archivo=='Reviewer Tracking Report'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
        if (workBook.SheetNames[0] !== 'Reviewer Tracking Report'){
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }
  
        this.jsonReviewerTrackingReport = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, 'R', 3);
          initial[name] = XLSX.utils.sheet_to_json(sheet, {range:2});
          return initial;
        }, {});
      
        if (this.jsonReviewerTrackingReport['Reviewer Tracking Report'] === undefined) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.jsonReviewerTrackingReport = null;
        } else {
          this.estadoReviewerTrackingReport = true;
          this.jsonReviewerTrackingReport = this.jsonReviewerTrackingReport['Reviewer Tracking Report']
          this.filtrar('Reviewer Tracking Report');
          this.agregarEnterpriseId('Reviewer Tracking Report');
          this.preparaArreglo();
          this.preparaDataMostrar();
        }
      };
    }

    //ARCHIVO Resource Trend
    else if(archivo=='Resource Trend'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
        if (workBook.SheetNames[1] !== 'Raw Data'){
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }

        this.jsonResourceTrend = workBook.SheetNames.reduce((initial, name) => {
          if(name === 'Raw Data'){
            const sheet = workBook.Sheets[name];
            this.formularioHeaders(sheet, 'V', 1);
            initial[name] = XLSX.utils.sheet_to_json(sheet);
          }
          return initial;
        }, {});
      
        if (this.jsonResourceTrend['Raw Data'] === undefined) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.jsonResourceTrend = null;
        } else {
          this.estadoResourceTrend = true;
          this.jsonResourceTrend = this.jsonResourceTrend['Raw Data']

          this.filtrar("Resource Trend");

          this.agregarEnterpriseId('Resource Trend');
          this.preparaArreglo();
          this.preparaDataMostrar();
        }
      };
    }

    //ARCHIVO Forecasted Time Details
    else if(archivo=='Forecasted Time Details'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
        if (workBook.SheetNames[0] !== 'Forecasted Time Details'){
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }

        this.jsonForecastedTimeDetails = workBook.SheetNames.reduce((initial, name) => {
          if(name === 'Forecasted Time Details'){
            const sheet = workBook.Sheets[name];
            this.formularioHeaders(sheet, 'AB', 2);
            initial[name] = XLSX.utils.sheet_to_json(sheet, {range:1});
          }
          return initial;
        }, {});
      
        if (this.jsonForecastedTimeDetails['Forecasted Time Details'] === undefined) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.jsonForecastedTimeDetails = null;
        } else {
          this.estadoForecastedTimeDetails = true;
          this.jsonForecastedTimeDetails = this.jsonForecastedTimeDetails['Forecasted Time Details']

          //totalizar Hours por Enterprise ID 
          this.jsonTemp = [];
          let indexTot;

          this.jsonForecastedTimeDetails.forEach(element => {
            indexTot = this.jsonTemp.findIndex(jFDT => jFDT.enterpriseId === element.enterpriseId);

            if(indexTot == -1){
              this.jsonTemp.push(element);
            }
            else {
                this.jsonTemp[indexTot]['hours'] += element.hours;
            }
          });

          this.jsonForecastedTimeDetails = this.jsonTemp;

          //this.filtrar("Forecasted Time Details");

          this.agregarEnterpriseId('Forecasted Time Details');
          this.preparaArreglo();
          this.preparaDataMostrar();
        }
      };
    }

    //ARCHIVO Authorization List Report
    else if(archivo=='Authorization List Report'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
        if (workBook.SheetNames[0] !== 'Authorization List Report'){
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }

        this.jsonAuthorizationListReport = workBook.SheetNames.reduce((initial, name) => {
          if(name === 'Authorization List Report'){
            const sheet = workBook.Sheets[name];
            this.formularioHeaders(sheet, 'P', 4);
            initial[name] = XLSX.utils.sheet_to_json(sheet, {range:3});
          }
          return initial;
        }, {});
      
        if (this.jsonAuthorizationListReport['Authorization List Report'] === undefined) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.jsonAuthorizationListReport = null;
        } else {
          this.estadoAuthorizationListReport = true;
          this.jsonAuthorizationListReport = this.jsonAuthorizationListReport['Authorization List Report']

          //this.filtrar("Authorization List Report");

          this.agregarEnterpriseId('Authorization List Report');
          this.preparaArreglo();
          this.preparaDataMostrar();
        }
      };
    }

    //ARCHIVO Planilla completa
    else if(archivo=='Planilla completa'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
        if (workBook.SheetNames[0] !== 'Completa'){
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }

        this.jsonPlanillaCompleta = workBook.SheetNames.reduce((initial, name) => {
          if(name === 'Completa'){
            const sheet = workBook.Sheets[name];
            this.formularioHeaders(sheet, 'BB', 1);
            initial[name] = XLSX.utils.sheet_to_json(sheet);
          }
          return initial;
        }, {});
      
        if (this.jsonPlanillaCompleta['Completa'] === undefined) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.jsonPlanillaCompleta = null;
        } else {
          this.estadoPlanillaCompleta = true;
          this.jsonPlanillaCompleta = this.jsonPlanillaCompleta['Completa'];

          this.filtrar("Planilla completa");

          this.agregarEnterpriseId('Planilla completa');
          this.preparaArreglo();
          this.preparaDataMostrar();
        }
      };
    }

    reader.readAsBinaryString(file);
  }

  formularioHeaders(sheet, limit, fila){

    function camalize(str) {
        str = str.replace(/\./g, '');
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    let abc = ['A',	'B',	'C',	'D',	'E',	'F',	'G',	'H',	'I',	'J',	'K',	'L',
              'M',	'N',	'O',	'P',	'Q',	'R',	'S',	'T',	'U',	'V',	'W',	'X',
              'Y',	'Z',	'AA',	'AB',	'AC',	'AD',	'AE',	'AF',	'AG', 'AH',
              'AI',	'AJ',	'AK',	'AL',	'AM',	'AN',	'AO', 'AP',	'AQ', 'AR',
              'AS',	'AT',	'AU',	'AV',	'AW',	'AX',	'AY',	'AZ',	'BA',	'BB',
              'BC',	'BD',	'BE',	'BF',	'BG',	'BH',
             ];

    for (const letra of abc) {
      let celda = letra + fila.toString();
      sheet[celda].w = camalize(sheet[celda].w);
      if (letra == limit){
        break;
      }
    }
 }

 //agrega el enterpriseId único y el archivo al arreglo archivos
 agregarEnterpriseId(archivo){

  // ARCHIVO ZH02
  if(archivo=="ZH02"){
    //para cada elemento sacamos su enterpriseId 'unico
    let index;
    this.jsonZH02.forEach(element => {
      let index = this.enterpriseId.findIndex(fila => fila === element.enterpriseId);

      if(index == -1){
        this.enterpriseId.push(element.enterpriseId);
      }
    });
  }

  //ARCHIVO Reviewer Tracking Report
  else if(archivo=='Reviewer Tracking Report'){
    //para cada elemento sacamos su enterpriseId 'unico
    let index;
    this.jsonReviewerTrackingReport.forEach(element => {
      index = this.enterpriseId.findIndex(fila => fila === element.revieweeEnterpriseId);

      if(index == -1){
        this.enterpriseId.push(element.revieweeEnterpriseId);
      }
    });
  }

  //ARCHIVO Resource Trend
  else if(archivo=='Resource Trend'){
    //para cada elemento sacamos su enterpriseId 'unico
    let index;
    this.jsonResourceTrend.forEach(element => {
      index = this.enterpriseId.findIndex(fila => fila === element.name);

      if(index == -1){
        this.enterpriseId.push(element.name);
      }
    });
  }

  //ARCHIVO Forecasted Time Details
  else if(archivo=='Forecasted Time Details'){
    //para cada elemento sacamos su enterpriseId 'unico
    let index;
    this.jsonForecastedTimeDetails.forEach(element => {
      index = this.enterpriseId.findIndex(fila => fila === element.enterpriseId);

      if(index == -1){
        this.enterpriseId.push(element.enterpriseId);
      }
    });
  }

  //ARCHIVO Authorization List Report
  else if(archivo=='Authorization List Report'){
    //para cada elemento sacamos su enterpriseId 'unico
    let index;
    this.jsonAuthorizationListReport.forEach(element => {
      index = this.enterpriseId.findIndex(fila => fila === element.enterpriseId);

      if(index == -1){
        this.enterpriseId.push(element.enterpriseId);
      }
    });
  }

  //ARCHIVO Planilla completa
  else if(archivo=='Planilla completa'){
     //para cada elemento sacamos su enterpriseId 'unico
     let index;
     this.jsonPlanillaCompleta.forEach(element => {
       index = this.enterpriseId.findIndex(fila => fila === element["usuarioAccEi)"]);
 
       if(index == -1){
         this.enterpriseId.push(element["usuarioAccEi)"]);
       }
     });
  }

  //se sacan los enterpriceId vacios
  this.enterpriseId = this.enterpriseId.filter(a => {
    return a != '';
  });

  //ordenamos los enterpriseId
  this.enterpriseId = this.enterpriseId.sort();

  //ARCHIVOS
  this.archivos.push(archivo);

  //agregamos los enterpriseID a la primera columna del arreglo
  this.arreglo['Enterprise ID'] = [];

  this.enterpriseId.forEach(element => {
    this.arreglo['Enterprise ID'].push(element);
    
  });
 }

 //prepara arreglo a mostrar
 preparaArreglo(){

   //para cada archivo se inicializan los arreglos
  this.archivos.forEach(archivo => {
    // ARCHIVO ZH02
    if(archivo=="ZH02"){
      this.arreglo['ZH02'] = [];
    }

    //ARCHIVO Reviewer Tracking Report
    else if(archivo=='Reviewer Tracking Report'){
      this.arreglo['Reviewer Tracking Report'] = [];
    }

    //ARCHIVO Resource Trend
    else if(archivo=='Resource Trend'){
      this.arreglo['Resource Trend'] = [];
    }

    //ARCHIVO Forecasted Time Details
    else if(archivo=='Forecasted Time Details'){
      this.arreglo['Forecasted Time Details'] = [];
    }

    //ARCHIVO Authorization List Report
    else if(archivo=='Authorization List Report'){
      this.arreglo['Authorization List Report'] = [];
    }

    //ARCHIVO Planilla completa
    else if(archivo=='Planilla completa'){
      this.arreglo['Planilla completa'] = [];
    }
  }); 

  let i;

  //recorremos los enterpriseId
  this.enterpriseId.forEach(eid => {

    //recorremos la lista de archivos a mostrar
    this.archivos.forEach(archivo => {

      i = this.buscarEnterpriseId(eid, archivo);

      // ARCHIVO ZH02
      if(archivo=="ZH02"){
        if(i == -1){
          this.arreglo['ZH02'].push('NO');
        } else {
          //this.arreglo['ZH02'].push(eid);
          this.arreglo['ZH02'].push('SI');
        }
      }

      //ARCHIVO Reviewer Tracking Report
      else if(archivo=='Reviewer Tracking Report'){
        if(i == -1){
          this.arreglo['Reviewer Tracking Report'].push('NO');
        } else {
          //this.arreglo['Reviewer Tracking Report'].push(eid);
          this.arreglo['Reviewer Tracking Report'].push('SI');
        }
      }

      //ARCHIVO Resource Trend
      else if(archivo=='Resource Trend'){
        if(i == -1){
          this.arreglo['Resource Trend'].push('NO');
        } else {
          this.arreglo['Resource Trend'].push(this.jsonResourceTrend[i].quantity);          
        }
      }

      //ARCHIVO Forecasted Time Details
      else if(archivo=='Forecasted Time Details'){
        if(i == -1){
          this.arreglo['Forecasted Time Details'].push('NO');
        } else {
          this.arreglo['Forecasted Time Details'].push(this.jsonForecastedTimeDetails[i].hours);          
        }
      }

      //ARCHIVO Authorization List Report
      else if(archivo=='Authorization List Report'){
        if(i == -1){
          this.arreglo['Authorization List Report'].push('NO');
       } else {
          //this.arreglo['Authorization List Report'].push(this.jsonAuthorizationListReport[i].enterpriseId);
          this.arreglo['Authorization List Report'].push('SI');
       }
      }

      //ARCHIVO Planilla completa
      else if(archivo=='Planilla completa'){
        if(i == -1){
            this.arreglo['Planilla completa'].push('NO');
        } else {
            //this.arreglo['Planilla completa'].push(this.jsonPlanillaCompleta[i]["usuarioAccEi)"]);
            this.arreglo['Planilla completa'].push('SI');
        }
      }
    });
  });
 }

 //prepara data a mostrar (thead y tbody)
 preparaDataMostrar(){
      //agregamos las cabeceras
      this.cabeceras = [];

      //this.archivos = this.archivos.reverse();
      this.archivos.forEach(archivo => {
      
      // columna Enterprise ID
      if(archivo=="Enterprise ID"){
        this.cabeceras.push('Enterprise ID');
      }

      // ARCHIVO ZH02
      if(archivo=="ZH02"){
        this.cabeceras.push('ZH02');
      }

      //ARCHIVO Reviewer Tracking Report
      else if(archivo=='Reviewer Tracking Report'){
        this.cabeceras.push('Reviewer Tracking Report');
      }

      //ARCHIVO Resource Trend
      else if(archivo=='Resource Trend'){
        this.cabeceras.push('Resource Trend');
      }

      //ARCHIVO Forecasted Time Details
      else if(archivo=='Forecasted Time Details'){
        this.cabeceras.push('Forecasted Time Details');
      }

      //ARCHIVO Authorization List Report
      else if(archivo=='Authorization List Report'){
        this.cabeceras.push('Authorization List Report');
      }

      //ARCHIVO Planilla completa
      else if(archivo=='Planilla completa'){
        this.cabeceras.push('Planilla completa');
      }
    });
  
    //cabeceras
    this.archivos.forEach(element => {
      this.arregloWeb[element] = [];
    });
   

    let pos = 0;
    let agregar;
    this.arreglo[this.archivos[0]].forEach(element => {
      agregar = false;

      this.archivos.forEach(element => {
        if(this.arreglo[element] && this.arreglo[element][pos] == 'NO'){
          agregar = true;
        }
      });

      if(agregar){
        this.archivos.forEach(element => {
          this.arregloWeb[element].push(this.arreglo[element][pos]);
        });
      }
      pos++;
    });

    //this.arreglo se muestra en el excel
    //console.log(this.arreglo);
    //console.log(this.arregloWeb);

 }

 //el index del enterpriseId en el json archivo
 buscarEnterpriseId(eid, archivo){
  let index;

  // ARCHIVO ZH02
  if(archivo=="ZH02"){
    index = this.jsonZH02.findIndex(fila => fila.enterpriseId === eid);
  }

  //ARCHIVO Reviewer Tracking Report
  else if(archivo=='Reviewer Tracking Report'){
    index = this.jsonReviewerTrackingReport.findIndex(fila => fila.revieweeEnterpriseId === eid);
  }

  //ARCHIVO Resource Trend
  else if(archivo=='Resource Trend'){
    index = this.jsonResourceTrend.findIndex(fila => fila.name === eid);
  }

  //ARCHIVO Forecasted Time Details
  else if(archivo=='Forecasted Time Details'){
    index = this.jsonForecastedTimeDetails.findIndex(fila => fila.enterpriseId === eid);
  }

  //ARCHIVO Authorization List Report
  else if(archivo=='Authorization List Report'){
    index = this.jsonAuthorizationListReport.findIndex(fila => fila.enterpriseId === eid);
  }

  //ARCHIVO Planilla completa
  else if(archivo=='Planilla completa'){
    index = this.jsonPlanillaCompleta.findIndex(fila => fila["usuarioAccEi)"] === eid);
  }

  return index;
 }

 //se filtra la data que viene del excel segun corresponda
 filtrar(archivo){
  //ARCHIVO Reviewer Tracking Report
  if(archivo=='Reviewer Tracking Report'){
    this.jsonReviewerTrackingReport = this.jsonReviewerTrackingReport.filter(a => {
      return a.reviewerEnterpriseId === 'm.nunez.fuentes';
    });
  }

  //ARCHIVO Resource Trend
  else if(archivo=='Resource Trend'){
    this.jsonResourceTrend = this.jsonResourceTrend.filter(a => {
      return a.category === 'Hours';
    });
  }

  //ARCHIVO Planilla completa
  else if(archivo=='Planilla completa'){
    this.jsonPlanillaCompleta = this.jsonPlanillaCompleta.filter(a => {
      return a.estadoEmpleado === 'Activo';
    });
  }
 }

 //se hace click sobre el filtro
 filtro(){
  let checkboxFiltro = <HTMLInputElement> document.getElementById("checkboxFiltro");
  if(checkboxFiltro.checked){
    console.log("filtroOn");

    this.isFiltroOn = true;
    this.isFiltroOff = false;

    
  } else {
    console.log("filtroOff");

    this.isFiltroOn = false;
    this.isFiltroOff = true;
    
  }
 }

 generarExcel(){
  let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Reporte');
      
      // Se establecen anchos de las columnas
      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 26;
      worksheet.getColumn(3).width = 26;
      worksheet.getColumn(4).width = 26;
      worksheet.getColumn(5).width = 26;
      worksheet.getColumn(6).width = 26;
      worksheet.getColumn(7).width = 26;

      const headers = [];
      this.archivos.forEach(element => {
        headers.push(element);
      });
      let headerRow = worksheet.addRow(headers);

      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
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
  
      headerRow.height = 40;      

      let newRow = []; 
      let posEID = 0;


      this.arreglo[this.archivos[0]].forEach(element1 => {
        newRow = [];
        this.archivos.forEach(archivo => {
          newRow.push(this.arreglo[archivo][posEID]);
        });

        worksheet.addRow(newRow);
        posEID++;
      });
      
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let filename = 'Reporte';
        filename += '.xlsx';
    
        fs.saveAs(blob, filename);
      });
 }
}
