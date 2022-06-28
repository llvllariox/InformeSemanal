import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { FeriadosChileService } from './feriados-chile.service';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

  jsonDataPlanService;
  jsonDataPlanService2;
  jsonDataPlanServiceCS;
  jsonDataPlanMttoBO;
  jsonDataPlanMttoBE;
  jsonDataPlanMttoBOReal;
  jsonDataPlanMttoBEReal;
  jsonDataMayores1;
  jsonDataMayores2;
  inicioMes;
  finMes;
  ultDia;
  dias = [];
  planAgrupado = [];
  planAgrupadoCS = [];
  totalMes = 0;
  inicioMes2;
  finMes2;
  ultDia2;
  dias2 = [];
  totalMes1 = 0;
  totalMes2 = 0;
  totalMes1CS = 0;
  totalMes2CS = 0;
  totalMes1Mayores = 0;
  totalMes2Mayores= 0;
  totalDia = [];
  feriados = [];
  capacidadporDia = [];
  capacidadporDia2 = [];
  TotalcapacidadporDia = [];
  totalTotal = 0;
  totalDisponible = 0;
  horasMtto = 0;
  horasMttoBO1 = 0;
  horasMttoBO2 = 0;
  horasMttoBE1 = 0;
  horasMttoBE2 = 0;
  horasMttoBO1Real = 0;
  horasMttoBO2Real = 0;
  horasMttoBE1Real = 0;
  horasMttoBE2Real = 0;
  totalHorasMtto1 = 0;
  totalHorasMtto2 = 0;
  totalDiasMes1 = 0;
  totalDiasMes2 = 0;
  cantDiasHabiles = 0;
  cantDiasHabiles2 = 0;
  ultDiaHabil = 0;
  diasNoHabil = [];
  diasNH = [];
  constructor(private feriadosService: FeriadosChileService, private sweetService: SweetAlertService) {

    // Se obtienen todos los dias del mes en curso en arreglo this.dias
    this.inicioMes = moment().startOf('month');
    this.finMes = moment().endOf('month');
    const diaFin = Number(this.finMes.format('DD'));
    this.ultDia =  Number(this.finMes.format('DD'));
    let diaN;
    const total = 0;

    for (let i = 0; i < diaFin; i++) {
      diaN = moment( this.inicioMes).add(i, 'day');
      this.dias.push({diaN, total});

    }

    // Se obtienen todo los dias del proximo mes en arreglo this.dias2
    this.inicioMes2 = moment().add(1, 'month').startOf('month');
    this.finMes2 = moment().add(1, 'month').endOf('month');
    const diaFin2 = Number(this.finMes2.format('DD'));
    this.ultDia2 =  Number(this.finMes2.format('DD'));
    let diaN2;

    for (let i = 0; i < diaFin2; i++) {
      diaN2 = moment(this.inicioMes2).add(i, 'day');
      this.dias2.push({diaN2, total});
    }

    const anno = Number(moment(). format('YYYY'));
    const mes = Number(moment(). format('MM'));

    // Se obtienen los feriados del mes y anno actual
    this.feriadosService.obtenerProductos(anno, mes).subscribe(resp => {
        this.feriados = resp;
    }, err => {
      console.log(err);
      this.sweetService.mensajeError('Error al obtener Feriados', err.og.message);
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
  }

  generarCapacity() {

    this.agregaFechas();
    this.sumaHH();
    this.ordenarPorARS();

    this.agruparARS();
    this.obtieneDiasHabiles();
    this.CSlineaBase();
    this.totalesMes();
    this.ordenarPorARSCS();
    this.filtrarMantenimientoBolsas();
    this.filtrarMantenimientoReal();
    this.sumarMantenimientoReal();
    this.filtrarCS();
    this.totalEjecucion();
    this.totalEjecucionCS();
    this.totalporDia();
    this.capacidadDisponible();
    this.totCapacidadDisponible();
    this.filtrarSoloMes2();
    this.filtrarSoloMes1();
    this.diasNoHabilArray();
    this.ordenarTotalHoras();
    this.totalMayores();

    console.log('ulitmo', this.jsonDataPlanService);
    console.log('ulitmoCS', this.jsonDataPlanServiceCS);

  }

    agregaFechas(){

    let i = 0;
    // Se recorre planificacion para ir agregando el arreglo mes1 con todos los dias del mes1
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
      let x = 0;
      let mes1 = [];
      for (const dia of this.dias) {
        let diaF = moment(dia.diaN).format('DD-MM-YYYY');
        mes1.push({'fecha' : diaF, 'total': 0});
        x++;
      }
      this.jsonDataPlanService['Detalle Horas Planificadas'][i] = {...this.jsonDataPlanService['Detalle Horas Planificadas'][i], mes1};
      i++;
    }

    // Se recorre planificacion para ir agregando el arreglo mes2 con todos los dias del mes2
    i = 0;
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
      let x = 0;
      let mes2 = [];
      for (const dia of this.dias2) {
        let diaF = moment(dia.diaN2).format('DD-MM-YYYY');
        mes2.push({'fecha' : diaF, 'total': 0});
        x++;
      }
      this.jsonDataPlanService['Detalle Horas Planificadas'][i] = {...this.jsonDataPlanService['Detalle Horas Planificadas'][i], mes2};
      i++;
    }
  }

  sumaHH(){
    // Se recorre planificacion obteniendo la fecha de planificacion y compararla con las fechas del mes1,
    // si son iguales se agrega la cantidad de horas al mes1.total o al mes2.total segun corresponda.
    for (let plan of this.jsonDataPlanService['Detalle Horas Planificadas']) {
        let fecha = moment(plan.fechaPlanificada).format('DD-MM-YYYY');
        for (const planMes1 of plan.mes1) {
          if (fecha === planMes1.fecha){
            planMes1.total = plan.horasPlanificadas;
          }
        }

        for (const planMes2 of plan.mes2) {
          if (fecha === planMes2.fecha){
            planMes2.total = plan.horasPlanificadas;
          }
        }
      }
  }

  ordenarPorARS(){
    // Se ordena planificacion por numero de ARS
    this.jsonDataPlanService['Detalle Horas Planificadas'].sort((a, b) => {
      return a.numeroArs - b.numeroArs;
    });
  }

  agruparARS(){
    // Se agrupan todas las planificacaiones por numero de ars,
    // si son iguales los ars se van sumando las horas de mes1 y mes2 para dejar en un unico registro toda la suma de los meses.
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
          }
        }
        i++;
        // Se guarda el ultimo registro ya que se estaba perdiendo
        if (i === maximo - 1 ){
          this.planAgrupado.push(planPadre);
        }
      }
    this.planAgrupado.splice(0, 1);
    this.jsonDataPlanService = this.planAgrupado;

    }

    totalesMes(){
      // se recorre planificacion agrupada y se suman todas las horas de cada dia de mes1 y mes2,
      // creando una nueva variable para cada mes con el total de horas
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

        if (plan.numeroArs == 2732){
          plan.mes2.totalMes2 = 180;
        }
      }
    }

    obtieneDiasHabiles(){

      this.capacidadporDia = [];
      this.capacidadporDia2 = [];
      this.totalDisponible = 0;
      for (const dia of this.dias) {
        // let diaN = `dia${x + 1}`;
        let diaF = moment(dia.diaN).format('YYYY-MM-DD');
        this.capacidadporDia.push({'fecha' : diaF, 'total': 0, 'habil': true});

      }
      for (const dia of this.dias2) {
        // let diaN = `dia${x + 1}`;
        let diaF = moment(dia.diaN2).format('YYYY-MM-DD');
        this.capacidadporDia2.push({'fecha' : diaF, 'total': 0, 'habil': true});

      }

      // se recorre arreglo de capacidad para ir detectanto si es sabado  o domingo y marcar el dia como no habil.
      for (let dia of this.capacidadporDia) {
        let diaS = Number(moment(dia.fecha).day());
        if (diaS === 0 || diaS === 6){
            dia.habil = false;
        }
      }
      for (let dia of this.capacidadporDia2) {
        let diaS = Number(moment(dia.fecha).day());
        if (diaS === 0 || diaS === 6){
            dia.habil = false;
        }
      }
      // se recorre arreglo de capadidad para ir detectando si es feriado y marcar dia como no habil.
      console.log('arreglo', this.feriados);
      for (let dia of this.capacidadporDia) {
        for (const feriado of this.feriados) {
            if (dia.fecha === feriado.fecha){
                dia.habil = false;
            }
        }
      }
      for (let dia of this.capacidadporDia2) {
        for (const feriado of this.feriados) {
            if (dia.fecha === feriado.fecha){
                dia.habil = false;
            }
        }
      }

      // se recorre arreglo para contar cuantos dias quedaron como habiles
      this.cantDiasHabiles = 0;
      for (const dia of this.capacidadporDia) {
        if (dia.habil){
          this.cantDiasHabiles = this.cantDiasHabiles + 1;
        }
      }

      this.cantDiasHabiles2 = 0;
      for (const dia of this.capacidadporDia2) {
        if (dia.habil){
          this.cantDiasHabiles2 = this.cantDiasHabiles2 + 1;
        }
      }
      // console.log( this.cantDiasHabiles);
      // console.log( this.cantDiasHabiles2);

      // Busca ulitmo dia habil del mes 1
      let i = 0;
      for (const dia of this.capacidadporDia) {
       if (dia.habil){
         this.ultDiaHabil = i;
       }
       i++;
      }
      // console.log( this.ultDiaHabil );
    }

    CSlineaBase(){
      // console.log(this.capacidadporDia);
      // Se recorre planificaciones identificando las descripciones que comienzan con CS (Capacity Service),
      // Si con comienzan con CS se saca la diferencia entre 180hrs y lo planificado, para luego descontar/sumar del ultimo dia planificado.
      for (let plan of this.jsonDataPlanService) {
        if (plan.descripcion.substr(0, 2) === 'CS'){
            let totalMes1 = 0;
            let totalMes2 = 0;

            for (const planMes1 of plan.mes1) {
              totalMes1 = totalMes1 + planMes1.total;
            }

            if (totalMes1 > 180 && totalMes1 > 0) {
              let ultDia = this.ultDiaHabil;;
              let dif = totalMes1 - 180;
              plan.mes1[ultDia].total =  plan.mes1[ultDia].total - dif;

              // let ultDia = plan.mes1.length;
              // let dif = totalMes1 - 180;
              // plan.mes1[ultDia - 1].total =  plan.mes1[ultDia - 1].total - dif;

            }

            if (totalMes1 < 180 && totalMes1 > 0 && totalMes1 > (this.cantDiasHabiles * 9)) {
              let ultDia = this.ultDiaHabil;
              let dif = 180 - totalMes1;
              plan.mes1[ultDia].total =  plan.mes1[ultDia].total + dif;
              // let ultDia = plan.mes1.length;
              // let dif = 180 - totalMes1;
              // plan.mes1[ultDia - 1].total =  plan.mes1[ultDia - 1].total + dif;

            }

            for (const planMes2 of plan.mes2) {
              totalMes2 = totalMes2 + planMes2.total;
            }

            if (totalMes2 > 180 && totalMes2 > 0) {
              let ultDia = plan.mes2.length;
              let dif = totalMes2 - 180;
              plan.mes2[ultDia - 1].total =  plan.mes2[ultDia - 1].total - dif;

            }

            if (totalMes2 < 180 && totalMes2 > 0 && totalMes2 > (this.cantDiasHabiles2 * 9)) {
              let ultDia = plan.mes2.length;
              let dif = 180 - totalMes2;
              plan.mes2[ultDia - 1].total =  plan.mes2[ultDia - 1].total + dif;

            }
        }
      }

    }

    filtrarMantenimientoBolsas(){
      console.log('filtrarMantenimientoBolsas');
      this.horasMttoBO1 = 0;
      this.horasMttoBO2 = 0;
      this.horasMttoBE1 = 0;
      this.horasMttoBE2 = 0;
      this.horasMttoBO1Real = 0;
      this.horasMttoBO2Real = 0;
      this.horasMttoBE1Real = 0;
      this.horasMttoBE2Real = 0;
      this.totalHorasMtto1 = 0;
      this.totalHorasMtto2 = 0;

      let jsonDataMttoBO = [...this.jsonDataPlanService];

      this.jsonDataPlanMttoBO = jsonDataMttoBO.filter(a => {
        return a.tipoContrato === 'Mantenimiento' &&  a.lineaDeServicio === 'Capacity' && a.area === 'Backoffice';
      });

      let jsonDataMttoBE = [...this.jsonDataPlanService];

      this.jsonDataPlanMttoBE = jsonDataMttoBE.filter(a => {
        return a.tipoContrato === 'Mantenimiento' && a.lineaDeServicio === 'Capacity' && a.area === 'Backend';
      });

      console.log(this.jsonDataPlanMttoBO);
      console.log(this.jsonDataPlanMttoBE);


      if (this.jsonDataPlanMttoBO.length > 0){
        for (const plan of this.jsonDataPlanMttoBO) {
          // let fechaAsignacion = moment(plan.fechaAsignacion);
          let fecha = moment(plan.fechaAsignacion).format('DD-MM-YYYY');
          let fechaMes1 = moment(this.inicioMes).format('DD-MM-YYYY');
          let fechaMes2 = moment(this.inicioMes2).format('DD-MM-YYYY');
          // console.log(fecha);
          // console.log(fechaMes1);

         if(fecha == fechaMes1){
          //  console.log('entro1');
          this.horasMttoBO1 = this.horasMttoBO1 + plan.mes1.totalMes1;
         }

         if(fecha == fechaMes2){
          //  console.log('entro2');
          this.horasMttoBO2 = this.horasMttoBO2 + plan.mes2.totalMes2;
         }


        }
    }

      if (this.jsonDataPlanMttoBE.length > 0){
        for (const plan of this.jsonDataPlanMttoBE) {
          // let fechaAsignacion = moment(plan.fechaAsignacion);
          let fecha = moment(plan.fechaAsignacion).format('DD-MM-YYYY');
          let fechaMes1 = moment(this.inicioMes).format('DD-MM-YYYY');
          let fechaMes2 = moment(this.inicioMes2).format('DD-MM-YYYY');
          // console.log(fecha);
          // console.log(fechaMes1);

         if(fecha == fechaMes1){
          //  console.log('entro1');
          this.horasMttoBE1 = this.horasMttoBE1 + plan.mes1.totalMes1;
         }

         if(fecha == fechaMes2){
          //  console.log('entro2');
          this.horasMttoBE2 = this.horasMttoBE2 + plan.mes2.totalMes2;
         }


        }
    }
    console.log(this.horasMttoBO1);
    console.log(this.horasMttoBO2);
    console.log(this.horasMttoBE2);
    console.log(this.horasMttoBE2);

    this.totalHorasMtto1 = this.horasMttoBO1 + this.horasMttoBE1;
    this.totalHorasMtto2 =  this.horasMttoBO2 + this.horasMttoBE2;
      // if (this.jsonDataPlanMttoBO.length > 0){
      //   if(this.jsonDataPlanMttoBO.fechaAsignacion == this.inicioMes)
      //   this.horasMttoBO1 = this.jsonDataPlanMttoBO[0].mes1.totalMes1;
      //   console.log('entro');
      //   // this.horasMttoBO2 = this.jsonDataPlanMttoBO[0].mes2.totalMes2;
      // }

      // if (this.jsonDataPlanMttoBE.length > 0){
      //   this.horasMttoBE1 = this.jsonDataPlanMttoBE[0].mes1.totalMes1;
      //   this.horasMttoBE2 = this.jsonDataPlanMttoBE[0].mes2.totalMes2;
      // }

      // this.horasMttoBO1 = this.jsonDataPlanMttoBO[0].mes1.totalMes1 * 9;
      // this.horasMttoBO2 = this.jsonDataPlanMttoBO[0].mes2.totalMes2 * 9;
      // this.horasMttoBE1 = this.jsonDataPlanMttoBE[0].mes1.totalMes1 * 9;
      // this.horasMttoBE2 = this.jsonDataPlanMttoBE[0].mes2.totalMes2 * 9;

      // this.totalHorasMtto1 = this.horasMttoBO1 + this.horasMttoBE1;
      // this.totalHorasMtto2 =  this.horasMttoBO2 + this.horasMttoBE2;

    }

    filtrarMantenimientoReal(){

      // let jsonDataMttoBOReal = [...this.jsonDataPlanService];
      // this.jsonDataPlanMttoBOReal = jsonDataMttoBOReal.filter(a => {
      //   return a.tipoContrato === 'Mantenimiento' && a.lineaDeServicio !== 'General' && a.grupoDeTrabajoAsignado === 'Mantenimiento - Keyciren Trigo';
      // });

      // console.log('jsonDataPlanMttoBOReal',this.jsonDataPlanMttoBOReal);

      // let jsonDataMttoBEReal = [...this.jsonDataPlanService];
      // this.jsonDataPlanMttoBEReal = jsonDataMttoBEReal.filter(a => {
      //   return a.tipoContrato === 'Mantenimiento' && a.lineaDeServicio !== 'General' && a.grupoDeTrabajoAsignado === 'Mantenimiento - Iñigo Navarro';
      // });
      // console.log('jsonDataPlanMttoBEReal', this.jsonDataPlanMttoBEReal);

    }

    sumarMantenimientoReal(){

      // for (const plan of this.jsonDataPlanMttoBOReal) {

      // this.horasMttoBO1Real = this.horasMttoBO1Real + plan.mes1.totalMes1;
      // this.horasMttoBO2Real =  this.horasMttoBO2Real + plan.mes2.totalMes2;
      // }

      // for (const plan of this.jsonDataPlanMttoBEReal) {

      // this.horasMttoBE1Real = this.horasMttoBE1Real + plan.mes1.totalMes1;
      // this.horasMttoBE2Real =  this.horasMttoBE2Real + plan.mes2.totalMes2;
      // }

      // // Variables definitivas para mostrar en capacity

      // this.horasMttoBO1 = this.horasMttoBO1 + this.horasMttoBO1Real;
      // this.horasMttoBO2 = this.horasMttoBO2 + this.horasMttoBO2Real;
      // this.horasMttoBE1 = this.horasMttoBE1 + this.horasMttoBE1Real;
      // this.horasMttoBE2 = this.horasMttoBE2 + this.horasMttoBE2Real;

      // this.totalHorasMtto1 = this.horasMttoBO1 + this.horasMttoBE1;
      // this.totalHorasMtto2 =  this.horasMttoBO2 + this.horasMttoBE2;

    }


    filtrarCS(){
      // se mantienen solo los registros que son Evolutivo Mayor o Asesoramiento y Consulta
      this.jsonDataPlanService = this.jsonDataPlanService.filter(a => {
        return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Asesoramiento y Consulta';
      });

    }

    ordenarPorARSCS(){
      // se crear nuevo arreglo desde el plan, se filtra solo lo Capacity Service y se ordena por ARS.
      let jsonDataCS = [...this.jsonDataPlanService];
      this.jsonDataPlanServiceCS = jsonDataCS.filter(a => {
        return a.lineaDeServicio === 'Capacity Service' &&  a.numeroArs !== 434;
      });

      this.jsonDataPlanServiceCS.sort((a, b) => {
        return a.numeroArs - b.numeroArs;
      });
    }

    totalEjecucion(){
      // se recorren los arreglos para ir sumando todas las horas y asi obtener el total de todo el mes1 y mes 2;
      this.totalMes1 = 0;
      this.totalMes2 = 0;
      for (let plan of this.jsonDataPlanService) {
        this.totalMes1 = this.totalMes1 + plan.mes1.totalMes1;
        this.totalMes2 = this.totalMes2 + plan.mes2.totalMes2;
      }

    }

    totalEjecucionCS(){
      // se recorren los arreglos para ir sumando todas las horas y asi obtener el total de todo el mes1 y mes 2;
      this.totalMes1CS = 0;
      this.totalMes2CS = 0;

      for (let planCS of this.jsonDataPlanServiceCS) {
        this.totalMes1CS = this.totalMes1CS + planCS.mes1.totalMes1;
        this.totalMes2CS = this.totalMes2CS + planCS.mes2.totalMes2;
      }
    }

    totalporDia(){
      // se crear arreglo con todos los dias del mes1
      const total = 0;
      this.totalDia = [];
      for (const dia of this.dias) {
        let diaF = moment(dia.diaN).format('DD-MM-YYYY');
        this.totalDia.push({diaF, total: 0});
      }

      // se recorre planificacionen para ir sumando por dia cada ars y dejarlo en el arreglo de totales por dia.
      for (const plan of this.jsonDataPlanService) {
        for (let i = 0; i < plan.mes1.length; i++) {
          this.totalDia[i].total = this.totalDia[i].total + plan.mes1[i].total;
        }
      }
    }

    capacidadDisponible(){
      // se crear arreglo con capacidad disponible por dia y se llena con cada dia del mes1
      // this.capacidadporDia = [];
      // this.capacidadporDia2 = [];
      this.totalDisponible = 0;
      // for (const dia of this.dias) {
      //   // let diaN = `dia${x + 1}`;
      //   let diaF = moment(dia.diaN).format('YYYY-MM-DD');
      //   this.capacidadporDia.push({'fecha' : diaF, 'total': 0, 'habil': true});

      // }
      // for (const dia of this.dias2) {
      //   // let diaN = `dia${x + 1}`;
      //   let diaF = moment(dia.diaN2).format('YYYY-MM-DD');
      //   this.capacidadporDia2.push({'fecha' : diaF, 'total': 0, 'habil': true});

      // }

      // // se recorre arreglo de capacidad para ir detectanto si es sabado  o domingo y marcar el dia como no habil.
      // for (let dia of this.capacidadporDia) {
      //   let diaS = Number(moment(dia.fecha).day());
      //   if (diaS === 0 || diaS === 6){
      //       dia.habil = false;
      //   }
      // }
      // for (let dia of this.capacidadporDia2) {
      //   let diaS = Number(moment(dia.fecha).day());
      //   if (diaS === 0 || diaS === 6){
      //       dia.habil = false;
      //   }
      // }
      // // se recorre arreglo de capadidad para ir detectando si es feriado y marcar dia como no habil.
      // for (let dia of this.capacidadporDia) {
      //   for (const feriado of this.feriados) {
      //       if (dia.fecha === feriado.fecha){
      //           dia.habil = false;
      //       }
      //   }
      // }
      // for (let dia of this.capacidadporDia2) {
      //   for (const feriado of this.feriados) {
      //       if (dia.fecha === feriado.fecha){
      //           dia.habil = false;
      //       }
      //   }
      // }

      // // se recorre arreglo para contar cuantos dias quedaron como habiles
      // this.cantDiasHabiles = 0;
      // for (const dia of this.capacidadporDia) {
      //   if (dia.habil){
      //     this.cantDiasHabiles = this.cantDiasHabiles + 1;
      //   }
      // }

      // this.cantDiasHabiles2 = 0;
      // for (const dia of this.capacidadporDia2) {
      //   if (dia.habil){
      //     this.cantDiasHabiles2 = this.cantDiasHabiles2 + 1;
      //   }
      // }
      // console.log(cantDiasHabiles);
      // console.log(cantDiasHabiles2);
      // console.log(this.capacidadporDia2);
    // se calcula horas por dia disponibles
      let HHporDias = (8910 -  this.totalHorasMtto1) / this.cantDiasHabiles;
      let difHH = (HHporDias - Math.round(HHporDias)) * this.cantDiasHabiles;

      // se recorre arreglo de capacidad para ir agregando la cantidad de horar por dia redondeada
      let x = 0;
      for (let dia of this.capacidadporDia) {
        if (dia.habil){
          dia.total = Math.round(HHporDias);
          // si llegamos al ulitmo dia habil se suma o resta la diferencia perdida por el redondeo.
          if ((x + 1 ) == this.cantDiasHabiles){
            dia.total = dia.total + difHH;
          }
          this.totalDisponible = this.totalDisponible + dia.total;
          x++;
        }
      }

    }

    totCapacidadDisponible(){
      // se crear arreglo para guardar y llena con fechas mes 1
      this.TotalcapacidadporDia = [];
      this.totalTotal = 0;
      for (const dia of this.dias) {
        let diaF = moment(dia.diaN).format('YYYY-MM-DD');
        this.TotalcapacidadporDia.push({'fecha' : diaF, 'total': 0});
      }

      // se recorre nuevo arreglo para ir guardando la diferencia entre lo total planificado por dia y la capcidad disponible por dia.
      for (let i = 0; i < this.TotalcapacidadporDia.length; i++) {
        this.TotalcapacidadporDia[i].total = this.capacidadporDia[i].total - this.totalDia[i].total;
        this.totalTotal = this.totalTotal + this.TotalcapacidadporDia[i].total;
      }
    }

    filtrarSoloMes1(){
      // se mantienen solo los registros que tienen horas en el mes1
      this.jsonDataPlanService = this.jsonDataPlanService.filter(a => {
        return a.mes1.totalMes1 > 0;
      });
    }

    filtrarSoloMes2(){
      // se crear nuevo arreglo desde el plan, se filtra solo con el mes 2
      let jsonData2 = [...this.jsonDataPlanService];
      this.jsonDataPlanService2 = jsonData2.filter(a => {
        return a.mes2.totalMes2 > 0;
      });
    }

    diasNoHabilArray(){
      // se copia calendario del mes con dias habiles y se dejan solo los no habiles
       this.diasNH = [];
       let diasNoHabil = [...this.capacidadporDia];
       this.diasNoHabil = diasNoHabil.filter(a => {
        return !a.habil;
       });
      // se crea nueva variable en formato DD-MM-YYY
       for (const dia of this.diasNoHabil) {
          let diaF = moment(dia.fecha).format('DD-MM-YYYY');
          dia.fecha2 = diaF;
       }

       for (const dia of this.diasNoHabil) {
        this.diasNH.push(dia.fecha2);
       }
      //  console.log(this.diasNoHabil);
      //  console.log(this.diasNH);
      //  console.log('jsonDataPlan', this.jsonDataPlanService);
    }

    ordenarTotalHoras(){
      // se crear nuevo arreglo desde el plan, se eliminan los meses que tengan cero horas y se ordena por cantidad de horas de mayor a menor.
      let jsonData1 = [...this.jsonDataPlanService];

      this.jsonDataMayores1 = jsonData1.filter(a => {
        return a.mes1.totalMes1 > 0;
      });

      this.jsonDataMayores1.sort((a, b) => {
        return b.mes1.totalMes1 - a.mes1.totalMes1;
      });

      this.jsonDataMayores1 = this.jsonDataMayores1.slice(0,10);
      console.log("Mayores");
      console.log(this.jsonDataMayores1);

      

      let jsonData2 = [...this.jsonDataPlanService2];
      this.jsonDataMayores2 = jsonData2.filter(a => {
        return a.mes2.totalMes2 > 0;
      });

      this.jsonDataMayores2.sort((a, b) => {
        return b.mes2.totalMes2 - a.mes2.totalMes2;
      });
      this.jsonDataMayores2 = this.jsonDataMayores2.slice(0,10);
      console.log("Mayores2");
      console.log(this.jsonDataMayores2);


    }

    totalMayores(){
      // se recorren los arreglos para ir sumando todas las horas y asi obtener el total de todo el mes1 y mes 2;
      this.totalMes1Mayores = 0;
      this.totalMes2Mayores = 0;

      for (let planMayor of this.jsonDataMayores1) {
        this.totalMes1Mayores = this.totalMes1Mayores + planMayor.mes1.totalMes1;      }

      for (let planMayor of this.jsonDataMayores2) {
          this.totalMes2Mayores = this.totalMes2Mayores + planMayor.mes2.totalMes2;    }

          console.log(this.totalMes1Mayores);
          console.log(this.totalMes2Mayores);
    }

}
