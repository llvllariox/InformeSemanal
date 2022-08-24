import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlaJsonDataService {
  jsonDataReqService;
  jsonDataReqPE1Service;
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
    this.jsonDataReqPE1Service = jsonDataReqService;
  }

  consolidarArchivos() {
//    this.validaciones();
    this.infoCargada = true;
  }
}
