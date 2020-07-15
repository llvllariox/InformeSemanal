import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  jsonDataReqService;
  jsonDataEveService;
  jsonDataTarService;
  jsonDataFacService;
  jsonMasEve;
  infoCargada = false;
  ReqAgrupado = [];
  facAgrupado = [];
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

  getJsonDataFacService() {
    // console.log('get service');
    // console.log(this.jsonDataFacService);
    return this.jsonDataFacService;
  }

  setjsonDataFacService(jsonDataFacService: any) {
    console.log('jsonDataFacService: ', jsonDataFacService);
    this.jsonDataFacService = jsonDataFacService;
  }

  consolidarArchivos() {

    this.AddEveToReq();
    this.AddTarToReq();
    this.facObtieneMA();
    this.facSumarMA();
    this.facAgregarReq();
    this.groupReqOrigen();
    this.eliminarReqOrigen();
    this.eliminarExepcionados();
    this.unirReqconAgrupados();
    this.obtenerFechasQAPROD();
    // this.avanceEsperado();
 
    // this.facObtieneMA();
    // this.facSumarMA();
    // this.facAgregarReq();
    this.infoCargada = true;
    // return true;

  }

  AddEveToReq() {

    let x = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      let i = 0;
      let y = 0;
      let realizado = [];
      let proximo = [];
      let exepcion = false;
      let avanceReal = 0;
      let avanceEsperado = 0;
      for (const  eve of this.jsonDataEveService.Eventos) {
        if (req['Nro. Req.'] == eve['Número de req. o sol.']) {
          if (eve['Tipo de evento'] == 'INF - Actividad Realizada'){
            realizado[i] = eve;
            i++;
          }
          if (eve['Tipo de evento'] == 'INF - Proxima Actividad'){
            proximo[y] = eve;
            y++;
          }
          if (eve['Tipo de evento'] == 'INF - Avance Real'){
            avanceReal = Number(eve['Descripción breve']);
          }
          if (eve['Tipo de evento'] == 'INF - Avance Esperado'){
            avanceEsperado = Number(eve['Descripción breve']);
          }
          if (eve['Tipo de evento'] == 'INF - Exepcion'){
            exepcion = true;
          }

        }
      }
      if (realizado.length > 0) {
        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], realizado };
      }
      if (proximo.length > 0) {
        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], proximo };
      }

      this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], avanceReal, exepcion , avanceEsperado};

      realizado = [];
      proximo = [];
      x++;
    }

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
      // let inicioQA = '';
      // let finQA = '';
      // let inicioProd = '';
      // let finProd = '';

      for (const  tar of this.jsonDataTarService['Detalle Tareas']) {
        if (req['Nro. Req.'] == tar['Número ARS']) {
            if (tar['Descripción Tarea'] == 'Soporte QA') {
              estimadoQA  = tar['Horas Estimadas'];
              incurridoQA  = tar['Horas Incurridas'];
              // inicioQA = tar['Fecha Inicio Planificada'];
              // finQA = tar['Fecha Fin Planificada'];
            }
            // tslint:disable-next-line: max-line-length
            if (tar['Descripción Tarea'] == 'Soporte Post Producción' || tar['Descripción Tarea'] == 'Implementación y Soporte Post Producción' ) {
              estimadoProd  = tar['Horas Estimadas'];
              incurridoProd  = tar['Horas Incurridas'];
              // inicioProd = tar['Fecha Inicio Planificada'];
              // finProd = tar['Fecha Fin Planificada'];
            }
            incluir = true;
            let orden = 0;
            switch (true) {
              case  tar['Descripción Tarea'].includes('Análisis', 0):
                orden = 1;
                break;
              case tar['Descripción Tarea'].includes('Estimación y Plan de Trabajo', 0):
                orden =	2;
                break;
              case tar['Descripción Tarea'].includes('Verificar y Confirmar Estimación', 0):
                orden = 3;
                break;
              case tar['Descripción Tarea'].includes('Planificación', 0):
                // orden = 4;
                incluir = false;
                break;
              case tar['Descripción Tarea'].includes('Análisis y Diseño', 0):
                orden =	5;
                break;
              case tar['Descripción Tarea'].includes('Diseño Detallado', 0):
                orden =	6;
                break;
              case tar['Descripción Tarea'].includes('Construcción y Pruebas Unitarias', 0):
                orden = 7;
                break;
              case tar['Descripción Tarea'].includes('Construcción', 0):
                orden = 8;
                break;
              case tar['Descripción Tarea'].includes('Pruebas Unitarias', 0):
                orden =	9;
                break;
              case tar['Descripción Tarea'].includes('Pruebas Integrales', 0):
                orden =	10;
                break;
              case tar['Descripción Tarea'].includes('Soporte QA', 0):
                orden = 11;
                break;
              case tar['Descripción Tarea'].includes('Implementación y Soporte Post Producción', 0):
                orden =	12;
                break;
              case tar['Descripción Tarea'].includes('Soporte Pase a Producción', 0):
                orden =	13;
                break;
              case tar['Descripción Tarea'].includes('Soporte Post Producción', 0):
                orden = 14;
                break;
              case tar['Descripción Tarea'].includes('Supervisión', 0):
                orden = 15;
                incluir = false;
                break;
              default:
                orden = 99;
                incluir = false;
                break;
            }
            // switch (tar['Descripción Tarea']) {
            //   case 'Análisis':
            //     orden = 1;
            //     break;
            //   case 'Estimación y Plan de Trabajo':
            //     orden =	2;
            //     break;
            //   case 'Verificar y Confirmar Estimación':
            //     orden = 3;
            //     break;
            //   case 'Planificación':
            //     // orden = 4;
            //     incluir = false;
            //     break;
            //   case 'Análisis y Diseño':
            //     orden =	5;
            //     break;
            //   case 'Diseño Detallado':
            //     orden =	6;
            //     break;
            //   case 'Construcción y Pruebas Unitarias':
            //     orden = 7;
            //     break;
            //   case 'Construcción':
            //     orden = 8;
            //     break;
            //   case 'Pruebas Unitarias':
            //     orden =	9;
            //     break;
            //   case 'Pruebas Integrales':
            //     orden =	10;
            //     break;
            //   case 'Soporte QA':
            //     orden = 11;
            //     break;
            //   case 'Implementación y Soporte Post Producción':
            //     orden =	12;
            //     break;
            //   case 'Soporte Pase a Producción':
            //     orden =	13;
            //     break;
            //   case 'Soporte Post Producción':
            //     orden = 14;
            //     break;
            //   case 'Supervisión':
            //     orden = 15;
            //     incluir = false;
            //     break;
            //   // default:
            //   //   orden = 99;
            //   //   incluir = false;
            //   //   break;
            // }
            if (incluir) {
              tareas[i] = {...tar, orden};
              i++;
            }
        }
      }
      // tslint:disable-next-line: max-line-length
      this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], estimadoQA, incurridoQA, estimadoProd, incurridoProd};
      // tslint:disable-next-line: max-line-length
      // this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], estimadoQA, incurridoQA, estimadoProd, incurridoProd,inicioQA, finQA, inicioProd,finProd};
      if (tareas.length > 0) {

        
        // ordernar Array
        tareas.sort((a, b) => {


          //Funciona!!
          // let fechaIntA = Date.parse(a['Fecha Inicio Planificada']);
          // let tamanoA = fechaIntA.toString().length;
          // let decimalA = fechaIntA / (10 ** Number(tamanoA));
          // let keyA;

          // let fechaIntB = Date.parse(b['Fecha Inicio Planificada']);
          // let tamanoB = fechaIntB.toString().length;
          // let decimalB = fechaIntB / (10 ** Number(tamanoB));
          // let keyB;

          // if (fechaIntA == -2209058280000) {
          //   keyA = a.orden;
          // } else {
          //   keyA = a.orden + decimalA;
          // }

          // if (fechaIntB == -2209058280000) {
          //   keyB = b.orden;
          // } else {
          //   keyB = b.orden + decimalB;
          // }

          // return keyA - keyB;

        let fechaIntA = Date.parse(a['Fecha Inicio Planificada']);
        let keyA=0;
        let fechaIntB = Date.parse(b['Fecha Inicio Planificada']);
        let keyB=0;

        if (fechaIntA == -2209058280000) {
          keyA = (Date.parse('Sun Dec 31 2050 00:00:00 GMT-0442 (hora de verano de Chile)' ) - 20) + a.orden;
        } else {
          keyA = fechaIntA;
        }

        if (fechaIntB == -2209058280000) {
          keyB =  (Date.parse('Sun Dec 31 2050 00:00:00 GMT-0442 (hora de verano de Chile)' ) - 20) + b.orden;
        } else {
          keyB = fechaIntB;
        }

        if(Number(a['Número ARS'])== 2220){
          console.log(a['Descripción Tarea']);
          console.log(a['Fecha Inicio Planificada']);
          console.log(fechaIntA);
          console.log(keyA);
        }

        return keyA - keyB;
        //   // return concatA.localeCompare(concatB);
        });
        // tareas.sort((a, b) => {
        //   return a.orden - b.orden;
        // });
        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], tareas };

      }

      estimadoQA = 0;
      incurridoQA = 0;
      estimadoProd = 0;
      incurridoProd = 0;
      tareas = [];
      x++;
    }
  }

  groupReqOrigen() {

    let x = 0;
    let Reqpadre = [];
    let ultEtapa = '';
    let ultLD = '';
    let ultPM = '';
    let ultCECO = '';
    let ultTareas = [];
    // ordenar por ReqOrigen
    this.jsonDataReqService.Requerimientos.sort((a, b) => {
      return a['Req. Origen'] - b['Req. Origen'];
    });
    for (let req of this.jsonDataReqService.Requerimientos) {

      if (req['Req. Origen'] !== ' ') {
        if (req['Req. Origen'] !== Reqpadre['Req. Origen']){
          if (Reqpadre) {

            Reqpadre['Etapa'] = ultEtapa || Reqpadre['Etapa'];
            Reqpadre['Solicitante'] = ultLD|| Reqpadre['Solicitante'];
            Reqpadre['Origen'] = ultPM|| Reqpadre['Origen'];
            Reqpadre['Código Externo'] = ultCECO|| Reqpadre['Código Externo'];
            if (ultTareas.length > 0) {
              Reqpadre['tareas'] = ultTareas;
            }

            this.ReqAgrupado.push(Reqpadre);
            ultEtapa = '';
            ultLD = '';
            ultPM = '';
            ultCECO = '';
            ultTareas = [];
          }
          Reqpadre = req;
        } else {
          Reqpadre['Descripción'] = `${Reqpadre['Descripción']} - MA0${req['Nro. Req.']}`;
          Reqpadre['Horas Estimadas'] = Number(Reqpadre['Horas Estimadas']) + Number(req['Horas Estimadas']);
          Reqpadre['Horas Planificadas'] = Number(Reqpadre['Horas Planificadas']) + Number(req['Horas Planificadas']);
          Reqpadre['Horas Incurridas'] = Number(Reqpadre['Horas Incurridas']) + Number(req['Horas Incurridas']);
          Reqpadre['estimadoQA'] = Number(Reqpadre['estimadoQA']) + Number(req['estimadoQA']);
          Reqpadre['incurridoQA'] = Number(Reqpadre['incurridoQA']) + Number(req['incurridoQA']);
          Reqpadre['estimadoProd'] = Number(Reqpadre['estimadoProd']) + Number(req['estimadoProd']);
          Reqpadre['incurridoProd'] = Number(Reqpadre['incurridoProd']) + Number(req['incurridoProd']);
          Reqpadre['horasFact'] = Number(Reqpadre['horasFact']) + Number(req['horasFact']);

          ultEtapa = req['Etapa'];
          ultLD = req['Solicitante'];
          ultPM = req['Origen'];
          ultCECO = req['Código Externo'];
          ultTareas = req['tareas']||[];

        }

      }

    }


  }

  eliminarReqOrigen() {

   let i = 0;
   for (let req of this.jsonDataReqService.Requerimientos) {

      if (req['Req. Origen'] !== ' ') {
        this.jsonDataReqService.Requerimientos.splice(i, 1);
      }
      i++;
   }
  }

  eliminarExepcionados() {

   let i = 0;
   for (let req of this.jsonDataReqService.Requerimientos) {

      if (req.exepcion) {
        this.jsonDataReqService.Requerimientos.splice(i, 1);
      }
      i++;
   }
  }

  unirReqconAgrupados() {
    let tamaño = this.jsonDataReqService.Requerimientos.length;
    this.jsonDataReqService.Requerimientos = this.jsonDataReqService.Requerimientos.concat(this.ReqAgrupado);
    this.jsonDataReqService.Requerimientos.splice(tamaño, 1);

  }

  obtenerFechasQAPROD() {

    let i = 0;
    let inicioQA = null;
    let finQA = null;
    let inicioProd = null;
    let finProd = null;

    for (let req of this.jsonDataReqService.Requerimientos) {
      if (req.tareas !== undefined){
        for (const  tar of req.tareas) {
          if (tar['Descripción Tarea'] == 'Soporte QA') {

            inicioQA = tar['Fecha Inicio Planificada'];
            finQA = tar['Fecha Fin Planificada'];
          }
          // tslint:disable-next-line: max-line-length
          if (tar['Descripción Tarea'] == 'Soporte Post Producción' || tar['Descripción Tarea'] == 'Implementación y Soporte Post Producción' ) {
            inicioProd = tar['Fecha Inicio Planificada'];
            finProd = tar['Fecha Fin Planificada'];
          }
          // x++;
        }
        this.jsonDataReqService.Requerimientos[i] = {...this.jsonDataReqService.Requerimientos[i], inicioQA, finQA, inicioProd, finProd};
        inicioQA = null;
        finQA = null;
        inicioProd  = null;
        finProd  = null;
      }
      i++;
    }
    console.log('----Finanl + Facturado + QAyPROD----');
    console.log(this.jsonDataReqService.Requerimientos);
  }


  avanceEsperado(){
    // let hoy = new Date();
    // let esperado = 0;
    // for (let req of this.jsonDataReqService.Requerimientos) {
    //   for (let tarea of this.jsonDataReqService.Requerimientos.tareas) {
    //       if(tarea[])
    //   }
    // }
  }


  facObtieneMA() {
    let MA = '';
    let i = 0;
    for (let fac of this.jsonDataFacService['Datos Facturación']) {
      MA = fac['Nombre Requerimiento'].substr(0,7);
      // tslint:disable-next-line: max-line-length
      this.jsonDataFacService['Datos Facturación'][i] = {...this.jsonDataFacService['Datos Facturación'][i], MA};
      i++;
    }

    this.jsonDataFacService['Datos Facturación'].sort((a, b) => {
      return a.MA.localeCompare(b.MA);
    });


  }

  facSumarMA() {

    let x = 0;
    let facpadre = [];

    for (let fac of this.jsonDataFacService['Datos Facturación']) {

      if (fac['MA'] !== facpadre['MA']){
        if (facpadre) {

          this.facAgrupado.push(facpadre);
          facpadre = [];
        }
        facpadre = fac;
      } else {
        facpadre['HH Incurridas'] = Number(facpadre['HH Incurridas']) + Number(fac['HH Incurridas']);
      }

    }
  }

  facAgregarReq(){
    this.facAgrupado.splice(0, 1);
    let i = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      for (const fac of this.facAgrupado) {
        if (req['Nro. Req.'] ==  Number(fac['MA'].substr(2,5))) {
          let horasFact = fac['HH Incurridas'];
          this.jsonDataReqService.Requerimientos[i] = {...this.jsonDataReqService.Requerimientos[i], horasFact};
        }

      }
      i++;
    }

  }
}
