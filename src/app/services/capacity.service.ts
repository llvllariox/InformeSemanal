import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { FeriadosChileService } from './feriados-chile.service';
import { SweetAlertService } from './sweet-alert.service';

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
  // -------------------------------
  totalMes = 0;
  // ReqAgrupado = [];
  inicioMes2;
  finMes2;
  ultDia2;
  dias2 = [];
  totalMes1 = 0;
  totalMes2 = 0;
  totalMes1CS = 0;
  totalMes2CS = 0;
  totalDia = [];
  feriados = [];
  capacidadporDia = [];
  TotalcapacidadporDia = [];
  totalTotal = 0;
  totalDisponible = 0;
  horasMtto = 0;

  constructor(private feriadosService: FeriadosChileService, private sweetService: SweetAlertService) {

    // this.inicioMes = moment().add(1,'months').startOf('month');
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

    // this.inicioMes2 = moment().startOf('month');
    this.inicioMes2 = moment().add(1, 'month').startOf('month');
    this.finMes2 = moment().add(1, 'month').endOf('month');
    const diaFin2 = Number(this.finMes2.format('DD'));
    this.ultDia2 =  Number(this.finMes2.format('DD'));
    let diaN2;
    // tslint:disable-next-line: prefer-const
    // let total = 0;

    for (let i = 0; i < diaFin2; i++) {
      diaN2 = moment(this.inicioMes2).add(i, 'day');
      this.dias2.push({diaN2, total});
    }
    // console.log(this.dias2);

    let anno = Number(moment(). format('YYYY'));
    // let mes = Number(moment().add(1, 'month').format('MM'));
    let mes = Number(moment(). format('MM'));
    // console.log(anno);
    // console.log(mes);

    this.feriadosService.obtenerProductos(anno, mes).subscribe(resp => {
        this.feriados = resp;
        // console.log('feriados', this.feriados);
    }, err => {
      console.log(err);
      this.sweetService.mensajeError('Error al obtener productos', err.error.mensaje || err.error.errors.message);
    });

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
    this.totalesMes();
    // Capacity Service x 180
    this.ordenarPorARSCS();
    this.filtrarCS();
    this.totalEjecucion();
    this.totalporDia();
    this.capacidadDisponible();
    this.totCapacidadDisponible();
    console.log('ulitmo', this.jsonDataPlanServiceCS);
    // return;
    // this.agruparARSCS();


  }

    agregaFechas(){

    let i = 0;
    // let mes1 = [];

    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
      let x = 0;
      let mes1 = [];
      for (const dia of this.dias) {
        // let diaN = `dia${x + 1}`;
        let diaF = moment(dia.diaN).format('DD-MM-YYYY');
        mes1.push({'fecha' : diaF, 'total': 0});
        x++;
      }
      this.jsonDataPlanService['Detalle Horas Planificadas'][i] = {...this.jsonDataPlanService['Detalle Horas Planificadas'][i], mes1};
      i++;
    }

    i = 0;
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
      let x = 0;
      let mes2 = [];
      for (const dia of this.dias2) {
        // let diaN = `dia${x + 1}`;
        let diaF = moment(dia.diaN2).format('DD-MM-YYYY');
        mes2.push({'fecha' : diaF, 'total': 0});
        x++;
      }
      this.jsonDataPlanService['Detalle Horas Planificadas'][i] = {...this.jsonDataPlanService['Detalle Horas Planificadas'][i], mes2};
      i++;
    }

    // let i2 = 0;
    // for (let plan2 of this.jsonDataPlanService['Detalle Horas Planificadas']) {
    //   let x2 = 0;
    //   for (const dia2 of this.dias2) {
    //     let diaN2 = `dia${x2 + 1}`;
    //     plan2[diaN2] = 0;
    //     x2++;
    //   }
    //   i2++;
    // }

    // console.log(this.jsonDataPlanService);
  }

  sumaHH(){
    let i = 0;
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
        let x = 0;
        let fecha = moment(plan.fechaPlanificada).format('DD-MM-YYYY');
        for (const planMes1 of plan.mes1) {
          if (fecha == planMes1.fecha){
            planMes1.total = plan.horasPlanificadas;
          }
        }

        for (const planMes2 of plan.mes2) {
          if (fecha == planMes2.fecha){
            planMes2.total = plan.horasPlanificadas;
          }
        }
      }

    // }
    // let i = 0;
    // for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
    //   let x = 0;
    //   let fecha = moment(plan.fechaPlanificada).format('L');
    //   for (let dia of this.dias) {
    //     if (Number(fecha.toString().substr(3, 2)) == Number(x + 1)){
    //       let diaN = `dia${x + 1}`;
    //       plan[diaN] = plan.horasPlanificadas;
    //     }
    //     x++;
    //   }
    // }
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

          for (let i = 0; i < plan.mes1.length; i++) {
            planPadre.mes1[i].total = Number(planPadre.mes1[i].total) + Number(plan.mes1[i].total);
          }

          for (let i = 0; i < plan.mes2.length; i++) {
            planPadre.mes2[i].total = Number(planPadre.mes2[i].total) + Number(plan.mes2[i].total);
            // console.log(plan.mes2[i].total);
          }
        }
        i++

        if (i== maximo -1){
          this.planAgrupado.push(planPadre);
        }
      }

    this.planAgrupado.splice(0, 1);
    this.jsonDataPlanService = this.planAgrupado;

    }

    totalesMes(){

      for (let plan of this.jsonDataPlanService) {
        let totalMes1 = 0;
        for (const dia of plan.mes1) {
          totalMes1 = totalMes1 + dia.total;
        }
        plan.mes1.totalMes1 = totalMes1;

        let totalMes2 = 0;
        for (const dia2 of plan.mes2) {
          totalMes2 = totalMes2 + dia2.total;
        }
        plan.mes2.totalMes2 = totalMes2;
      }
      // this.totales = {};
//       for (let i = 1; i < 32; i++) {
//         let diaN = `dia${i}`;
//         this.totales[diaN] = 0;
//       }
//       // console.log(this.totales);
// // return;
//       for (let plan of this.jsonDataPlanService) {
//         for (let i = 1; i < 32; i++) {
//           let diaN = `dia${i}`;
//           // console.log(plan[diaN]);
//           this.totales[diaN] = Number(this.totales[diaN]) + Number(plan[diaN]);
//         }
//       }
//       console.log(this.totales);
//       this.totalMes = this.totales.dia1 + this.totales.dia2 + this.totales.dia3 + this.totales.dia4 + this.totales.dia5 +
//       this.totales.dia6 + this.totales.dia7 + this.totales.dia8      + this.totales.dia9 + this.totales.dia10 + this.totales.dia11 +
//       this.totales.dia12 + this.totales.dia13 + this.totales.dia14 + this.totales.dia15 + this.totales.dia16  + this.totales.dia17 +
//       this.totales.dia18 + this.totales.dia19 + this.totales.dia20 + this.totales.dia21 + this.totales.dia22 + this.totales.dia23 +
//       this.totales.dia24 + this.totales.dia25 + this.totales.dia26 + this.totales.dia27 + this.totales.dia28 + this.totales.dia29 +
//       this.totales.dia30 + this.totales.dia31;
    }

    CSlineaBase(){
      for (let plan of this.jsonDataPlanService) {
        if (plan.descripcion.substr(0, 2) === 'CS'){
            // console.log('entro');
            let totalMes1 = 0;
            let totalMes2 = 0;

            for (const planMes1 of plan.mes1) {
              totalMes1 = totalMes1 + planMes1.total;
            }
            for (const planMes2 of plan.mes2) {
              totalMes2 = totalMes2 + planMes2.total;
            }

            if (totalMes1 > 180 && totalMes1 > 0) {
              let ultDia = plan.mes1.length;
              let dif = totalMes1 - 180;
              plan.mes1[ultDia - 1].total =  plan.mes1[ultDia - 1].total - dif;

            }

            if (totalMes1 < 180 && totalMes1 > 0) {
              let ultDia = plan.mes1.length;
              let dif = 180 - totalMes1;
              plan.mes1[ultDia - 1].total =  plan.mes1[ultDia - 1].total + dif;

            }

            if (totalMes2 > 180 && totalMes2 > 0) {
              let ultDia = plan.mes2.length;
              let dif = totalMes2 - 180;
              plan.mes2[ultDia - 1].total =  plan.mes2[ultDia - 1].total - dif;

            }

            if (totalMes2 < 180 && totalMes2 > 0) {
              let ultDia = plan.mes2.length;
              let dif = 180 - totalMes2;
              plan.mes2[ultDia - 1].total =  plan.mes2[ultDia - 1].total + dif;

            }

            
            // console.log('entro');
            // let total = plan.dia1 + plan.dia2 + plan.dia3 + plan.dia4 + plan.dia5 +
            //             plan.dia6 + plan.dia7 + plan.dia8 + plan.dia9 + plan.dia10 +
            //             plan.dia11 + plan.dia12 + plan.dia13 + plan.dia14 + plan.dia15 +
            //             plan.dia16 + plan.dia17 + plan.dia18 + plan.dia19 + plan.dia20 +
            //             plan.dia21 + plan.dia22 + plan.dia23 + plan.dia24 + plan.dia25 +
            //             plan.dia26 + plan.dia27 + plan.dia28 + plan.dia29 + plan.dia30 +
            //             plan.dia31;
            // let diaN = `dia${this.ultDia}`;
            // if (total > 180) {
            //     let dif = total - 180;
            //     plan[diaN] = plan[diaN] - dif;
            // }
            // if (total < 180) {
            //   let dif = 180 - total;
            //   plan[diaN] = plan[diaN] + dif;
            // }
        }
      }

    }

    filtrarCS(){
      this.jsonDataPlanService = this.jsonDataPlanService.filter(a => {
        return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Asesoramiento y Consulta';
      });

    }
    ordenarPorARSCS(){
      let jsonDataCS = [...this.jsonDataPlanService];
      // console.log('jsonDataCS',jsonDataCS);
      this.jsonDataPlanServiceCS = jsonDataCS.filter(a => {
        return a.lineaDeServicio === 'Capacity Service' &&  a.numeroArs !== 434;
      });

      this.jsonDataPlanServiceCS.sort((a, b) => {
        return a.numeroArs - b.numeroArs;
      });
    }

    totalEjecucion(){
      this.totalMes1 = 0;
      this.totalMes2 = 0;
      this.totalMes1CS = 0;
      this.totalMes2CS = 0;
      for (let plan of this.jsonDataPlanService) {
        this.totalMes1 = this.totalMes1 + plan.mes1.totalMes1;
        this.totalMes2 = this.totalMes2 + plan.mes2.totalMes2;
      }
      // console.log(this.totalMes1);
      // console.log(this.totalMes2);

      for (let planCS of this.jsonDataPlanServiceCS) {
        this.totalMes1CS = this.totalMes1CS + planCS.mes1.totalMes1;
        this.totalMes2CS = this.totalMes2CS + planCS.mes2.totalMes2;
      }
      // console.log(this.totalMes1CS);
      // console.log(this.totalMes2CS);
    }

    totalporDia(){
      let total = 0;
      this.totalDia = [];
      for (const dia of this.dias) {
        let diaF = moment(dia.diaN).format('DD-MM-YYYY');
        // console.log(diaF);
        this.totalDia.push({diaF, total: 0});
      }
      // this.totalDia = [...this.dias, 0];

      for (const plan of this.jsonDataPlanService) {
        for (let i = 0; i < plan.mes1.length; i++) {
          this.totalDia[i].total = this.totalDia[i].total + plan.mes1[i].total;
        }
      }
      // console.log(this.totalDia);
    }

    capacidadDisponible(){
      this.capacidadporDia = [];
      this.totalDisponible = 0;
      for (const dia of this.dias) {
        // let diaN = `dia${x + 1}`;
        let diaF = moment(dia.diaN).format('YYYY-MM-DD');
        this.capacidadporDia.push({'fecha' : diaF, 'total': 0, 'habil': true});

      }
      // console.log('capacidad', this.capacidadporDia);

      for (let dia of this.capacidadporDia) {
        let diaS = Number(moment(dia.fecha).day());
        // console.log(diaS);
        if (diaS == 0 || diaS == 6){
            dia.habil = false;
        }
      }

      for (let dia of this.capacidadporDia) {
        for (const feriado of this.feriados) {
            if (dia.fecha == feriado.fecha){
                dia.habil = false;
            }
        }
      }

      let cantDiasHabiles = 0;
      for (const dia of this.capacidadporDia) {
        if (dia.habil){
          cantDiasHabiles = cantDiasHabiles + 1;
        }
      }
      console.log(this.horasMtto);
      let HHporDias = (8910 -  this.horasMtto) / cantDiasHabiles;
      // console.log(HHporDias);

      for (let dia of this.capacidadporDia) {
        if(dia.habil){
          dia.total = Math.round(HHporDias);
          this.totalDisponible = this.totalDisponible + dia.total;
        }
      }

    }

    totCapacidadDisponible(){
      this.TotalcapacidadporDia = [];
      for (const dia of this.dias) {
        // let diaN = `dia${x + 1}`;
        let diaF = moment(dia.diaN).format('YYYY-MM-DD');
        this.TotalcapacidadporDia.push({'fecha' : diaF, 'total': 0});
      }

      for (let i = 0; i < this.TotalcapacidadporDia.length; i++) {
        this.TotalcapacidadporDia[i].total = this.capacidadporDia[i].total - this.totalDia[i].total;
        this.totalTotal = this.totalTotal + this.TotalcapacidadporDia[i].total;
        // console.log(this.capacidadporDia[i]);
        // console.log(this.totalDia[i]);
      }
      // console.log('TotalcapacidadporDia', this.TotalcapacidadporDia);
    }

    // agruparARSCS(){

    //   let planPadreCS: any = [];
    //   let maximo = this.jsonDataPlanServiceCS.length;
    //   let i = 0;
    //   // tslint:disable-next-line: prefer-const
    //   for (let plan of this.jsonDataPlanServiceCS) {

    //       if (plan.numeroArs !== planPadreCS.numeroArs) {
    //         if (planPadreCS) {
    //           planPadreCS.horas1 = plan.mes1.total;
    //           planPadreCS.horas2 = plan.mes2.total;
    //           this.planAgrupadoCS.push(planPadreCS);
    //         }
    //         planPadreCS = plan;
    //       }
    //       i++

    //       if (i== maximo -1){
    //         this.planAgrupadoCS.push(planPadreCS);
    //       }
    //     }
    //   // console.log('Agrupado', this.planAgrupado);
    //   this.planAgrupadoCS.splice(0, 1);
    //   this.jsonDataPlanServiceCS = this.planAgrupadoCS;
    //   console.log('jsonDataPlanServiceCS', this.jsonDataPlanServiceCS);
    //   }
    
}
