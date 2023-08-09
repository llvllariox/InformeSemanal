import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MywizardRvJsonDataService {
  fechaInforme: string;

  jsonDataReqAbiertosService;
  jsonDataReqCerradosService;

  jsonDataSolAbiertosService;
  jsonDataSolCerradosService;

  jsonDataCancelacionesAbiertosService;
  jsonDataCancelacionesCerradosService;

  jsonDataHorasService;

  constructor() { }

  getFechaInforme() {
    return this.fechaInforme;
  }

  setFechaInforme(fecha: string){
    this.fechaInforme = fecha;
  }


  getJsonDataReqAbiertosService() {
    return this.jsonDataReqAbiertosService;
  }

  setJsonDataReqAbiertosService(jsonDataReqAbiertosService: any) {
    this.jsonDataReqAbiertosService = jsonDataReqAbiertosService;
  }


  getJsonDataReqCerradosService() {
    return this.jsonDataReqCerradosService;
  }

  setJsonDataReqCerradosService(jsonDataReqCerradosService: any) {
    this.jsonDataReqCerradosService = jsonDataReqCerradosService;
  }




  getJsonDataSolCerradosService() {
    return this.jsonDataSolCerradosService;
  }

  setJsonDataSolCerradosService(jsonDataSolCerradosService: any) {
    this.jsonDataSolCerradosService = jsonDataSolCerradosService;
  }


  getJsonDataSolAbiertosService() {
    return this.jsonDataSolAbiertosService;
  }

  setJsonDataSolAbiertosService(jsonDataSolAbiertosService: any) {
    this.jsonDataSolAbiertosService = jsonDataSolAbiertosService;
  }


  getJsonDataHorasService() {
    return this.jsonDataHorasService;
  }

  setJsonDataHorasService(jsonDataHorasService: any) {
    this.jsonDataHorasService = jsonDataHorasService;
  }


  //cancelaciones
  getJsonDataCancelacionesAbiertosService() {
    return this.jsonDataCancelacionesAbiertosService;
  }

  setJsonDataCancelacionesAbiertosService(jsonData: any) {
    this.jsonDataCancelacionesAbiertosService = jsonData;
  }

  getJsonDataCancelacionesCerradosService() {
    return this.jsonDataCancelacionesCerradosService;
  }

  setJsonDataCancelacionesCerradosService(jsonData: any) {
    this.jsonDataCancelacionesCerradosService = jsonData;
  }

}
