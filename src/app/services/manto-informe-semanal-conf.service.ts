import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MantoInformeSemanalConfService {
  monthNames = [];

  //horas comercial
  horasCOriginal = [];
  horasCYears = [];

  //horas propuestas
  horasPropuestasOriginal = [];
  horasPropuestasYears = [];
  
  //horas utilizadas
  horasUtilizadasOriginal = [];
  horasUtilizadasYears = [];

  constructor() { 
  }
  
  //retorna un arreglo con los nombres de los meses
  getMonthNames(){
    this.monthNames[0] = "Enero";
    this.monthNames[1] = "Febrero";
    this.monthNames[2] = "Marzo";
    this.monthNames[3] = "Abril";
    this.monthNames[4] = "Mayo";
    this.monthNames[5] = "Junio";
    this.monthNames[6] = "Julio";
    this.monthNames[7] = "Agosto";
    this.monthNames[8] = "Septiembre";
    this.monthNames[9] = "Octubre";
    this.monthNames[10] = "Noviembre";
    this.monthNames[11] = "Diciembre";

    return this.monthNames;
  }

  //recibe toda la data almacenada (horas propuestas y utilizadas historicas)
  setDataOriginal(data, tipo){
    this.horasUtilizadasOriginal = []; 
    this.horasPropuestasOriginal = [];

    //separamos la data en horas propuestas y utilizadas
    data.forEach(element => {
      if(element['isUtilizada'] == true) {
        this.horasUtilizadasOriginal.push(element);
      }
      else this.horasPropuestasOriginal.push(element);
    });
  }

  //-------horas Propuestas
  //obtiene los años disponibles para la data actual
  getHorasPropuestasYears(tipo){
    this.horasPropuestasYears = []; 

    if(tipo == "transaccional"){
    } else  if(tipo == "comercial"){
    }

    let currentYear;
      this.horasPropuestasOriginal.forEach(element => {
        currentYear = element.year;
        if(this.horasPropuestasYears.indexOf(currentYear) == -1){
          this.horasPropuestasYears.push(currentYear);
        }
      });

      this.horasPropuestasYears.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    
    return this.horasPropuestasYears;
  }

  //obtiene la cantidad de horas propuestas para el mes year month
  getHorasPropuestasValor(year, month, tipo) {
    if(Number(month)<10) month = "0" + month;

    let valor = 0; 
    let currentYear;
    let currentMonth;

    this.horasPropuestasOriginal.forEach(element => {
      currentYear = element.year;
      currentMonth = element.month;

      if(month==currentMonth && year==currentYear) {
        valor = element.valor;
      }
    });

    return Number(valor);
  }

  //obtiene objeto de la hora propuesta para el mes year month
  getHoraPropuestas(year, month, tipo) {
    if(Number(month)<10) month = "0" + month;

    let valor; 
    let currentYear;
    let currentMonth;

    this.horasPropuestasOriginal.forEach(element => {
      currentYear = element.year;
      currentMonth = element.month;

      if(month==currentMonth && year==currentYear) {
        valor = element;
      }
    });

    return valor;
  }

  //---------------------- horas Utilizadas
  //obtiene los años en los que hay horas utilizadas
  getHorasUtilizadasYears(tipo){    
    
      let currentYear;
      this.horasUtilizadasOriginal.forEach(element => {
        currentYear = element.year;
        if(this.horasUtilizadasYears.indexOf(currentYear) == -1){
          this.horasUtilizadasYears.push(currentYear);
        }
      });

      this.horasUtilizadasYears.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
    

    return this.horasUtilizadasYears;
  }

  //obtiene horas utilizadas para el mes year month
  getHorasUtilizadasValor(year, month, tipo) {
    if(Number(month)<10) month = "0" + month;

    let valor = 0; 
    let currentYear;
    let currentMonth;

    this.horasUtilizadasOriginal.forEach(element => {
      currentYear = element.year;
      currentMonth = element.month;

      if(month==currentMonth && year==currentYear) {
        valor = element.valor;
      }
    });

    return Number(valor);
  }

  //obtiene objeto de la hora utilizada para el mes year month
  getHoraUtilizadas(year, month, tipo) {
    if(Number(month)<10) month = "0" + month;

    let valor; 
    let currentYear;
    let currentMonth;

    this.horasUtilizadasOriginal.forEach(element => {
      currentYear = element.year;
      currentMonth = element.month;

      if(month==currentMonth && year==currentYear) {
        valor = element;
      }
    });

    return valor;
  }

  //retorna true si no hay valor para year month
  validarAgregar(isUtilizada: boolean, year, month, tipo): boolean{
    let disponible = true;
    let arreglo;


    if(isUtilizada){
      arreglo = this.horasUtilizadasOriginal;
    } else {
      arreglo = this.horasPropuestasOriginal;

    }

    arreglo.forEach(element => {
      if(element.month == month && element.year == year) disponible = false;
    });

    return disponible;
  }







  //recibe toda la data almacenada (horas propuestas y utilizadas historicas)
  setDataCOriginal(data){
    this.horasCOriginal = []; 
    this.horasCOriginal = data;
  }

  //obtiene objeto de la hora para el mes year month
  getHoraC(year, month) {
    let valor; 

    this.horasCOriginal.forEach(element => {
      if(month==element.month && year==element.year) {
        valor = element;
      }
    });

    let horaC = {
      year: year,
      month: month,
      utilizadas: 0,
      anteriores: 0,
      propuestas: 0
    }

    if(valor) return valor;
    else return horaC;
  }

  //obtiene los años disponibles para la data actual
  getHorasCYears(){
    this.horasCYears = []; 
    
    let currentYear;
    this.horasCOriginal.forEach(element => {
      currentYear = element.year;
      if(this.horasCYears.indexOf(currentYear) == -1){
        this.horasCYears.push(currentYear);
      }
    });

    this.horasCYears.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
    
    return this.horasCYears;
  }

  //true si el documento existe
  existeHoraC(year, month){
    let existe = false;

    this.horasCOriginal.forEach(element => {
      if(element.year == year && element.month == month) existe = true;
    });
    return existe;
  }
}
