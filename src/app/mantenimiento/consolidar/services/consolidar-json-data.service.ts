import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsolidarDataService {

  private jsonDataHorasComercial = [];
  private jsonDataHorasTransaccional = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  constructor() { 
    this.monthNames.forEach(mes => {
      this.jsonDataHorasComercial[mes] = [];
      this.jsonDataHorasTransaccional[mes] = [];
    });
  }

  getJsonDataHorasComercial(mes){
    return this.jsonDataHorasComercial[mes];
  }

  getJsonDataHorasTransaccional(mes) {
    return this.jsonDataHorasTransaccional[mes];
  }

  setJsonDataHorasComercial(horas, mes){
    this.jsonDataHorasComercial[mes] = horas;
  }

  setJsonDataHorasTransaccional(horas, mes){
    this.jsonDataHorasTransaccional[mes] = horas;
  }
}