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
}
