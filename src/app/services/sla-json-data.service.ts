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
  infoCargada = false;
  ReqAgrupado = [];
  
  constructor() { }

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
    //console.log('PE1');
    //console.log(jsonDataReqService);
    this.jsonDataReqPE1Service = jsonDataReqService;
  }

  getJsonDataReqPE2Service() {
    return this.jsonDataReqPE2Service;
  }

  setjsonDataReqPE2Service(jsonDataReqService: any) {
    //console.log('PE2');
    //console.log(jsonDataReqService);
    this.jsonDataReqPE2Service = jsonDataReqService;
  }

  getJsonDataReqPE3Service() {
    return this.jsonDataReqPE3Service;
  }

  setjsonDataReqPE3Service(jsonDataReqService: any) {
    this.jsonDataReqPE3Service = jsonDataReqService;
  }

  getJsonDataReqPE6Service() {
    return this.jsonDataReqPE6Service;
  }

  setjsonDataReqPE6Service(jsonDataReqService: any) {
    this.jsonDataReqPE6Service = jsonDataReqService;
  }

  consolidarArchivos() {
//    this.validaciones();
    this.infoCargada = true;
  }
}
