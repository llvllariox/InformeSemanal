import { Component, OnInit } from '@angular/core';
import { CuadraFacturacionJsonDataService } from 'src/app/services/cuadra-facturacion-json-data.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-cuadra-facturacion-generar',
  templateUrl: './cuadra-facturacion-generar.component.html'
})
export class CuadraFacturacionGenerarComponent implements OnInit {

  JsonArrayI: [] = [];
  JsonArrayP: [] = [];
  JsonArrayF: [] = [];

  JsonArrayAgrupadasI: [] = [];
  JsonArrayAgrupadasP: [] = [];
  JsonArrayAgrupadasF: [] = [];

  salidaArreglo: [] = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fechaInformeDate;

  constructor(public cuadraFacturacionJsonDataService: CuadraFacturacionJsonDataService) { 
    this.fechaInformeDate = new Date(cuadraFacturacionJsonDataService.getFechaInforme());

    if(this.cuadraFacturacionJsonDataService.jsonDataReqIService !== undefined) {
      this.JsonArrayI = this.cuadraFacturacionJsonDataService.getJsonDataReqIService();
      this.getI();
      this.agregarCodigo('I');
    }

    if(this.cuadraFacturacionJsonDataService.jsonDataReqPService !== undefined) {
      this.JsonArrayP = this.cuadraFacturacionJsonDataService.getJsonDataReqPService();
      this.getP();
      this.agregarCodigo('P');
    }

    if(this.cuadraFacturacionJsonDataService.jsonDataReqFService !== undefined) {
      this.JsonArrayF = this.cuadraFacturacionJsonDataService.getJsonDataReqFService();
      this.getF();
      this.agregarCodigo('F');
    }

    if(this.JsonArrayF && this.JsonArrayF && this.JsonArrayF){
      this.generarSalida();
    }
  }

  ngOnInit(): void {
  }

  //agrupa por descripcion y suma las horas 
  getI(){
    this.JsonArrayI.forEach(function(valor, index){
      let flagAgregado = 0;

      this.JsonArrayAgrupadasI.forEach(function(valorA, indexA){
        if(valor['nombre'] == valorA.nombre) {
          let nuevasHoras = Number(valor['horas']) + Number(valorA['horas']);
          this.JsonArrayAgrupadasI[indexA]['horas'] = nuevasHoras;
          
          flagAgregado = 1;
        }
      }, this);

      if(flagAgregado == 0){
        //creamos un nuevo arreglo para pasar los datos por valor
        let nuevoArreglo = {
            nombre: valor['nombre'], 
            horas: valor['horas'],
            lineaDeServicio: valor['lineaDeServicio']
        };
        this.JsonArrayAgrupadasI.push(nuevoArreglo);
      }
    }, this);
  }

  //agrupa por descripcion y suma las horas 
  getP(){
    this.JsonArrayP.forEach(function(valor, index){
      let flagAgregado = 0;

      this.JsonArrayAgrupadasP.forEach(function(valorA, indexA){
        if(valor['nombre'] == valorA.nombre) {
          let nuevasHoras = Number(valor['horas']) + Number(valorA['horas']);
          this.JsonArrayAgrupadasP[indexA]['horas'] = nuevasHoras;
          
          flagAgregado = 1;
        }
      }, this);

      if(flagAgregado == 0){
        //creamos un nuevo arreglo para pasar los datos por valor
        let nuevoArreglo = {
            nombre: valor['nombre'], 
            horas: valor['horas'],
            lineaDeServicio: valor['lineaDeServicio']
        };
        this.JsonArrayAgrupadasP.push(nuevoArreglo);
      }
    }, this);
  }

  //agrupa por descripcion y suma las horas 
  getF(){
    this.JsonArrayF.forEach(function(valor, index){
      let flagAgregado = 0;

      this.JsonArrayAgrupadasF.forEach(function(valorA, indexA){
        if(valor['nombre'] == valorA.nombre) {
          let nuevasHoras = Number(valor['horas']) + Number(valorA['horas']);
          this.JsonArrayAgrupadasF[indexA]['horas'] = nuevasHoras;
          
          flagAgregado = 1;
        }
      }, this);

      if(flagAgregado == 0){
        //creamos un nuevo arreglo para pasar los datos por valor
        let nuevoArreglo = {
            nombre: valor['nombre'], 
            horas: valor['horas'],
            lineaDeServicio: valor['lineaDeServicio']
        };
        this.JsonArrayAgrupadasF.push(nuevoArreglo);
      }
    }, this);
  }

  //al arreglo de valores agrupados le agregamos el codigo
  agregarCodigo(tipo: String){
    let arreglo = [];
    
    if(tipo == 'I'){
      arreglo = this.JsonArrayAgrupadasI;
    } else if(tipo == 'P'){
      arreglo = this.JsonArrayAgrupadasP;
    }if(tipo == 'F'){
      arreglo = this.JsonArrayAgrupadasF;
    }
    
    arreglo.forEach(function(valor, index){
      let nombre = '';
    
      nombre = valor['nombre'];
    
      let codigo = nombre.slice(0, nombre.indexOf(' '));
      arreglo[index]['codigo'] = codigo;
    }, this);
  }

