import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DmsJsonDataService {
  jsonDataDmsService;
  fechaInforme: string;

  constructor() { }

  getFechaInforme() {
    return this.fechaInforme;
  }

  setFechaInforme(fecha: string){
      this.fechaInforme = fecha;
  }

  getJsonDataDmsService() {
    return this.jsonDataDmsService;
  }

  setJsonDataDmsService(jsonDataReqService: any){
      this.jsonDataDmsService = jsonDataReqService;
  }
}
