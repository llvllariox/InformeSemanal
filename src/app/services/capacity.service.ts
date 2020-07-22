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
    let diaFin = Number(this.finMes.format('DD'));
    let diaN;
    let total = 0;
    console.log(this.inicioMes);
    console.log(this.finMes);
    console.log(diaFin);

    for (let i = 0; i < diaFin; i++) {
      diaN = moment( this.inicioMes).add(i,'day');
      this.dias.push({diaN,total});
      
    }
    console.log(this.dias);

   }

  getJsonDataPlanService() {
    return this.jsonDataPlanService;
  }

  setjsonDataPlanService(jsonDataPlanService: any) {
    this.jsonDataPlanService = jsonDataPlanService;
  }

  generarCapacity(){

    this.jsonDataPlanService['Detalle Horas Planificadas'].sort((a, b) => {
    
      let keyA = a['Número ARS'] + a['Fecha Planificada'];
      let keyB = b['Número ARS'] + b['Fecha Planificada'];

      return keyA.localeCompare(keyB);
    });
    // this.jsonDataPlanService['Detalle Horas Planificadas'].sort((a, b) => {
    //   return a['Número ARS'] - b['Número ARS'];
    // });

    let x = 0;
    let facpadre = [];

    for (let fac of this.jsonDataPlanService['Detalle Horas Planificadas']) {

      let keyA = fac['Número ARS'] + fac['Fecha Planificada'];
      let keyB = facpadre['Número ARS'] + facpadre['Fecha Planificada'];

      if (keyA !== keyB){
        if (facpadre) {

          this.planAgrupado.push(facpadre);
          // console.log(facpadre);
          facpadre = [];
        }
        facpadre = fac;
      } else {
        facpadre['Horas Planificadas'] = Number(facpadre['Horas Planificadas']) + Number(fac['Horas Planificadas']);
        
      }

    }
    // console.log(this.planAgrupado);
    let arreglo = [];
    let i = 0;
    for (const dia of this.dias) {
      for (const plan of this.planAgrupado) {
       
        // console.log(plan['Fecha Planificada']);
        if (moment(dia.diaN).isSame(plan['Fecha Planificada'],'day')) {
          console.log('same');
          let total = plan['Horas Planificadas'];
          let ars = plan['Número ARS'];
          let desc = plan['Descripción'];
          let diaMes = dia.diaN;
          // arreglo.push({diaMes,ars,desc,total});
          dia[i] = {diaMes,ars,desc,total};
          i++;
         
        }
      }
    }
    // for (const plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
    //   for (const dia of this.dias) {

    //     // console.log(plan['Fecha Planificada']);
    //     if (moment(dia.diaN).isSame(plan['Fecha Planificada'],'day')) {
    //       // console.log('same');
    //         let total = plan['Horas Planificadas'];
    //         let ars = plan['Número ARS'];
    //         let desc = plan['Descripción'];
    //         let diaMes = dia.diaN;
    //         arreglo.push({diaMes,ars,desc,total});
    //     }
    //   }
    // }



    console.log(this.dias);

  }
}
