import { Injectable } from '@angular/core';
import Hora from '../interfaces/hora.interface';
import { Tipo } from 'src/app/shared/interfaces/feriado';

@Injectable({
  providedIn: 'root'
})
export class MantoInformeSemanalConfService {
  monthNames: string[] = [];

  horasCOriginal: Hora[] = [];
  horasTOriginal: Hora[] = [];

  horasCYears: Number[] = [];
  horasTYears: Number[] = [];





  //horas propuestas
  horasPropuestasOriginal = [];
  horasPropuestasYears = [];
  
  //horas utilizadas
  horasUtilizadasOriginal = [];
  horasUtilizadasYears = [];

  //horas propuestas
  horasTPropuestasOriginal = [];
  horasTPropuestasYears = [];
  
  //horas utilizadas
  horasTUtilizadasOriginal = [];
  horasTUtilizadasYears = [];

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

  //obtiene objeto hora para el mes year month
  getHora(year, month, tipo): Hora {
    let valor: Hora;
    let arreglo: Hora[] = [];

    if(tipo == 'comercial') arreglo = this.horasCOriginal;
    else if(tipo == 'transaccional') arreglo = this.horasTOriginal;

    arreglo.forEach(element => {
      if(month == element.month && year == element.year) {
        valor = element;
      }
    });

    let horaVacia = {
      year: year,
      month: month,
      utilizadas: -1,
      anteriores: -1,
      propuestas: -1
    }

    if(valor) return valor;
    else return horaVacia;
  }


  //obtiene los años disponibles para la data de comercial actual
  getHorasYears(tipo): Number[] {
    //arreglo de horas y arreglo de años
    let arreglo: Hora[] = [];
    let horasYears: Number[] = [];
    

    if(tipo == 'comercial'){
      arreglo = this.horasCOriginal;
      horasYears = this.horasCYears;
    } else if(tipo == 'transaccional') {
       arreglo = this.horasTOriginal;
       horasYears = this.horasTYears;
    }

    let currentYear;
    arreglo.forEach(element => {
      currentYear = element.year;
      if(horasYears.indexOf(currentYear) == -1){
        horasYears.push(currentYear);
      }
    });

    horasYears.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
    
    return horasYears;
  }

  //recibe toda la data almacenada
  setDataOriginal(data, tipo){
    if(tipo == 'comercial') {
      this.horasCOriginal = []; 
      this.horasCOriginal = data;
    } else if(tipo == 'transaccional') {
      this.horasTOriginal = []; 
      this.horasTOriginal = data;
    }
  }

  //true si el documento existe
  existeHora(year, month, tipo){
    let arreglo: Hora[] = [];

    if(tipo == 'comercial') arreglo = this.horasCOriginal;
    else if(tipo == 'transaccional') arreglo = this.horasTOriginal;

    let existe = false;

    arreglo.forEach(element => {
      if(element.year == year && element.month == month) existe = true;
    });

    return existe;
  }





  



  

  //obtiene objeto comercial de la hora para el mes year month
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



  //-------horas Propuestas
  //obtiene los años disponibles para la data actual
  getHorasPropuestasYears(tipo){
    this.horasPropuestasYears = []; 

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

  //obtiene valor de la hora utilizada para el mes year month
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
  validarAgregar(isUtilizada: boolean, year, month): boolean{
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

  //recibe toda la data almacenada de comercial (horas propuestas y utilizadas historicas)
  setDataCOriginal(data){
    this.horasCOriginal = []; 
    this.horasCOriginal = data;
  }



  //obtiene objeto transaccional de la hora para el mes year month
  getHoraT(year, month) {
    let valor; 

    this.horasTOriginal.forEach(element => {
      if(month==element.month && year==element.year) {
        valor = element;
      }
    });

    let horaT = {
      year: year,
      month: month,
      valor: 0,
      isUtilizada: false
    }

    if(valor) return valor;
    else return horaT;
  }


  //obtiene los años disponibles para la data de comercial actual
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

  //obtiene los años disponibles para la data de transaccional actual
  getHorasTYears(){
    this.horasTYears = []; 
    
    let currentYear;
    this.horasTOriginal.forEach(element => {
      currentYear = element.year;
      if(this.horasTYears.indexOf(currentYear) == -1){
        this.horasTYears.push(currentYear);
      }
    });

    this.horasTYears.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
    
    return this.horasTYears;
  }


}
