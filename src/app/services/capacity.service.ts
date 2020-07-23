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

   }

  getJsonDataPlanService() {
    return this.jsonDataPlanService;
  }

  setjsonDataPlanService(jsonDataPlanService: any) {
    this.jsonDataPlanService = jsonDataPlanService;
  }

  generarCapacity() {

    this.jsonDataPlanService['Detalle Horas Planificadas'].sort((a, b) => {
      const keyA = a['Número ARS'] + a['Fecha Planificada'];
      const keyB = b['Número ARS'] + b['Fecha Planificada'];

      return keyA.localeCompare(keyB);
    });

    const x = 0;
    let facpadre = [];

    // tslint:disable-next-line: prefer-const
    for (let fac of this.jsonDataPlanService['Detalle Horas Planificadas']) {

      const keyA = fac['Número ARS'] + fac['Fecha Planificada'];
      const keyB = facpadre['Número ARS'] + facpadre['Fecha Planificada'];

      if (keyA !== keyB) {
        if (facpadre) {

          this.planAgrupado.push(facpadre);
          facpadre = [];
        }
        facpadre = fac;
      } else {
        facpadre['Horas Planificadas'] = Number(facpadre['Horas Planificadas']) + Number(fac['Horas Planificadas']);

      }

    }

    const arreglo = [];
    let i = 0;
    for (const dia of this.dias) {
      for (const plan of this.planAgrupado) {

        // console.log(plan['Fecha Planificada']);
        if (moment(dia.diaN).isSame(plan['Fecha Planificada'], 'day')) {
          const total = plan['Horas Planificadas'];
          const ars = plan['Número ARS'];
          const desc = plan['Descripción'];
          const diaMes = dia.diaN;
          // arreglo.push({diaMes,ars,desc,total});
          dia[i] = {diaMes, ars, desc, total};
          i++;

        }
      }
    }
    console.log(this.dias);

  }
}
