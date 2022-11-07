import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuadraFacturacionJsonDataService {
  fechaInforme: string;

  jsonDataReqIService;
  jsonDataReqPService;
  jsonDataReqFService;

  constructor() { }

  getFechaInforme() {
    return this.fechaInforme;
  }

  setFechaInforme(fecha: string){
    this.fechaInforme = fecha;
  }

  getJsonDataReqIService() {
    return this.jsonDataReqIService;
  }

  setJsonDataReqIService(jsonDataReqIService: any) {
    this.jsonDataReqIService = jsonDataReqIService;
  }

  getJsonDataReqPService() {
    return this.jsonDataReqPService;
  }

  setJsonDataReqPService(jsonDataReqPService: any) {
    this.jsonDataReqPService = jsonDataReqPService;
  }

  getJsonDataReqFService() {
    return this.jsonDataReqFService;
  }

  setJsonDataReqFService(jsonDataReqFService: any) {
    this.jsonDataReqFService = jsonDataReqFService;
  }

  //falta hacer el llamado a estos metodos 
  getJsonDataReqService(tipo: string){
    if(tipo=='I'){
      return this.jsonDataReqIService;
    } else if(tipo=='P'){
      return this.jsonDataReqPService;
    } if(tipo=='F'){
      return this.jsonDataReqFService;
    }
  }

  setJsonDataReqService(jsonDataReqService: any, tipo: string) {
    if(tipo=='I'){
      this.jsonDataReqIService = jsonDataReqService;
    } else if(tipo=='P'){
      this.jsonDataReqPService = jsonDataReqService;
    } if(tipo=='F'){
      this.jsonDataReqFService = jsonDataReqService;
    }
  }
}