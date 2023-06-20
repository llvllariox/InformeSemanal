import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MantoInformeSemanalService {
  fechaInforme;
  jsonDataMantoInformeSemanal = [];

  constructor() { }

  setFechaInforme(fechaInforme){
    this.fechaInforme = fechaInforme;
  }

  getFechaInforme(){
    return this.fechaInforme;
  }

  setJsonDataMantoInformeSemanal(jsonDataMantoInformeSemanal){
    this.jsonDataMantoInformeSemanal = jsonDataMantoInformeSemanal;
  }

  getJsonDataMantoInformeSemanal(){
    return this.jsonDataMantoInformeSemanal;
  }
}
