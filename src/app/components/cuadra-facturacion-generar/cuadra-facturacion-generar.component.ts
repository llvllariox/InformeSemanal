import { Component, OnInit } from '@angular/core';
import { CuadraFacturacionJsonDataService } from 'src/app/services/cuadra-facturacion-json-data.service';

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
      //this.generarSalida();
    }
  }

  ngOnInit(): void {
  }

  //agrupa por descripcion y suma las horas 
  getI(){
    this.JsonArrayI.forEach(function(valor, index){
      let flagAgregado = 0;

      this.JsonArrayAgrupadasI.forEach(function(valorA, indexA){
        if(valor['descripcion'] == valorA.descripcion) {
          let nuevasHoras = Number(valor['horas']) + Number(valorA['horas']);
          this.JsonArrayAgrupadasI[indexA]['horas'] = nuevasHoras;
          
          flagAgregado = 1;
        }
      }, this);

      if(flagAgregado == 0){
        //creamos un nuevo arreglo para pasar los datos por valor
        let nuevoArreglo = {
            descripcion: valor['descripcion'], 
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
        if(valor['descripcion'] == valorA.descripcion) {
          let nuevasHoras = Number(valor['horasPlanificadas']) + Number(valorA['horasPlanificadas']);
          this.JsonArrayAgrupadasP[indexA]['horasPlanificadas'] = nuevasHoras;
          
          flagAgregado = 1;
        }
      }, this);

      if(flagAgregado == 0){
        //creamos un nuevo arreglo para pasar los datos por valor
        let nuevoArreglo = {
            descripcion: valor['descripcion'], 
            horasPlanificadas: valor['horasPlanificadas'],
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
        if(valor['nombreRequerimiento'] == valorA.nombreRequerimiento) {
          let nuevasHoras = Number(valor['hhIncurridas']) + Number(valorA['hhIncurridas']);
          this.JsonArrayAgrupadasF[indexA]['hhIncurridas'] = nuevasHoras;
          
          flagAgregado = 1;
        }
      }, this);

      if(flagAgregado == 0){
        //creamos un nuevo arreglo para pasar los datos por valor
        let nuevoArreglo = {
            nombreRequerimiento: valor['nombreRequerimiento'], 
            hhIncurridas: valor['hhIncurridas'],
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
      
      if(valor['descripcion']){
        nombre = valor['descripcion'];
      }else if(valor['nombreRequerimiento']){
        nombre = valor['nombreRequerimiento'];
      }

      let codigo = nombre.slice(0, nombre.indexOf(' '));
      arreglo[index]['codigo'] = codigo;
    }, this);
  }
}