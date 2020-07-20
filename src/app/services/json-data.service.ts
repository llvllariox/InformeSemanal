import { Injectable } from '@angular/core';
import * as moment from 'moment';

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
  tablaFac = [];
  constructor() {

   }

  getJsonDataReqService() {
    return this.jsonDataReqService;
  }

  setjsonDataReqService(jsonDataReqService: any) {
    this.jsonDataReqService = jsonDataReqService;
  }

  getJsonDataEveService() {
    return this.jsonDataEveService;
  }

  setjsonDataEveService(jsonDataEveService: any) {
    this.jsonDataEveService = jsonDataEveService;
  }

  getJsonDataTarService() {
    return this.jsonDataTarService;
  }

  setjsonDataTarService(jsonDataTarService: any) {
    this.jsonDataTarService = jsonDataTarService;
  }

  getJsonDataFacService() {
    return this.jsonDataFacService;
  }

  setjsonDataFacService(jsonDataFacService: any) {
    this.jsonDataFacService = jsonDataFacService;
  }

  consolidarArchivos() {
    this.crearTablaFac();
    return;
    this.AddEveToReq();
    this.eliminarExepcionados();
    this.AddTarToReq();
    // console.log(this.jsonDataReqService.Requerimientos);
    // return;
    this.facObtieneMA();
    // console.log(this.jsonDataFacService['Datos Facturación']);
    // return;
    this.crearHorasFact();
    this.facSumarMA();
    this.facAgregarReq();
    this.groupReqOrigen();
    
    // return;
    this.eliminarReqOrigen();
    // this.eliminarExepcionados();
    this.unirReqconAgrupados();
    this.obtenerFechasQAPROD();
    this.ordenFinalARS();

    // this.crearTablaFac();
    this.infoCargada = true;

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

      for (const  tar of this.jsonDataTarService['Detalle Tareas']) {
        if (req['Nro. Req.'] == tar['Número ARS']) {
            // if (tar['Descripción Tarea'] == 'Soporte QA') {
            if (tar['Descripción Tarea'].includes('Soporte QA', 0)) {
              estimadoQA  = estimadoQA + tar['Horas Estimadas'];
              incurridoQA  = incurridoQA + tar['Horas Incurridas'];
              // estimadoQA  = tar['Horas Estimadas'];
              // incurridoQA  = tar['Horas Incurridas'];
            }
            // tslint:disable-next-line: max-line-length
            // if (tar['Descripción Tarea'] == 'Soporte Post Producción' || tar['Descripción Tarea'] == 'Implementación y Soporte Post Producción' ) {
            if (tar['Descripción Tarea'].includes('Implementación y Soporte Post Producción', 0) ||
                tar['Descripción Tarea'].includes('Soporte Pase a Producción', 0) ||
                tar['Descripción Tarea'].includes('Soporte Post Producción', 0) ) {
              // estimadoProd  = tar['Horas Estimadas'];
              // incurridoProd  = tar['Horas Incurridas'];
              estimadoProd  = estimadoProd + tar['Horas Estimadas'];
              incurridoProd  = incurridoProd  + tar['Horas Incurridas'];
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
            if (incluir) {
              tareas[i] = {...tar, orden};
              i++;
            }
        }
      }
      // tslint:disable-next-line: max-line-length
      this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], estimadoQA, incurridoQA, estimadoProd, incurridoProd};
      if (tareas.length > 0) {
        tareas.sort((a, b) => {

          let fechaIntA = Date.parse(a['Fecha Inicio Planificada']);
          let keyA = 0;
          let fechaIntB = Date.parse(b['Fecha Inicio Planificada']);
          let keyB = 0;

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

          return keyA - keyB;
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
  }
  crearHorasFact(){

    for (let req of this.jsonDataReqService.Requerimientos) {
      req['horasFact'] = 0;
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

    this.jsonDataReqService.Requerimientos.sort((a, b) => {

      let keyA = 0;
      let keyB = 0;

      if (a['Req. Origen'] == ' ') {
        keyA = a['Nro. Req.'];
      } else {
        keyA = a['Req. Origen'];
      }

      if (b['Req. Origen'] == ' ') {
        keyB = b['Nro. Req.'];
      } else {
        keyB = b['Req. Origen'];
      }

      // console.log(a['Req. Origen']);
      // console.log(b['Req. Origen']);
      return keyA - keyB;
      // return a['Req. Origen'] - b['Req. Origen'];
    });
    // console.log('pegando req origen');
    // console.log(this.jsonDataReqService.Requerimientos);
    // return;

    for (let req of this.jsonDataReqService.Requerimientos) {

      if (req['Req. Origen'] == ' ' || req['Req. Origen']==undefined) {
        req['Req. Origen'] = req['Nro. Req.'];
        // console.log('Reemplzada reqOrigen');
        // console.log('Req. Origen',req['Req. Origen']);
        // console.log('Nro. Req',req['Nro. Req.']);
      }

      if (req['Req. Origen'] !== ' ') {
        if (req['Req. Origen'] !== Reqpadre['Req. Origen']){
          if (Reqpadre) {

            Reqpadre['Etapa'] = ultEtapa || Reqpadre['Etapa'];
            Reqpadre['Solicitante'] = ultLD|| Reqpadre['Solicitante'];
            Reqpadre['Origen'] = ultPM|| Reqpadre['Origen'];
            Reqpadre['Código Externo'] = ultCECO|| Reqpadre['Código Externo'];
            Reqpadre['Req. Origen'] = ' ';
            if (ultTareas.length > 0) {
              Reqpadre['tareas'] = ultTareas;
            }

            this.ReqAgrupado.push(Reqpadre);
            // console.log(Reqpadre);
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

          // if(Reqpadre['horasFact'] == undefined){
          //   Reqpadre['horasFact'] = 0;
          // }
          // if(req['horasFact'] == undefined){
          //   Reqpadre['horasFact'] = 0;
          // }
          // if(isNaN(Reqpadre['horasFact'])){
          //   Reqpadre['horasFact'] = 0;
          // }
          // if(isNaN(req['horasFact'])){
          //   Reqpadre['horasFact'] = 0;
          // }

          Reqpadre['horasFact'] = Number(Reqpadre['horasFact']) + Number(req['horasFact']);

          ultEtapa = req['Etapa'];
          ultLD = req['Solicitante'];
          ultPM = req['Origen'];
          ultCECO = req['Código Externo'];
          ultTareas = req['tareas'] || [];
        }
      }
    }
  }

  eliminarReqOrigen() {
  //  console.log(this.jsonDataReqService.Requerimientos);
  //  return;

  //  this.jsonDataReqService.Requerimientos.filter(data=>{
  //      data['Req. Origen'].toString().length > 1;
  //  });

  //  let i = 0;
   for (let i = 0; i < this.jsonDataReqService.Requerimientos.length;) {

    let req = this.jsonDataReqService.Requerimientos[i];
    let reqOrigen = req['Req. Origen'].toString();
    // console.log(reqOrigen.length);
    if (reqOrigen.length > 1) {
      // console.log(reqOrigen);
      // console.log(req['Nro. Req.'], 'Delete');
      this.jsonDataReqService.Requerimientos.splice(i, 1);
      // i--;
      reqOrigen = '';
    } else {
      i++;
    }

   }

  //  for (let req of this.jsonDataReqService.Requerimientos) {

  //     // if()
  //     // if (req['Req. Origen'] == 1116) {
  //     // console.log(req['Nro. Req.']);
  //     // let reqOrigen = req['Req. Origen'].toString();
  //     // // console.log(reqOrigen.length);
  //     // if (reqOrigen.length > 1) {
  //     //   // console.log(reqOrigen);
  //     //   console.log(req['Nro. Req.'], 'Delete');
  //     //   this.jsonDataReqService.Requerimientos.splice(i, 0);
  //     //   // i--;
  //     //   reqOrigen = '';
  //     // } else {
  //     //   i++;
  //     // }

  //     // console.log(req['Req. Origen']);
  //     // }
  //     // if (req['Req. Origen'] != '' && req['Req. Origen'] != ' ') {
  //     //   // console.log(req['Nro. Req.'], 'Delete');
  //     //   this.jsonDataReqService.Requerimientos.splice(i, 1);
  //     // }
      
  //  }
  //  console.log('eliminados');
  //  console.log(this.jsonDataReqService.Requerimientos);
  }

  eliminarExepcionados() {

  //  let i = 0;
  //  for (let req of this.jsonDataReqService.Requerimientos) {

  //     if (req.exepcion) {
  //       this.jsonDataReqService.Requerimientos.splice(i, 1);
  //     }
  //     i++;
  //  }

  for (let i = 0; i < this.jsonDataReqService.Requerimientos.length;) {

      let req = this.jsonDataReqService.Requerimientos[i];
      // let reqOrigen = req['Req. Origen'].toString();
      // console.log(reqOrigen.length);
      if (req.exepcion) {
        // console.log(reqOrigen);
        // console.log(req['Nro. Req.'], 'Delete');
        this.jsonDataReqService.Requerimientos.splice(i, 1);
        // i--;
      } else {
        i++;
      }
    }
  }
  unirReqconAgrupados() {
    // console.log('agrupados');
    // console.log(this.ReqAgrupado);
    let tamaño = this.jsonDataReqService.Requerimientos.length;
    this.jsonDataReqService.Requerimientos.concat(this.ReqAgrupado);
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
        }
        this.jsonDataReqService.Requerimientos[i] = {...this.jsonDataReqService.Requerimientos[i], inicioQA, finQA, inicioProd, finProd};
        inicioQA = null;
        finQA = null;
        inicioProd  = null;
        finProd  = null;
      }
      i++;
    }
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
          // console.log(facpadre);
          facpadre = [];
        }
        facpadre = fac;
      } else {
        facpadre['HH Incurridas'] = Number(facpadre['HH Incurridas']) + Number(fac['HH Incurridas']);
      }

    }

    // console.log('facAgrupado', this.facAgrupado);
  }

  facAgregarReq(){
    this.facAgrupado.splice(0, 1);
    let i = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      for (let fac of this.facAgrupado) {
        // console.log(fac['MA'].substr(2,5));
        if (req['Nro. Req.'] ==  Number(fac['MA'].substr(2,5))) {
          // if(req['Nro. Req.'] == 2415){
          //   // console.log(fac['MA'].substr(2,5));
          //   // console.log(fac['HH Incurridas']);
          // }
          let horasFact = fac['HH Incurridas'];
          this.jsonDataReqService.Requerimientos[i] = {...this.jsonDataReqService.Requerimientos[i], horasFact};
        }

      }
      i++;
    }

  }

  ordenFinalARS() {
    this.jsonDataReqService.Requerimientos.sort((a, b) => {
      return a['Nro. Req.'] - b['Nro. Req.'];
    });
    console.log('---JSON FINAL---');
    console.log(this.jsonDataReqService.Requerimientos);
  }

  crearTablaFac(){

    moment.lang('es');
    // let now = moment();
    let fecha1 = moment().subtract(1,'months');
    let fecha2 = moment().subtract(2,'months');
    let fecha3 = moment().subtract(3,'months');
    let fecha4 = moment().subtract(4,'months');
    let fecha5 = moment().subtract(5,'months');
    let fecha6 = moment().subtract(6,'months');
    let fecha7 = moment().subtract(7,'months');
    let fecha8 = moment().subtract(8,'months');
    let fecha9 = moment().subtract(9,'months');
    let fecha10 = moment().subtract(10,'months');
    let fecha11 = moment().subtract(11,'months');
    let fecha12 = moment().subtract(11,'months');
    let fecha13 = moment().subtract(11,'months');
    let fecha14 = moment().subtract(11,'months');
    let fecha15 = moment().subtract(11,'months');
    let fecha16 = moment().subtract(11,'months');
    let fecha17 = moment().subtract(11,'months');
    let fecha18 = moment().subtract(11,'months');

    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;
    let total11 = 0;
    let total12 = 0;
    let total13 = 0;
    let total14 = 0;
    let total15 = 0;
    let total16 = 0;
    let total17 = 0;
    let total18 = 0;
    let i = 0;
    console.log(fecha1);

    for (let fac of this.jsonDataFacService['Datos Facturación']) {


      let anno = fac['Año'];
      let mes = fac['Mes'];
      let dia = '01';
      let fecha = dia + '-' + mes  + '-' + anno;
      let fechaFact = moment(fecha);
      
      // console.log(fecha1);
      // console.log(fechaFact);
      // console.log(fecha1);

      if (moment(fecha1).isSame(fechaFact, 'month')) {
          // console.log('true1');
          total1 = total1 + fac['HH Incurridas'];
      }
      if (moment(fecha2).isSame(fechaFact, 'month')) {
          // console.log('true2');
          total2 = total2 + fac['HH Incurridas'];
      }
      if (moment(fecha3).isSame(fechaFact, 'month')) {
          total3 = total3 + fac['HH Incurridas'];
      }
      if (moment(fecha4).isSame(fechaFact, 'month')) {
          total4 = total4 + fac['HH Incurridas'];
      }
      if (moment(fecha5).isSame(fechaFact, 'month')) {
          total5 = total5 + fac['HH Incurridas'];
      }
      if (moment(fecha6).isSame(fechaFact, 'month')) {
          total6 = total6 + fac['HH Incurridas'];
      }
      if (moment(fecha7).isSame(fechaFact, 'month')) {
          total7 = total7 + fac['HH Incurridas'];
      }
      if (moment(fecha8).isSame(fechaFact, 'month')) {
          total8 = total8 + fac['HH Incurridas'];
      }
      if (moment(fecha9).isSame(fechaFact, 'month')) {
          total9 = total9 + fac['HH Incurridas'];
      }
      if (moment(fecha10).isSame(fechaFact, 'month')) {
          total10 = total10 + fac['HH Incurridas'];
      }
      if (moment(fecha11).isSame(fechaFact, 'month')) {
          total11 = total11 + fac['HH Incurridas'];
      }
      if (moment(fecha12).isSame(fechaFact, 'month')) {
          total12 = total12 + fac['HH Incurridas'];
      }
      if (moment(fecha13).isSame(fechaFact, 'month')) {
          total13 = total13 + fac['HH Incurridas'];
      }
      if (moment(fecha14).isSame(fechaFact, 'month')) {
          total14 = total14 + fac['HH Incurridas'];
      }
      if (moment(fecha15).isSame(fechaFact, 'month')) {
          total15 = total15 + fac['HH Incurridas'];
      }
      if (moment(fecha16).isSame(fechaFact, 'month')) {
          total16 = total16 + fac['HH Incurridas'];
      }
      if (moment(fecha17).isSame(fechaFact, 'month')) {
          total17 = total17 + fac['HH Incurridas'];
      }
      if (moment(fecha18).isSame(fechaFact, 'month')) {
          total18 = total18 + fac['HH Incurridas'];
      }

      this.jsonDataFacService['Datos Facturación'][i] = {...this.jsonDataFacService['Datos Facturación'][i],
      fecha1, total1,
      fecha2, total2,
      fecha3, total3,
      fecha4, total4,
      fecha5, total5,
      fecha6, total6,
      fecha7, total7,
      fecha8, total8,
      fecha9, total9,
      fecha10, total10,
      fecha11, total11,
      fecha12, total12,
      fecha13, total13,
      fecha14, total14,
      fecha15, total15,
      fecha16, total16,
      fecha17, total17,
      fecha18, total18,
      };
      total1 = 0;
      total2 = 0;
      total3 = 0;
      total4 = 0;
      total5 = 0;
      total6 = 0;
      total7 = 0;
      total8 = 0;
      total9 = 0;
      total10 = 0;
      total11 = 0;
      total12 = 0;
      total13 = 0;
      total14 = 0;
      total15 = 0;
      total16 = 0;
      total17 = 0;
      total18 = 0;
      i++;
    }
    console.log(this.jsonDataFacService['Datos Facturación']);
    // }

  }
}
