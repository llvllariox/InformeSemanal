import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

  jsonDataPlanService;
  inicioMes;
  finMes;
  dias = [];
  planAgrupado = [];
  totales = {
    'dia1': 0,
    'dia2': 0,
    'dia3': 0,
    'dia4': 0,
    'dia5': 0,
    'dia6': 0,
    'dia7': 0,
    'dia8': 0,
    'dia9': 0,
    'dia10': 0,
    'dia11': 0,
    'dia12': 0,
    'dia13': 0,
    'dia14': 0,
    'dia15': 0,
    'dia16': 0,
    'dia17': 0,
    'dia18': 0,
    'dia19': 0,
    'dia20': 0,
    'dia21': 0,
    'dia22': 0,
    'dia23': 0,
    'dia24': 0,
    'dia25': 0,
    'dia26': 0,
    'dia27': 0,
    'dia28': 0,
    'dia29': 0,
    'dia30': 0,
    'dia31': 0,

  };
  totalMes = 0;
  // ReqAgrupado = [];

  constructor() {

    this.inicioMes = moment().startOf('month');
    this.finMes = moment().endOf('month');
    const diaFin = Number(this.finMes.format('DD'));
    let diaN;
    // tslint:disable-next-line: prefer-const
    let total = 0;

    for (let i = 0; i < diaFin; i++) {
      diaN = moment( this.inicioMes).add(i, 'day');
      this.dias.push({diaN, total});

    }
    console.log(this.dias);

   }

  getJsonDataPlanService() {
    return this.jsonDataPlanService;
  }

  setjsonDataPlanService(jsonDataPlanService: any) {
    this.jsonDataPlanService = jsonDataPlanService;
  }

  generarCapacity() {

    this.agregaFechas();
    this.sumaHH();
    this.ordenarPorARS();
    this.agruparARS();
    this.totalesDia();


  }

    agregaFechas(){

    let i = 0;
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
      let x = 0;
      for (const dia of this.dias) {
        let diaN = `dia${x + 1}`;
        plan[diaN] = 0;
        x++;
      }
      i++;
    }

    // console.log(this.jsonDataPlanService);
  }

  sumaHH(){
    let i = 0;
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
      let x = 0;
      let fecha = moment(plan.fechaPlanificada).format('L');
      for (let dia of this.dias) {
        if (Number(fecha.toString().substr(3, 2)) == Number(x + 1)){
          let diaN = `dia${x + 1}`;
          plan[diaN] = plan.horasPlanificadas;
        }
        x++;
      }
    }
  }

  ordenarPorARS(){
    this.jsonDataPlanService['Detalle Horas Planificadas'].sort((a, b) => {
      return a.numeroArs - b.numeroArs;
    });
  }

  agruparARS(){

    let planPadre: any = [];

    // tslint:disable-next-line: prefer-const
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {


        if (plan.numeroArs !== planPadre.numeroArs) {
          if (planPadre) {
            this.planAgrupado.push(planPadre);
          }
          planPadre = plan;
        } else {
          planPadre.dia1 = Number(planPadre.dia1) + Number(plan.dia1);
          planPadre.dia2 = Number(planPadre.dia2) + Number(plan.dia2);
          planPadre.dia3 = Number(planPadre.dia3) + Number(plan.dia3);
          planPadre.dia4 = Number(planPadre.dia4) + Number(plan.dia4);
          planPadre.dia5 = Number(planPadre.dia5) + Number(plan.dia5);
          planPadre.dia6 = Number(planPadre.dia6) + Number(plan.dia6);
          planPadre.dia7 = Number(planPadre.dia7) + Number(plan.dia7);
          planPadre.dia8 = Number(planPadre.dia8) + Number(plan.dia8);
          planPadre.dia9 = Number(planPadre.dia9) + Number(plan.dia9);
          planPadre.dia10 = Number(planPadre.dia10) + Number(plan.dia10);
          planPadre.dia11 = Number(planPadre.dia11) + Number(plan.dia11);
          planPadre.dia12 = Number(planPadre.dia12) + Number(plan.dia12);
          planPadre.dia13 = Number(planPadre.dia13) + Number(plan.dia13);
          planPadre.dia14 = Number(planPadre.dia14) + Number(plan.dia14);
          planPadre.dia15 = Number(planPadre.dia15) + Number(plan.dia15);
          planPadre.dia16 = Number(planPadre.dia16) + Number(plan.dia16);
          planPadre.dia17 = Number(planPadre.dia17) + Number(plan.dia17);
          planPadre.dia18 = Number(planPadre.dia18) + Number(plan.dia18);
          planPadre.dia19 = Number(planPadre.dia19) + Number(plan.dia19);
          planPadre.dia20 = Number(planPadre.dia20) + Number(plan.dia20);
          planPadre.dia21 = Number(planPadre.dia21) + Number(plan.dia21);
          planPadre.dia22 = Number(planPadre.dia22) + Number(plan.dia22);
          planPadre.dia23 = Number(planPadre.dia23) + Number(plan.dia23);
          planPadre.dia24 = Number(planPadre.dia24) + Number(plan.dia24);
          planPadre.dia25 = Number(planPadre.dia25) + Number(plan.dia25);
          planPadre.dia26 = Number(planPadre.dia26) + Number(plan.dia26);
          planPadre.dia27 = Number(planPadre.dia27) + Number(plan.dia27);
          planPadre.dia28 = Number(planPadre.dia28) + Number(plan.dia28);
          planPadre.dia29 = Number(planPadre.dia29) + Number(plan.dia29);
          planPadre.dia30 = Number(planPadre.dia30) + Number(plan.dia30);
          planPadre.dia31 = Number(planPadre.dia31) + Number(plan.dia31);
        }
      }
    // console.log('Agrupado', this.planAgrupado);
    this.planAgrupado.splice(0, 1);
    this.jsonDataPlanService = this.planAgrupado;

    console.log('jsonDataPlanService', this.jsonDataPlanService);
    }

    totalesDia(){
      // this.totales = {};
      for (let i = 1; i < 32; i++) {
        let diaN = `dia${i}`;
        this.totales[diaN] = 0;
      }
      console.log(this.totales);
// return;
      for (let plan of this.jsonDataPlanService) {
        for (let i = 1; i < 32; i++) {
          let diaN = `dia${i}`;
          // console.log(plan[diaN]);
          this.totales[diaN] = Number(this.totales[diaN]) + Number(plan[diaN]);
        }
      }
      // console.log(this.totales);
      this.totalMes = this.totales.dia1 + this.totales.dia2 + this.totales.dia3 + this.totales.dia4 + this.totales.dia5 +
      this.totales.dia6 + this.totales.dia7 + this.totales.dia8      + this.totales.dia9 + this.totales.dia10 + this.totales.dia11 +
      this.totales.dia12 + this.totales.dia13 + this.totales.dia14 + this.totales.dia15 + this.totales.dia16  + this.totales.dia17 +
      this.totales.dia18 + this.totales.dia19 + this.totales.dia20 + this.totales.dia21 + this.totales.dia22 + this.totales.dia23 +
      this.totales.dia24 + this.totales.dia25 + this.totales.dia26 + this.totales.dia27 + this.totales.dia28 + this.totales.dia29 +
      this.totales.dia30 + this.totales.dia31;
    }
}

  // generarCapacity() {

  //   this.jsonDataPlanService['Detalle Horas Planificadas'].sort((a, b) => {
  //     const keyA = a.numeroArs + a.fechaPlanificada;
  //     const keyB = b.numeroArs + b.fechaPlanificada;

  //     return keyA.localeCompare(keyB);
  //   });

  //   const x = 0;
  //   let facpadre: any = [];

  //   // tslint:disable-next-line: prefer-const
  //   for (let fac of this.jsonDataPlanService['Detalle Horas Planificadas']) {

  //     const keyA = fac.numeroArs + fac.fechaPlanificada;
  //     const keyB = facpadre.numeroArs + facpadre.fechaPlanificada;

  //     if (keyA !== keyB) {
  //       if (facpadre) {

  //         this.planAgrupado.push(facpadre);
  //         facpadre = [];
  //       }
  //       facpadre = fac;
  //     } else {
  //       facpadre.horasPlanificadas = Number(facpadre.horasPlanificadas) + Number(fac.horasPlanificadas);

  //     }

  //   }

  //   const arreglo = [];
  //   let i = 0;
  //   for (const dia of this.dias) {
  //     for (const plan of this.planAgrupado) {

  //       // console.log(plan['Fecha Planificada']);
  //       if (moment(dia.diaN).isSame(plan.fechaPlanificada, 'day')) {
  //         const total = plan.horasPlanificadas;
  //         const ars = plan.numeroArs;
  //         const desc = plan.descripcion;
  //         const diaMes = dia.diaN;
  //         // arreglo.push({diaMes,ars,desc,total});
  //         dia[i] = {diaMes, ars, desc, total};
  //         i++;

  //       }
  //     }
  //   }
  //   console.log(this.dias);

  // }
// }
