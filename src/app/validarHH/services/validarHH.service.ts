import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidarHHService {
  fechaInforme: Date;
  jsonDataValidarHH = [];

  constructor() { }  

  setFechaInforme(fechaInforme){
    this.fechaInforme = fechaInforme;
  }

  getFechaInforme(){
    return this.fechaInforme;
  }

  setJsonDataValidarHH(jsonDataValidarHH){
    this.jsonDataValidarHH = jsonDataValidarHH;
  }

  getJsonDataValidarHH(){
    return this.jsonDataValidarHH;
  }
}
