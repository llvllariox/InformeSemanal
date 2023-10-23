import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlaJsonDataService {
  jsonDataReqService;
  jsonDataSolService;
 
  fechaInforme: string;
  
  constructor() {
  }

  getFechaInforme() {
    return this.fechaInforme;
  }

  setFechaInforme(fecha: string){
      this.fechaInforme = fecha;
  }
  
  setjsonDataReqService(jsonDataReqService: any) {
    this.jsonDataReqService = jsonDataReqService;
  }

  getJsonDataReqService() {
    return this.jsonDataReqService;
  }

  setjsonDataSolService(jsonDataSolService: any) {
    this.jsonDataSolService = jsonDataSolService;
  }

  getJsonDataSolService() {
    return this.jsonDataSolService;
  }
}