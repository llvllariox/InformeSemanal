import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

  jsonDataPlanService;
  jsonDataPlanServiceCS;
  inicioMes;
  finMes;
  ultDia;
  dias = [];
  planAgrupado = [];
  planAgrupadoCS = [];
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
    this.ultDia =  Number(this.finMes.format('DD'));
    let diaN;
    // tslint:disable-next-line: prefer-const
    let total = 0;

    for (let i = 0; i < diaFin; i++) {
      diaN = moment( this.inicioMes).add(i, 'day');
      this.dias.push({diaN, total});

    }
    // console.log(this.dias);

   }

  getJsonDataPlanService() {
    return this.jsonDataPlanService;
  }

  setjsonDataPlanService(jsonDataPlanService: any) {
    this.jsonDataPlanService = jsonDataPlanService;
  }

  getJsonDataPlanServiceCS() {
    return this.jsonDataPlanServiceCS;
  }

  setjsonDataPlanServiceCS(jsonDataPlanServiceCS: any) {
    this.jsonDataPlanServiceCS = jsonDataPlanServiceCS;
    // console.log(this.jsonDataPlanServiceCS);
  }

  generarCapacity() {

    this.agregaFechas();
    this.sumaHH();
    this.ordenarPorARS();
    this.agruparARS();
    this.CSlineaBase();
    this.totalesDia();

    // Capacity Service x 180
    this.ordenarPorARSCS();
    // console.log('ulitmo', this.jsonDataPlanServiceCS);
    // return;
    this.agruparARSCS();


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
    let maximo = this.jsonDataPlanService['Detalle Horas Planificadas'].length;
    let i = 0;

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
        i++

        if (i== maximo -1){
          this.planAgrupado.push(planPadre);
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
      // console.log(this.totales);
// return;
      for (let plan of this.jsonDataPlanService) {
        for (let i = 1; i < 32; i++) {
          let diaN = `dia${i}`;
          // console.log(plan[diaN]);
          this.totales[diaN] = Number(this.totales[diaN]) + Number(plan[diaN]);
        }
      }
      console.log(this.totales);
      this.totalMes = this.totales.dia1 + this.totales.dia2 + this.totales.dia3 + this.totales.dia4 + this.totales.dia5 +
      this.totales.dia6 + this.totales.dia7 + this.totales.dia8      + this.totales.dia9 + this.totales.dia10 + this.totales.dia11 +
      this.totales.dia12 + this.totales.dia13 + this.totales.dia14 + this.totales.dia15 + this.totales.dia16  + this.totales.dia17 +
      this.totales.dia18 + this.totales.dia19 + this.totales.dia20 + this.totales.dia21 + this.totales.dia22 + this.totales.dia23 +
      this.totales.dia24 + this.totales.dia25 + this.totales.dia26 + this.totales.dia27 + this.totales.dia28 + this.totales.dia29 +
      this.totales.dia30 + this.totales.dia31;
    }

    CSlineaBase(){
      for (let plan of this.jsonDataPlanService) {
        if (plan.descripcion.substr(0, 2) === 'CS'){
            console.log('entro');
            let total = plan.dia1 + plan.dia2 + plan.dia3 + plan.dia4 + plan.dia5 +
                        plan.dia6 + plan.dia7 + plan.dia8 + plan.dia9 + plan.dia10 +
                        plan.dia11 + plan.dia12 + plan.dia13 + plan.dia14 + plan.dia15 +
                        plan.dia16 + plan.dia17 + plan.dia18 + plan.dia19 + plan.dia20 +
                        plan.dia21 + plan.dia22 + plan.dia23 + plan.dia24 + plan.dia25 +
                        plan.dia26 + plan.dia27 + plan.dia28 + plan.dia29 + plan.dia30 +
                        plan.dia31;
            let diaN = `dia${this.ultDia}`;
            if (total > 180) {
                let dif = total - 180;
                plan[diaN] = plan[diaN] - dif;
            }
            if (total < 180) {
              let dif = 180 - total;
              plan[diaN] = plan[diaN] + dif;
            }
        }
      }

    }

    ordenarPorARSCS(){
      this.jsonDataPlanServiceCS.sort((a, b) => {
        return a.numeroArs - b.numeroArs;
      });
    }

    agruparARSCS(){

      let planPadreCS: any = [];
      let maximo = this.jsonDataPlanServiceCS.length;
      let i = 0;
      // tslint:disable-next-line: prefer-const
      for (let plan of this.jsonDataPlanServiceCS) {

          if (plan.numeroArs !== planPadreCS.numeroArs) {
            if (planPadreCS) {
              planPadreCS.horas1 = 180;
              planPadreCS.horas2 = 180;
              this.planAgrupadoCS.push(planPadreCS);
            }
            planPadreCS = plan;
          }
          i++

          if (i== maximo -1){
            this.planAgrupadoCS.push(planPadreCS);
          }
        }
      // console.log('Agrupado', this.planAgrupado);
      this.planAgrupadoCS.splice(0, 1);
      this.jsonDataPlanServiceCS = this.planAgrupadoCS;
      console.log('jsonDataPlanServiceCS', this.jsonDataPlanServiceCS);
      }
}
