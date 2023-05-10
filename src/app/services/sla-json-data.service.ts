import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlaJsonDataService {
  jsonDataReqPE1Service;
  jsonDataReqPE2Service;
  jsonDataReqPE3Service;
  jsonDataReqPE6Service;

  jsonDataReqPM1Service;
  jsonDataReqPM2Service;

  jsonDataSolPI1Service;
  jsonDataSolPI2Service;

  fechaInforme: string;
  
  constructor() {
   }

  getFechaInforme() {
    return this.fechaInforme;
  }

  setFechaInforme(fecha: string){
      this.fechaInforme = fecha;
  }
  
  getJsonDataReqPE1Service() {
    return this.jsonDataReqPE1Service;
  }

  setjsonDataReqPE1Service(jsonDataReqService: any) {
    this.jsonDataReqPE1Service = jsonDataReqService;
  }

  getJsonDataReqPE2Service() {
    return this.jsonDataReqPE2Service;
  }

  setjsonDataReqPE2Service(jsonDataReqService: any) {
    this.jsonDataReqPE2Service = jsonDataReqService;
  }

  getJsonDataReqPE3Service() {
    return this.jsonDataReqPE3Service;
  }

  setJsonDataReqPE3Service(jsonDataReqService: any) {
    this.jsonDataReqPE3Service = jsonDataReqService;
  }

  getJsonDataReqPE6Service() {
    return this.jsonDataReqPE6Service;
  }

  setJsonDataReqPE6Service(jsonDataReqService: any) {
    this.jsonDataReqPE6Service = jsonDataReqService;
  }

  getJsonDataReqPM1Service() {
    return this.jsonDataReqPM1Service;
  }

  setJsonDataReqPM1Service(jsonDataReqService: any) {
    this.jsonDataReqPM1Service = jsonDataReqService;
  }
  
  getJsonDataReqPM2Service() {
    return this.jsonDataReqPM2Service;
  }

  setJsonDataReqPM2Service(jsonDataReqService: any) {
    this.jsonDataReqPM2Service = jsonDataReqService;
  }

  getJsonDataSolPI1Service() {
    return this.jsonDataSolPI1Service;
  }

  setJsonDataSolPI1Service(jsonDataSolService: any) {
    this.jsonDataSolPI1Service = jsonDataSolService;
  }

  getJsonDataSolPI2Service() {
    return this.jsonDataSolPI2Service;
  }

  setJsonDataSolPI2Service(jsonDataSolService: any) {
    this.jsonDataSolPI2Service = jsonDataSolService;
  }
}