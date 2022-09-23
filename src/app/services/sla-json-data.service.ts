import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlaJsonDataService {
  jsonDataReqService;
  jsonDataReqPE1Service;
  jsonDataReqPE2Service;
  jsonDataReqPE3Service;
  jsonDataReqPE6Service;

  jsonDataReqPM1Service;
  jsonDataReqPM2Service;

  jsonDataReqPI1Service;
  jsonDataReqPI2Service;

  jsonDataReqVaciosProyectoService;
  jsonDataReqVaciosMantenimientoService;

  infoCargada = false;
  ReqAgrupado = [];
  fechaInforme: string;
  
  constructor() { }

  getFechaInforme() {
    return this.fechaInforme;
  }

  setFechaInforme(fecha: string){
      this.fechaInforme = fecha;
  }

  getJsonDataReqService() {
    return this.jsonDataReqService;
  }

  setjsonDataReqService(jsonDataReqService: any) {
    this.jsonDataReqService = jsonDataReqService;
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

  getJsonDataReqPI1Service() {
    return this.jsonDataReqPI1Service;
  }

  setJsonDataReqPI1Service(jsonDataReqService: any) {
    this.jsonDataReqPI1Service = jsonDataReqService;
  }

  getJsonDataReqPI2Service() {
    return this.jsonDataReqPI2Service;
  }

  setJsonDataReqPI2Service(jsonDataReqService: any) {
    this.jsonDataReqPI2Service = jsonDataReqService;
  }

  ;

  getJsonDataReqVaciosProyectoService() {
    return this.jsonDataReqVaciosProyectoService;
  }

  setJsonDataReqVaciosProyectoService(jsonDataReqService: any) {
    this.jsonDataReqVaciosProyectoService = jsonDataReqService;
  }

  getJsonDataReqVaciosMantenimientoService() {
    return this.jsonDataReqVaciosMantenimientoService;
  }

  setJsonDataReqVaciosMantenimientoService(jsonDataReqService: any) {
    this.jsonDataReqVaciosMantenimientoService = jsonDataReqService;
  }

  consolidarArchivos() {
    this.infoCargada = true;
  }
}
