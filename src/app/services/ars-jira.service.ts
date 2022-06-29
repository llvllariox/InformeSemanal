import { Injectable } from '@angular/core';
import { arrayBuffer } from 'stream/consumers';

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
    this.AddJiraToReq();
    console.log(this.jsonDataReqService);
    console.log(this.jsonDataJiraService);

  }

  AddJiraToReq() {

    let jirapaso = this.jsonDataJiraService.Sheet0[0];
      jirapaso.proyecto = '',
      jirapaso.tipoDeIncidencia = '',
      jirapaso.clave = '',
      jirapaso.responsable = '',
      jirapaso.estado = '',
      jirapaso.fechaDeInicio = '',
      jirapaso.resumen = '',
      jirapaso.incidenciasEnlazadas = ''

      const jira = jirapaso;
      let i = 0;
   
      for (let req of this.jsonDataReqService.Requerimientos) {
     

      // console.log(jirapaso.estado)
      this.jsonDataReqService.Requerimientos[i] = {...this.jsonDataReqService.Requerimientos[i], jira };
      // console.log(this.jsonDataReqService.Requerimientos[i])
      i++;
    }

    // se agregan JIRA a los requerimientos como un arreglo
    let x = 0;
    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {

      
      for (const  jira of this.jsonDataJiraService.Sheet0) {

        if (req.codigoExterno === jira.clave) {
          this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], jira };
        }
      }
      x++;
    }

  }
}
