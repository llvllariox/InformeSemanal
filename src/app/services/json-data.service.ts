import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  jsonDataReqService;
  jsonDataEveService;
  jsonDataTarService;
  jsonMasEve;

  constructor() { }

  getJsonDataReqService() {
    console.log('get service');
    console.log(this.jsonDataReqService);
    return this.jsonDataReqService;
  }

  setjsonDataReqService(jsonDataReqService: any) {
    console.log('jsonDataReqService: ', jsonDataReqService);
    this.jsonDataReqService = jsonDataReqService;
  }

  getJsonDataEveService() {
    console.log('get service');
    console.log(this.jsonDataEveService);
    return this.jsonDataEveService;
  }

  setjsonDataEveService(jsonDataEveService: any) {
    console.log('jsonDataEveService: ', jsonDataEveService);
    this.jsonDataEveService = jsonDataEveService;
  }

  getJsonDataTarService() {
    console.log('get service');
    console.log(this.jsonDataTarService);
    return this.jsonDataTarService;
  }

  setjsonDataTarService(jsonDataTarService: any) {
    console.log('jsonDataTarService: ', jsonDataTarService);
    this.jsonDataTarService = jsonDataTarService;
  }

  consolidarArchivos() {

    this.AddEveToReq();
    this.AddTarToReq();

  }

  AddEveToReq() {

    // console.log('AddEveToReq');
    let x = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      let i = 0;
      let eventos = [];
      for (const  eve of this.jsonDataEveService.Eventos) {
        if (req['Nro. Req.'] == eve['Número de req. o sol.']) {

          eventos[i] = eve;
          i++;
        }
      }
      if (eventos.length > 0) {
        // console.log(eventos);
        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], eventos };
      }
      eventos = [];
      x++;
    }
    // console.log(this.jsonDataReqService.Requerimientos);
  }

  AddTarToReq() {

    // console.log('AddTarToReq');
    let x = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      let i = 0;
      let estimadoQA = 0;
      let incurridoQA = 0;
      let fechaIniQA = null;
      let fechaFinQA = null;

      for (const  tar of this.jsonDataTarService['Detalle Tareas']) {
        if (req['Nro. Req.'] == tar['Número ARS']) {
            if (tar['Descripción Tarea'] == 'Soporte QA') {
              estimadoQA  = tar['Horas Estimadas'];
              incurridoQA  = tar['Horas Incurridas'];
              fechaIniQA = tar['Fecha Inicio Planificada'];
              fechaFinQA = tar['Fecha Fin Planificada'];
            }
          // tareas[i] = tar;
          i++;
        }
      }
      // tslint:disable-next-line: max-line-length
      this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], estimadoQA, incurridoQA , fechaIniQA, fechaFinQA};
      estimadoQA = 0;
      incurridoQA = 0;
      fechaIniQA = null;
      fechaFinQA = null;
      x++;
    }
    console.log(this.jsonDataReqService.Requerimientos);
  }
}
