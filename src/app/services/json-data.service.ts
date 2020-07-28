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
  fechaInformes: string;
  conFact = true;

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
    if (this.conFact) {
      this.crearTablaFac();
    }
    this.AddEveToReq();
    this.eliminarExepcionados();
    this.AddTarToReq();
    if (this.conFact) {
      this.facObtieneMA();
      this.crearHorasFact();
      this.facSumarMA();
      this.facAgregarReq();
    }

    this.groupReqOrigen();
    this.eliminarReqOrigen();
    this.unirReqconAgrupados();
    this.obtenerFechasQAPROD();
    this.validaciones();
    this.ordenFinalARS();
    this.infoCargada = true;

  }

  AddEveToReq() {

    let x = 0;
    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {
      let i = 0;
      let y = 0;
      let realizado = [];
      let proximo = [];
      let exepcion = false;
      let avanceReal = 0;
      let avanceEsperado = 0;
      for (const  eve of this.jsonDataEveService.Eventos) {

        if (req['Nro. Req.'] === eve['Número de req. o sol.']) {
          if (eve['Tipo de evento'] === 'INF - Actividad Realizada') {
            realizado[i] = eve;
            i++;
          }
          if (eve['Tipo de evento'] === 'INF - Proxima Actividad') {
            proximo[y] = eve;
            y++;
          }
          if (eve['Tipo de evento'] === 'INF - Avance Real') {
            avanceReal = Number(eve['Descripción breve']);
          }
          if (eve['Tipo de evento'] === 'INF - Avance Esperado') {
            avanceEsperado = Number(eve['Descripción breve']);
          }
          if (eve['Tipo de evento'] === 'INF - Excepción') {
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
    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {
      let i = 0;
      let estimadoQA = 0;
      let incurridoQA = 0;
      let estimadoProd = 0;
      let incurridoProd = 0;
      let tareas = [];
      let incluir = true;

      for (const  tar of this.jsonDataTarService['Detalle Tareas']) {
        if (req['Nro. Req.'] === tar['Número ARS']) {
            if (tar['Descripción Tarea'].includes('Soporte QA', 0)) {
              estimadoQA  = estimadoQA + tar['Horas Estimadas'];
              incurridoQA  = incurridoQA + tar['Horas Incurridas'];
            }
            if (tar['Descripción Tarea'].includes('Implementación y Soporte Post Producción', 0) ||
                tar['Descripción Tarea'].includes('Soporte Pase a Producción', 0) ||
                tar['Descripción Tarea'].includes('Soporte Post Producción', 0) ) {
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

          const fechaIntA = Date.parse(a['Fecha Inicio Planificada']);
          let keyA = 0;
          const fechaIntB = Date.parse(b['Fecha Inicio Planificada']);
          let keyB = 0;
          // console.log(fechaIntA);
          if (fechaIntA === -2209058280000) {
            keyA = (Date.parse('Sun Dec 31 2050 00:00:00 GMT-0442 (hora de verano de Chile)' ) - 20) + a.orden;
          } else {
            keyA = fechaIntA;
          }

          if (fechaIntB === -2209058280000) {
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
  crearHorasFact() {

    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {
      req['horasFact'] = 0;
      req.fecha1 = moment();
      req.fecha2 = moment().subtract(1, 'months');
      req.fecha3 = moment().subtract(2, 'months');
      req.fecha4 = moment().subtract(3, 'months');
      req.fecha5 = moment().subtract(4, 'months');
      req.fecha6 = moment().subtract(5, 'months');
      req.fecha7 = moment().subtract(6, 'months');
      req.fecha8 = moment().subtract(7, 'months');
      req.fecha9 = moment().subtract(8, 'months');
      req.fecha10 = moment().subtract(9, 'months');
      req.fecha11 = moment().subtract(10, 'months');
      req.fecha12 = moment().subtract(11, 'months');
      req.fecha13 = moment().subtract(12, 'months');
      req.fecha14 = moment().subtract(13, 'months');
      req.fecha15 = moment().subtract(14, 'months');
      req.fecha16 = moment().subtract(15, 'months');
      req.fecha17 = moment().subtract(16, 'months');
      req.fecha18 = moment().subtract(17, 'months');
      req.fecha19 = moment().subtract(18, 'months');
      req.fecha20 = moment().subtract(19, 'months');
      req.fecha21 = moment().subtract(20, 'months');
      req.fecha22 = moment().subtract(21, 'months');
      req.fecha23 = moment().subtract(22, 'months');
      req.fecha24 = moment().subtract(23, 'months');
      req.fecha25 = moment().subtract(24, 'months');

      req.total1 = 0;
      req.total2 = 0;
      req.total3 = 0;
      req.total4 = 0;
      req.total5 = 0;
      req.total6 = 0;
      req.total7 = 0;
      req.total8 = 0;
      req.total9 = 0;
      req.total10 = 0;
      req.total11 = 0;
      req.total12 = 0;
      req.total13 = 0;
      req.total14 = 0;
      req.total15 = 0;
      req.total16 = 0;
      req.total17 = 0;
      req.total18 = 0;
      req.total19 = 0;
      req.total20 = 0;
      req.total21 = 0;
      req.total22 = 0;
      req.total23 = 0;
      req.total24 = 0;
      req.total25 = 0;

    }
  }

  groupReqOrigen() {

    let Reqpadre = [];
    let ultEtapa = '';
    let ultLD = '';
    let ultPM = '';
    let ultCECO = '';
    let ultTareas = [];

    this.jsonDataReqService.Requerimientos.sort((a, b) => {

      let keyA = 0;
      let keyB = 0;

      if (a['Req. Origen'] === ' ') {
        keyA = a['Nro. Req.'];
      } else {
        keyA = a['Req. Origen'];
      }

      if (b['Req. Origen'] === ' ') {
        keyB = b['Nro. Req.'];
      } else {
        keyB = b['Req. Origen'];
      }

      return keyA - keyB;
    });

    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {

      if (req['Req. Origen'] === ' ' || req['Req. Origen'] === undefined) {
        req['Req. Origen'] = req['Nro. Req.'];
      }

      if (req['Req. Origen'] !== ' ') {
        if (req['Req. Origen'] !== Reqpadre['Req. Origen']) {
          if (Reqpadre) {

            Reqpadre['Etapa'] = ultEtapa || Reqpadre['Etapa'];
            Reqpadre['Solicitante'] = ultLD || Reqpadre['Solicitante'];
            Reqpadre['Origen'] = ultPM || Reqpadre['Origen'];
            Reqpadre['Código Externo'] = ultCECO || Reqpadre['Código Externo'];
            Reqpadre['Req. Origen'] = ' ';
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
          Reqpadre['total1'] = Number(Reqpadre['total1']) + Number(req['total1']);
          Reqpadre['total2'] = Number(Reqpadre['total2']) + Number(req['total2']);
          Reqpadre['total3'] = Number(Reqpadre['total3']) + Number(req['total3']);
          Reqpadre['total4'] = Number(Reqpadre['total4']) + Number(req['total4']);
          Reqpadre['total5'] = Number(Reqpadre['total5']) + Number(req['total5']);
          Reqpadre['total6'] = Number(Reqpadre['total6']) + Number(req['total6']);
          Reqpadre['total7'] = Number(Reqpadre['total7']) + Number(req['total7']);
          Reqpadre['total8'] = Number(Reqpadre['total8']) + Number(req['total8']);
          Reqpadre['total9'] = Number(Reqpadre['total9']) + Number(req['total9']);
          Reqpadre['total10'] = Number(Reqpadre['total10']) + Number(req['total10']);
          Reqpadre['total11'] = Number(Reqpadre['total11']) + Number(req['total11']);
          Reqpadre['total12'] = Number(Reqpadre['total12']) + Number(req['total12']);
          Reqpadre['total13'] = Number(Reqpadre['total13']) + Number(req['total13']);
          Reqpadre['total14'] = Number(Reqpadre['total14']) + Number(req['total14']);
          Reqpadre['total15'] = Number(Reqpadre['total15']) + Number(req['total15']);
          Reqpadre['total16'] = Number(Reqpadre['total16']) + Number(req['total16']);
          Reqpadre['total17'] = Number(Reqpadre['total17']) + Number(req['total17']);
          Reqpadre['total18'] = Number(Reqpadre['total18']) + Number(req['total18']);
          Reqpadre['total19'] = Number(Reqpadre['total19']) + Number(req['total19']);
          Reqpadre['total20'] = Number(Reqpadre['total20']) + Number(req['total20']);
          Reqpadre['total21'] = Number(Reqpadre['total21']) + Number(req['total21']);
          Reqpadre['total22'] = Number(Reqpadre['total22']) + Number(req['total22']);
          Reqpadre['total23'] = Number(Reqpadre['total23']) + Number(req['total23']);
          Reqpadre['total24'] = Number(Reqpadre['total24']) + Number(req['total24']);
          Reqpadre['total25'] = Number(Reqpadre['total25']) + Number(req['total25']);

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
   for (let i = 0; i < this.jsonDataReqService.Requerimientos.length;) {

    // tslint:disable-next-line: prefer-const
    let req = this.jsonDataReqService.Requerimientos[i];
    let reqOrigen = req['Req. Origen'].toString();
    if (reqOrigen.length > 1) {
      this.jsonDataReqService.Requerimientos.splice(i, 1);
      reqOrigen = '';
    } else {
      i++;
    }

   }

  }

  eliminarExepcionados() {

  for (let i = 0; i < this.jsonDataReqService.Requerimientos.length;) {

      // tslint:disable-next-line: prefer-const
      let req = this.jsonDataReqService.Requerimientos[i];
      if (req.exepcion) {
        this.jsonDataReqService.Requerimientos.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  unirReqconAgrupados() {
    const tamaño = this.jsonDataReqService.Requerimientos.length;
    this.jsonDataReqService.Requerimientos.concat(this.ReqAgrupado);
    this.jsonDataReqService.Requerimientos.splice(tamaño, 1);

  }

  obtenerFechasQAPROD() {

    let i = 0;
    let inicioQA = null;
    let finQA = null;
    let inicioProd = null;
    let finProd = null;

    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {
      if (req.tareas !== undefined) {
        for (const  tar of req.tareas) {
          if (tar['Descripción Tarea'] === 'Soporte QA') {

            inicioQA = tar['Fecha Inicio Planificada'];
            finQA = tar['Fecha Fin Planificada'];
          }
          // tslint:disable-next-line: max-line-length
          if (tar['Descripción Tarea'] === 'Soporte Post Producción' || tar['Descripción Tarea'] === 'Implementación y Soporte Post Producción' ) {
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
    // tslint:disable-next-line: prefer-const
    for (let fac of this.jsonDataFacService['Datos Facturación']) {
      MA = fac['Nombre Requerimiento'].substr(0, 7);
      // tslint:disable-next-line: max-line-length
      this.jsonDataFacService['Datos Facturación'][i] = {...this.jsonDataFacService['Datos Facturación'][i], MA};
      i++;
    }

    this.jsonDataFacService['Datos Facturación'].sort((a, b) => {
      return a.MA.localeCompare(b.MA);
    });
  }

  facSumarMA() {

    let facpadre = [];

    // tslint:disable-next-line: prefer-const
    for (let fac of this.jsonDataFacService['Datos Facturación']) {

      if (fac['MA'] !== facpadre['MA']) {
        if (facpadre) {

          this.facAgrupado.push(facpadre);
          facpadre = [];
        }
        facpadre = fac;
      } else {
        facpadre['HH Incurridas'] = Number(facpadre['HH Incurridas']) + Number(fac['HH Incurridas']);
        facpadre['total1'] =  Number(facpadre['total1']) +  Number(fac['total1']);
        facpadre['total2'] =  Number(facpadre['total2']) +  Number(fac['total2']);
        facpadre['total3'] =  Number(facpadre['total3']) +  Number(fac['total3']);
        facpadre['total4'] =  Number(facpadre['total4']) +  Number(fac['total4']);
        facpadre['total5'] =  Number(facpadre['total5']) +  Number(fac['total5']);
        facpadre['total6'] =  Number(facpadre['total6']) +  Number(fac['total6']);
        facpadre['total7'] =  Number(facpadre['total7']) +  Number(fac['total7']);
        facpadre['total8'] =  Number(facpadre['total8']) +  Number(fac['total8']);
        facpadre['total9'] =  Number(facpadre['total9']) +  Number(fac['total9']);
        facpadre['total10'] =  Number(facpadre['total10']) +  Number(fac['total10']);
        facpadre['total11'] =  Number(facpadre['total11']) +  Number(fac['total11']);
        facpadre['total12'] =  Number(facpadre['total12']) +  Number(fac['total12']);
        facpadre['total13'] =  Number(facpadre['total13']) +  Number(fac['total13']);
        facpadre['total14'] =  Number(facpadre['total14']) +  Number(fac['total14']);
        facpadre['total15'] =  Number(facpadre['total15']) +  Number(fac['total15']);
        facpadre['total16'] =  Number(facpadre['total16']) +  Number(fac['total16']);
        facpadre['total17'] =  Number(facpadre['total17']) +  Number(fac['total17']);
        facpadre['total18'] =  Number(facpadre['total18']) +  Number(fac['total18']);
        facpadre['total19'] =  Number(facpadre['total19']) +  Number(fac['total19']);
        facpadre['total20'] =  Number(facpadre['total20']) +  Number(fac['total20']);
        facpadre['total21'] =  Number(facpadre['total21']) +  Number(fac['total21']);
        facpadre['total22'] =  Number(facpadre['total22']) +  Number(fac['total22']);
        facpadre['total23'] =  Number(facpadre['total23']) +  Number(fac['total23']);
        facpadre['total24'] =  Number(facpadre['total24']) +  Number(fac['total24']);
        facpadre['total25'] =  Number(facpadre['total25']) +  Number(fac['total25']);
      }

    }

  }

  facAgregarReq() {
    this.facAgrupado.splice(0, 1);
    let i = 0;
    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {
      // tslint:disable-next-line: prefer-const
      for (let fac of this.facAgrupado) {
        if (req['Nro. Req.'] ===  Number(fac['MA'].substr(2, 5))) {
          const horasFact = fac['HH Incurridas'];

          const fecha1 = fac.fecha1;
          const fecha2 = fac.fecha2;
          const fecha3 = fac.fecha3;
          const fecha4 = fac.fecha4;
          const fecha5 = fac.fecha5;
          const fecha6 = fac.fecha6;
          const fecha7 = fac.fecha7;
          const fecha8 = fac.fecha8;
          const fecha9 = fac.fecha9;
          const fecha10 = fac.fecha10;
          const fecha11 = fac.fecha11;
          const fecha12 = fac.fecha12;
          const fecha13 = fac.fecha13;
          const fecha14 = fac.fecha14;
          const fecha15 = fac.fecha15;
          const fecha16 = fac.fecha16;
          const fecha17 = fac.fecha17;
          const fecha18 = fac.fecha18;
          const fecha19 = fac.fecha19;
          const fecha20 = fac.fecha20;
          const fecha21 = fac.fecha21;
          const fecha22 = fac.fecha22;
          const fecha23 = fac.fecha23;
          const fecha24 = fac.fecha24;
          const fecha25 = fac.fecha25;

          const total1 = fac.total1;
          const total2 = fac.total2;
          const total3 = fac.total3;
          const total4 = fac.total4;
          const total5 = fac.total5;
          const total6 = fac.total6;
          const total7 = fac.total7;
          const total8 = fac.total8;
          const total9 = fac.total9;
          const total10 = fac.total10;
          const total11 = fac.total11;
          const total12 = fac.total12;
          const total13 = fac.total13;
          const total14 = fac.total14;
          const total15 = fac.total15;
          const total16 = fac.total16;
          const total17 = fac.total17;
          const total18 = fac.total18;
          const total19 = fac.total19;
          const total20 = fac.total20;
          const total21 = fac.total21;
          const total22 = fac.total22;
          const total23 = fac.total23;
          const total24 = fac.total24;
          const total25 = fac.total25;

          this.jsonDataReqService.Requerimientos[i] = {...this.jsonDataReqService.Requerimientos[i], horasFact,
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
            fecha19, total19,
            fecha20, total20,
            fecha21, total21,
            fecha22, total22,
            fecha23, total23,
            fecha24, total24,
            fecha25, total25,
          };
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

  crearTablaFac() {

    // tslint:disable-next-line: deprecation
    moment.lang('es');
    const fecha1 = moment().subtract(0, 'months');
    const fecha2 = moment().subtract(1, 'months');
    const fecha3 = moment().subtract(2, 'months');
    const fecha4 = moment().subtract(3, 'months');
    const fecha5 = moment().subtract(4, 'months');
    const fecha6 = moment().subtract(5, 'months');
    const fecha7 = moment().subtract(6, 'months');
    const fecha8 = moment().subtract(7, 'months');
    const fecha9 = moment().subtract(8, 'months');
    const fecha10 = moment().subtract(9, 'months');
    const fecha11 = moment().subtract(10, 'months');
    const fecha12 = moment().subtract(11, 'months');
    const fecha13 = moment().subtract(12, 'months');
    const fecha14 = moment().subtract(13, 'months');
    const fecha15 = moment().subtract(14, 'months');
    const fecha16 = moment().subtract(15, 'months');
    const fecha17 = moment().subtract(16, 'months');
    const fecha18 = moment().subtract(17, 'months');
    const fecha19 = moment().subtract(18, 'months');
    const fecha20 = moment().subtract(19, 'months');
    const fecha21 = moment().subtract(20, 'months');
    const fecha22 = moment().subtract(21, 'months');
    const fecha23 = moment().subtract(22, 'months');
    const fecha24 = moment().subtract(23, 'months');
    const fecha25 = moment().subtract(24, 'months');

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
    let total19 = 0;
    let total20 = 0;
    let total21 = 0;
    let total22 = 0;
    let total23 = 0;
    let total24 = 0;
    let total25 = 0;
    let i = 0;

    // tslint:disable-next-line: prefer-const
    for (let fac of this.jsonDataFacService['Datos Facturación']) {


      const anno = fac['Año'];
      const mes = fac['Mes'];
      let mesNum = 0;

      switch (mes) {
        case 'Enero':
          mesNum = 1;
          break;
        case 'Febrero':
          mesNum = 2;
          break;
        case 'Marzo':
          mesNum = 3;
          break;
        case 'Abril':
          mesNum = 4;
          break;
        case 'Mayo':
          mesNum = 5;
          break;
        case 'Junio':
          mesNum = 6;
          break;
        case 'Julio':
          mesNum = 7;
          break;
        case 'Agosto':
          mesNum = 8;
          break;
        case 'Septiembre':
          mesNum = 9;
          break;
        case 'Octubre':
          mesNum = 10;
          break;
        case 'Noviembre':
          mesNum = 11;
          break;
        case 'Diciembre':
          mesNum = 12;
          break;
      }

      const dia = '01';
      const fecha = mesNum + '-' + dia + '-' + anno;
      const fechaFact = moment(fecha);

      if (moment(fecha1).isSame(fechaFact, 'month')) {
          total1 = total1 + fac['HH Incurridas'];
      }
      if (moment(fecha2).isSame(fechaFact, 'month')) {
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
      if (moment(fecha19).isSame(fechaFact, 'month')) {
          total19 = total19 + fac['HH Incurridas'];
      }
      if (moment(fecha20).isSame(fechaFact, 'month')) {
          total20 = total20 + fac['HH Incurridas'];
      }
      if (moment(fecha21).isSame(fechaFact, 'month')) {
          total21 = total21 + fac['HH Incurridas'];
      }
      if (moment(fecha22).isSame(fechaFact, 'month')) {
          total22 = total22 + fac['HH Incurridas'];
      }
      if (moment(fecha23).isSame(fechaFact, 'month')) {
          total23 = total23 + fac['HH Incurridas'];
      }
      if (moment(fecha24).isSame(fechaFact, 'month')) {
          total24 = total24 + fac['HH Incurridas'];
      }
      if (moment(fecha25).isSame(fechaFact, 'month')) {
          total25 = total25 + fac['HH Incurridas'];
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
      fecha19, total19,
      fecha20, total20,
      fecha21, total21,
      fecha22, total22,
      fecha23, total23,
      fecha24, total24,
      fecha25, total25,
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
      total19 = 0;
      total20 = 0;
      total21 = 0;
      total22 = 0;
      total23 = 0;
      total24 = 0;
      total25 = 0;
      i++;
    }

  }

  validaciones() {

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.jsonDataReqService.Requerimientos.length; i++) {
      // tslint:disable-next-line: prefer-const
      let req = this.jsonDataReqService.Requerimientos[i];

      // Val 1 = Factorado > Incurrido
      let val1 = false;
      // Val 2 = Sin Actividades Realizadas
      let val2 = false;
      // Val 3 = Sin Actividades Proximas
      let val3 = false;
      // Val 4 = si estapa es pruebas qa o produccion, pendiente de incurrir(prod+qa) debe ser igual al pendiente de incurrir de ars.
      let val4 = false;

      // tslint:disable-next-line: prefer-const
      if (req.horasFact > req['Horas Incurridas']) {
        val1 = true;
      }
      req.val1 = val1;

      if (req.realizado === undefined) {
        val2 = true;
      }
      req.val2 = val2;

      if (req.proximo === undefined) {
        val3 = true;
      }
      req.val3 = val3;

      if (req.Etapa === 'Pruebas QA' || req.Etapa === 'Post Producción') {
          const sumaQAPROD = (req.estimadoQA - req.incurridoQA ) + (req.estimadoProd - req.incurridoProd);
          const pendInc = req['Horas Estimadas'] - req['Horas Incurridas'];
          if (sumaQAPROD !== pendInc) {
            val4 = true;
          }
      }
      req.val4 = val4;

    }
  }

}