  //arma el arreglo para la salida
  generarSalida(){
    let tipos = ['I', 'P', 'F'];
    let arreglo = [];
  
    tipos.forEach(tipo => {
      if(tipo == 'I'){
        arreglo = this.JsonArrayAgrupadasI;
      } else if(tipo == 'P'){
        arreglo = this.JsonArrayAgrupadasP;
      }if(tipo == 'F'){
        arreglo = this.JsonArrayAgrupadasF;
      }

      //para cada req de cada tipo lo intentamos parear 
      arreglo.forEach(function(valor, index){
          valor['tipo'] = tipo;

          let flagAgregado = false;

          this.salidaArreglo.forEach(function(valorSalida, indexSalida){
            if(valorSalida['codigo'] == valor['codigo']){

              //vemos el tipo
              if(!valorSalida[tipo]){
                //lo debemos agregar
                this.salidaArreglo[indexSalida][tipo] = valor['horas'];
              } else {
                console.log('choque');
              }

              flagAgregado = true;
            }
        }, this);

        if(flagAgregado == false){
          let nuevoElemento = [];
          nuevoElemento['codigo'] = valor['codigo'];
          nuevoElemento['nombre'] = valor['nombre'];
          nuevoElemento['tipo'] = valor['horas'];

          this.salidaArreglo.push(nuevoElemento);
        }
      }, this);
    });

    this.marcar();

    this.salidaArreglo.sort((a, b) => {
      const nameA = a['codigo'];
      const nameB = b['codigo'];
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  //todos los req que no parean se marcan con un -
  marcar(){
    this.salidaArreglo.forEach(function(valor, index){
      if(!valor['I']) this.salidaArreglo[index]['I'] = 0;
      if(!valor['P']) this.salidaArreglo[index]['P'] = 0;
      if(!valor['F']) this.salidaArreglo[index]['F'] = 0;

      //vemos si hay un cero o alguna diferencia
      if(
        valor['I'] == 0
        || valor['P'] == 0
        || valor['F'] == 0
        || (valor['I'] != valor['P'] || valor['P'] != valor['F'])
        ){
          this.salidaArreglo[index]['noCumple'] = 1;
      }
    }, this);
  }

  generateExcel(){
    let workbook = new Workbook();

    this.getHojaResumen(workbook, 'P', 'Evolutivo Mayor', 'Resumen Horas Planif');
    this.getHojaResumen(workbook, 'I', 'Evolutivo Mayor', 'Resumen Horas Incurr');

    this.getHojaResumen(workbook, 'P', 'Capacity Service', 'Resumen CS Planificadas');
    this.getHojaResumen(workbook, 'I', 'Capacity Service', 'Resumen CS Incurridas');
    
    this.getHojaDiferencias(workbook);

    /*
    worksheet.views = [
      {state: 'frozen', xSplit: 2, ySplit: 1}
    ];
    */

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let filename = 'Revisión Facturación ';
      filename +=  this.monthNames[this.fechaInformeDate.getMonth()+1];
      filename += ' ' + this.fechaInformeDate.getFullYear();
      filename += '.xlsx';

      fs.saveAs(blob, filename);
    });   
  }

  
  //genera la hoja del tipo (I o P) de la lineaDeServicio (Evolutivo Mayor o Capacity Service)
  getHojaResumen(workbook, tipo, lineaDeServicio, hoja){
    let worksheet = workbook.addWorksheet(hoja);

    // Se establecen anchos de las columnas 
    worksheet.getColumn(1).width = 80;
    worksheet.getColumn(2).width = 18;

    worksheet.autoFilter = {
      from: 'A1',
      to: 'A1',
    }

    const headerCS = [
      'Descripción', 'Total'
    ];
    let headerRowCS = worksheet.addRow(headerCS);

    let arreglo;
    if(tipo == 'P') arreglo = this.JsonArrayAgrupadasP;
    else if(tipo == 'I') arreglo = this.JsonArrayAgrupadasI;

    arreglo.forEach(d => {
      if(d['lineaDeServicio'] == lineaDeServicio) {
        let row = worksheet.addRow([d['nombre'], d['horas']]); 
      }
    });
  }

  //genera la hoja Diferencias del archivo
  getHojaDiferencias(workbook){
    let worksheet = workbook.addWorksheet('Diferencias');

    // Se establecen anchos de las columnas
   worksheet.getColumn(1).width = 80;
   worksheet.getColumn(2).width = 18;
   worksheet.getColumn(3).width = 18;
   worksheet.getColumn(4).width = 18;
   worksheet.getColumn(5).width = 60;

   worksheet.autoFilter = {
     from: 'A1',
     to: 'D1',
   }

   const headerCS = [
     'Descripción', 'Planificado (HH)', 'Incurrido (HH)', 'Facturado (HH)', 'Comentarios'
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

   this.salidaArreglo.forEach(d => {
    if(d['noCumple'] == 1) {
      worksheet.addRow([d['nombre'], d['P'] , d['I'], d['F'], '']); 
    }
   });
 }
}