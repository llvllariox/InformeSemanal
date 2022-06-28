import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArsJiraService {

  jsonDataReqService;
  jsonDataJiraService;
  jsonDataHitosService;
  infoCargada = false;
  conFact = true;
  fechaInformes: string;

  constructor() { }

  getJsonDataReqService() {
    return this.jsonDataReqService;
  }

  setjsonDataReqService(jsonDataReqService: any) {
    this.jsonDataReqService = jsonDataReqService;
  }

  getJsonDataJiraService() {
    return this.jsonDataJiraService;
  }

  setjsonDataJiraService(jsonDataJiraService: any) {
    this.jsonDataJiraService = jsonDataJiraService;
  }

  getJsonDataHitosService() {
    return this.jsonDataHitosService;
  }

  setjsonDataHitosService(jsonDataHitosService: any) {
    this.jsonDataHitosService = jsonDataHitosService;
  }

  consolidarArchivos() {

    console.log('ARS-JIRA SERVICE');
    console.log(this.jsonDataReqService);
    console.log(this.jsonDataJiraService);

  }
}
