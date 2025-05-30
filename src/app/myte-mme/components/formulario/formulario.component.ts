import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioMyteMMEComponent implements OnInit {
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
   jsonTimeReportStatus = null;
   jsonResourceTrend = null;
   jsonForecastedTimeDetails = null;
   jsonAuthorizationListReport = null;
   jsonPlanillaCompleta = null;
   jsonRevenuesNewAO = null;
 
   estadoZH02;
   estadoTimeReportStatus;
   estadoResourceTrend;
   estadoForecastedTimeDetails;
   estadoAuthorizationListReport;
   estadoPlanillaCompleta;
   estadoRevenuesNewAO;
 
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

   //ARCHIVO Time Report Status
   else if(archivo=='Time Report Status'){
     reader.onload = () => {
       const data = reader.result;
       workBook = XLSX.read(data, { type: 'binary', cellDates : true });
       if (workBook.SheetNames[0] !== 'Time Report Status'){
         this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
         return;
       }
 
       this.jsonTimeReportStatus = workBook.SheetNames.reduce((initial, name) => {
         const sheet = workBook.Sheets[name];
         this.formularioHeaders(sheet, 'R', 3);
         initial[name] = XLSX.utils.sheet_to_json(sheet, {range:2});
         return initial;
       }, {});
     
       if (this.jsonTimeReportStatus['Time Report Status'] === undefined) {
         this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
         this.jsonTimeReportStatus = null;
       } else {
         this.estadoTimeReportStatus = true;
         this.jsonTimeReportStatus = this.jsonTimeReportStatus['Time Report Status']
         //this.filtrar('Time Report Status');
         this.agregarEnterpriseId('Time Report Status');
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

         //totalizar Quantity por Name
         this.jsonTemp = [];
         let indexTot;

         this.jsonResourceTrend.forEach(element => {
           indexTot = this.jsonTemp.findIndex(jFDT => jFDT.name === element.name);

           if(indexTot == -1){
             this.jsonTemp.push(element);
           }
           else {
               this.jsonTemp[indexTot]['quantity'] += element.quantity;
           }
         });

         this.jsonResourceTrend = this.jsonTemp;

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
           this.formularioHeaders(sheet, 'AQ', 1);
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

   //ARCHIVO Revenues New AO
   else if(archivo=='Revenues New AO'){
     reader.onload = () => {
       const data = reader.result;
       workBook = XLSX.read(data, { type: 'binary', cellDates : true });
       if (workBook.SheetNames[1] !== 'NEW AO'){
         this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
         return;
       }
 
       this.jsonRevenuesNewAO = workBook.SheetNames.reduce((initial, name) => {
         if(name === 'NEW AO'){
           const sheet = workBook.Sheets[name];
           this.formularioHeadersRevenuesNewAO(sheet, 'G', 3);
           initial[name] = XLSX.utils.sheet_to_json(sheet, {range:2});
         }

         return initial;
       }, {});
     
       if (this.jsonRevenuesNewAO['NEW AO'] === undefined) {
         this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
         this.jsonRevenuesNewAO = null;
       } else {
         this.estadoRevenuesNewAO = true;
         this.jsonRevenuesNewAO = this.jsonRevenuesNewAO['NEW AO']
         //this.filtrar('Revenues New AO');
         this.agregarEnterpriseId('Revenues New AO');
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

formularioHeadersRevenuesNewAO(sheet, limit, fila){

 function camalize(str) {
     str = str.replace(/\./g, '');
     str = str.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
     return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
 }

 let abc = ['B',	'C',	'D',	'E',	'F',	'G',	'H',	'I',	'J',	'K',	'L',
           'M',	'N',	'O',	'P',	'Q',	'R',	'S',	'T',	'U',	'V',	'W',	'X',
           'Y',	'Z'
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

 //ARCHIVO Time Report Status
 else if(archivo=='Time Report Status'){
   //para cada elemento sacamos su enterpriseId 'unico
   let index;
   this.jsonTimeReportStatus.forEach(element => {
     index = this.enterpriseId.findIndex(fila => fila === element.enterpriseId);

     if(index == -1){
       this.enterpriseId.push(element.enterpriseId);
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

 //ARCHIVO Revenues New AO
 else if(archivo=='Revenues New AO'){
    //para cada elemento sacamos su enterpriseId 'unico
    let index;
    this.jsonRevenuesNewAO.forEach(element => {
      index = this.enterpriseId.findIndex(fila => fila === element["eid)"]);

      if(index == -1){
        this.enterpriseId.push(element["eid"]);
      }
    });
 }

 //se sacan los enterpriseId vacios
 this.enterpriseId = this.enterpriseId.filter(a => {
   return a != '' && a !=undefined;
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

   //ARCHIVO Time Report Status
   else if(archivo=='Time Report Status'){
     this.arreglo['Time Report Status'] = [];
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

   //ARCHIVO Revenues New AO
   else if(archivo=='Revenues New AO'){
     this.arreglo['Revenues New AO'] = [];
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

     //ARCHIVO Time Report Status
     else if(archivo=='Time Report Status'){
       if(i == -1){
         this.arreglo['Time Report Status'].push('NO');
       } else {
         this.arreglo['Time Report Status'].push(this.jsonTimeReportStatus[i].trStatus);
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

     //ARCHIVO Revenues New AO
     else if(archivo=='Revenues New AO'){
       if(i == -1){
           this.arreglo['Revenues New AO'].push('NO');
       } else {
           this.arreglo['Revenues New AO'].push('SI');
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
       this.cabeceras.push('ZH02 (Deploy)');
     }

     //ARCHIVO Time Report Status
     else if(archivo=='Time Report Status'){
       this.cabeceras.push('Time Report Status (Status MyTe)');
     }

     //ARCHIVO Resource Trend
     else if(archivo=='Resource Trend'){
       this.cabeceras.push('Resource Trend (Forecast/MME)');
     }

     //ARCHIVO Forecasted Time Details
     else if(archivo=='Forecasted Time Details'){
       this.cabeceras.push('Forecasted Time Details (HH MyTe)');
     }

     //ARCHIVO Authorization List Report
     else if(archivo=='Authorization List Report'){
       this.cabeceras.push('Authorization List Report (Autorizar WBS)');
     }

     //ARCHIVO Planilla completa
     else if(archivo=='Planilla completa'){
       this.cabeceras.push('Planilla completa (Estructura Equipo)');
     }

     //ARCHIVO Revenues New AO
     else if(archivo=='Revenues New AO'){
       this.cabeceras.push('Revenues New AO (Forecast Revenues)');
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

 //ARCHIVO Time Report Status
 else if(archivo=='Time Report Status'){
   index = this.jsonTimeReportStatus.findIndex(fila => fila.enterpriseId === eid);
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

 //ARCHIVO Revenues New AO
 else if(archivo=='Revenues New AO'){
   index = this.jsonRevenuesNewAO.findIndex(fila => fila["eid"] === eid);
 }

 return index;
}

//se filtra la data que viene del excel segun corresponda
filtrar(archivo){
 //ARCHIVO Resource Trend
 if(archivo=='Resource Trend'){
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
    this.isFiltroOn = true;
    this.isFiltroOff = false;
  } else {
    this.isFiltroOn = false;
    this.isFiltroOff = true;    
  }
}

generarExcel(){
 let workbook = new Workbook();
     let worksheet = workbook.addWorksheet('Reporte');
     
     // Se establecen anchos de las columnas
     worksheet.getColumn(1).width = 28; // eid
     worksheet.getColumn(2).width = 14; //error
     worksheet.getColumn(3).width = 36;
     worksheet.getColumn(4).width = 36;
     worksheet.getColumn(5).width = 36;
     worksheet.getColumn(6).width = 36;
     worksheet.getColumn(7).width = 36;
     worksheet.getColumn(8).width = 36;
     worksheet.getColumn(9).width = 36;

     const headers = [];
     this.cabeceras.forEach(element => {
       headers.push(element);
       if(element == 'Enterprise ID') headers.push("Error");
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

     //autofilter
     let to = 'B1';
     switch (this.cabeceras.length) {
       case 2:
             to = 'C1';
             break;
       case 3:
             to = 'D1';
             break;
       case 4:
             to = 'E1';
             break;
       case 5:
             to = 'F1';
             break;
       case 6:
             to = 'G1';
             break;
       case 7:
             to = 'H1';
             break;
       case 8:
             to = 'I1';
             break;
       default:
         to = 'B1'
         break;
     }

     worksheet.autoFilter = {
       from: 'A1',
       to: to,
     }


     let newRow = []; 
     let posEID = 0;

     this.arreglo[this.archivos[0]].forEach(element1 => {
       newRow = [];

       let agregarError = true;
       let indexError;

       this.archivos.forEach(archivo => {
         newRow.push(this.arreglo[archivo][posEID]);

         if(agregarError == true){
             
           indexError = this.arregloWeb['Enterprise ID'].findIndex(arreglo => arreglo === this.arreglo['Enterprise ID'][posEID]);
           if(indexError == -1){
             newRow.push('NO');
           } else {
             newRow.push('SI');
           }
           
           agregarError = false;
         }
       });

       let filaAgregada = worksheet.addRow(newRow);
       filaAgregada.eachCell((cell, number) => {
         cell.alignment = {
           vertical: 'middle',
           horizontal: 'right'
         };
       });
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