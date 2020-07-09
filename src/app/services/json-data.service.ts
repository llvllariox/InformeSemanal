import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  jsonDataReqService;
  jsonDataEveService;
  jsonDataTarService;
  jsonMasEve;
  infoCargada = false;
  ReqAgrupado = [];
  constructor() {

   }

  getJsonDataReqService() {
    // console.log('get service');
    // console.log(this.jsonDataReqService);
    return this.jsonDataReqService;
  }

  setjsonDataReqService(jsonDataReqService: any) {
    console.log('----Original----');
    console.log('jsonDataReqService: ', jsonDataReqService);
    this.jsonDataReqService = jsonDataReqService;
  }

  getJsonDataEveService() {
    // console.log('get service');
    // console.log(this.jsonDataEveService);
    return this.jsonDataEveService;
  }

  setjsonDataEveService(jsonDataEveService: any) {
    // console.log('jsonDataEveService: ', jsonDataEveService);
    this.jsonDataEveService = jsonDataEveService;
  }

  getJsonDataTarService() {
    // console.log('get service');
    // console.log(this.jsonDataTarService);
    return this.jsonDataTarService;
  }

  setjsonDataTarService(jsonDataTarService: any) {
    // console.log('jsonDataTarService: ', jsonDataTarService);
    this.jsonDataTarService = jsonDataTarService;
  }

  consolidarArchivos() {

    this.AddEveToReq();
    this.AddTarToReq();
    this.groupReqOrigen();
    // this.eliminarReqOrigen();
    // this.unirReqconAgrupados();
    this.infoCargada = true;
    // return true;

  }

  AddEveToReq() {

    let x = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      let i = 0;
      let realizado = [];
      let proximo = [];
      let exepcion = false;
      let avanceReal = 0;
      for (const  eve of this.jsonDataEveService.Eventos) {
        if (req['Nro. Req.'] == eve['Número de req. o sol.']) {
          if (eve['Tipo de evento'] == 'INF - Actividad Realizada'){
            realizado[i] = eve;
          }
          if (eve['Tipo de evento'] == 'INF - Proxima Actividad'){
            proximo[i] = eve;
          }
          if (eve['Tipo de evento'] == 'INF - Avance Real'){
            avanceReal = Number(eve['Descripción breve']);
          }
          if (eve['Tipo de evento'] == 'INF - Exepcion'){
            exepcion = true;
          }

          i++;
        }
      }
      if (realizado.length > 0) {
        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], realizado };
      }
      if (proximo.length > 0) {
        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], proximo };
      }

      this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], avanceReal, exepcion };

      realizado = [];
      proximo = [];
      x++;
    }

    // console.log('----AddEveToReq---');
    // console.log(this.jsonDataReqService.Requerimientos);

  }

  AddTarToReq() {

    let x = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      let i = 0;
      let estimadoQA = 0;
      let incurridoQA = 0;
      let estimadoProd = 0;
      let incurridoProd = 0;
      let tareas = [];
      let incluir = true;

      for (const  tar of this.jsonDataTarService['Detalle Tareas']) {
        if (req['Nro. Req.'] == tar['Número ARS']) {
            if (tar['Descripción Tarea'] == 'Soporte QA') {
              estimadoQA  = tar['Horas Estimadas'];
              incurridoQA  = tar['Horas Incurridas'];
            }
            // tslint:disable-next-line: max-line-length
            if (tar['Descripción Tarea'] == 'Soporte Post Producción' || tar['Descripción Tarea'] == 'Implementación y Soporte Post Producción' ) {
              estimadoProd  = tar['Horas Estimadas'];
              incurridoProd  = tar['Horas Incurridas'];
            }
            incluir = true;
            let orden = 0;
            switch (tar['Descripción Tarea']) {
              case 'Análisis':
                orden = 10;
                break;
              case 'Planificación':
                // orden = 20;
                incluir = false;
                break;
              case 'Análisis y Diseño':
                orden =	30;
                break;
              case 'Construcción y Pruebas Unitarias':
                orden = 40;
                break;
              case 'Pruebas Integrales':
                orden =	50;
                break;
              case 'Implementación y Soporte Post Producción':
                orden =	70;
                break;
              case 'Soporte Pase a Producción':
                orden =	80;
                break;
              case 'Supervisión':
                // orden =	9;
                incluir = false;
                break;
              case 'Estimación y Plan de Trabajo':
                orden =	8;
                break;
              case 'Diseño Detallado':
                orden =	110;
                break;
              case 'Construcción':
                orden = 120;
                break;
              case 'Pruebas Unitarias':
                orden =	130;
                break;
              case 'Soporte QA':
                orden = 60;
                break;
              case 'Soporte Post Producción':
                orden = 150;
                break;
              case 'Verificar y Confirmar Estimación':
                orden = 9;
                break;
            }
            if (incluir) {
              tareas[i] = {...tar, orden};
              i++;
            }
        }
      }
      // tslint:disable-next-line: max-line-length
      this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], estimadoQA, incurridoQA, estimadoProd, incurridoProd};
      // console.log('----AddTarToReq-ant--');
      // console.log(this.jsonDataReqService.Requerimientos);
      if (tareas.length > 0) {
        // ordernar Array
        tareas.sort((a, b) => {
          return a.orden - b.orden;
        });
        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], tareas };

      }


      estimadoQA = 0;
      incurridoQA = 0;
      estimadoProd = 0;
      incurridoProd = 0;
      tareas = [];
      x++;
    }
    // console.log('----AddTarToReq---');
    // console.log(this.jsonDataReqService.Requerimientos);
  }

  groupReqOrigen() {

    let x = 0;
    let Reqpadre = [];
    let ultEtapa = '';
    let ultLD = '';
    let ultPM = '';
    let ultCECO = '';
    let ultTareas = [];
    // let ReqAgrupado = [];

    // ordenar por ReqOrigen
    this.jsonDataReqService.Requerimientos.sort((a, b) => {
      return a['Req. Origen'] - b['Req. Origen'];
    });
    // console.log('---groupReqOrigen----');
    // console.log(this.jsonDataReqService.Requerimientos);
    // return;
    //  HASTA ACA VA BIEN
    for (let req of this.jsonDataReqService.Requerimientos) {

      if (req['Req. Origen'] !== ' ') {
        if (req['Req. Origen'] !== Reqpadre['Req. Origen']){
          // console.log(Reqpadre.length);
          if (Reqpadre) {

            Reqpadre['Etapa'] = ultEtapa || Reqpadre['Etapa'];
            Reqpadre['Solicitante'] = ultLD|| Reqpadre['Solicitante'];
            Reqpadre['Origen'] = ultPM|| Reqpadre['Origen'];
            Reqpadre['Código Externo'] = ultCECO|| Reqpadre['Código Externo'];
            // if(ultTareas !== []){
            //   Reqpadre['tareas'] = ultTareas;
            // }
            // console.log(ultTareas);
            if (ultTareas === []) {
              Reqpadre['tareas'] = ultTareas;
            }
            // Reqpadre['tareas'] = ultTareas|| Reqpadre['tareas'];

            this.ReqAgrupado.push(Reqpadre);
            ultEtapa = '';
            ultLD = '';
            ultPM = '';
            ultCECO = '';
            ultTareas = [];
            // console.log('push');
          }
          Reqpadre = req;
        } else {
          // Reqpadre['Descripción'] = Reqpadre['Descripción'] + (req['Nro. Req.']);
          Reqpadre['Descripción'] = `${Reqpadre['Descripción']} - MA0${req['Nro. Req.']}`;
          Reqpadre['Horas Estimadas'] = Number(Reqpadre['Horas Estimadas']) + Number(req['Horas Estimadas']);
          Reqpadre['Horas Planificadas'] = Number(Reqpadre['Horas Planificadas']) + Number(req['Horas Planificadas']);
          Reqpadre['Horas Incurridas'] = Number(Reqpadre['Horas Incurridas']) + Number(req['Horas Incurridas']);
          Reqpadre['estimadoQA'] = Number(Reqpadre['estimadoQA']) + Number(req['estimadoQA']);
          Reqpadre['incurridoQA'] = Number(Reqpadre['incurridoQA']) + Number(req['incurridoQA']);
          Reqpadre['estimadoProd'] = Number(Reqpadre['estimadoProd']) + Number(req['estimadoProd']);
          Reqpadre['incurridoProd'] = Number(Reqpadre['incurridoProd']) + Number(req['incurridoProd']);

          ultEtapa = req['Etapa'];
          ultLD = req['Solicitante'];
          ultPM = req['Origen'];
          ultCECO = req['Código Externo'];
          ultTareas = req['tareas'];

        }

      }

    }
    // console.log(Reqpadre);
    // console.log('Agrupados');
    // console.log(this.ReqAgrupado);


  }

  eliminarReqOrigen() {

   let i = 0;
   for (let req of this.jsonDataReqService.Requerimientos) {

      if (req['Req. Origen'] !== ' ') {
        // console.log('delete', this.jsonDataReqService.Requerimientos[i]);
        this.jsonDataReqService.Requerimientos.splice(i, 1);
      }
      i++;
   }
  //  console.log('---Limpio sin req origen----');
  //  console.log(this.jsonDataReqService.Requerimientos);
  //  console.log(this.jsonDataReqService.Requerimientos.length);
  }

  unirReqconAgrupados() {
    let tamaño = this.jsonDataReqService.Requerimientos.length;
    this.jsonDataReqService.Requerimientos = this.jsonDataReqService.Requerimientos.concat(this.ReqAgrupado);
    this.jsonDataReqService.Requerimientos.splice(tamaño, 1);
    console.log('---Final Unidos----');
    console.log(this.jsonDataReqService.Requerimientos);
    // console.log(this.jsonDataReqService.Requerimientos.length);
  }

}
