import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { FeriadosChileService } from './feriados-chile.service';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class CapacityService {

  jsonDataPlanService;
  jsonDataPlanService2;
  jsonDataPlanServiceCS;
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
  totalDia = [];
  feriados = [];
  capacidadporDia = [];
  TotalcapacidadporDia = [];
  totalTotal = 0;
  totalDisponible = 0;
  horasMtto = 0;

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
      this.sweetService.mensajeError('Error al obtener productos', err);
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
    this.CSlineaBase();
    this.totalesMes();
    this.ordenarPorARSCS();
    this.filtrarCS();
    this.totalEjecucion();
    this.totalporDia();
    this.capacidadDisponible();
    this.totCapacidadDisponible();
    this.filtrarSoloMes2();
    this.filtrarSoloMes1();
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
        if (i == maximo - 1 ){
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

    CSlineaBase(){
      // Se recorre planificaciones identificando las descripciones que comienzan con CS (Capacity Service),
      // Si con comienzan con CS se saca la diferencia entre 180hrs y lo planificado, para luego descontar/sumar del ultimo dia planificado.
      for (let plan of this.jsonDataPlanService) {
        if (plan.descripcion.substr(0, 2) === 'CS'){
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
        }
      }

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
      this.totalMes1CS = 0;
      this.totalMes2CS = 0;
      for (let plan of this.jsonDataPlanService) {
        this.totalMes1 = this.totalMes1 + plan.mes1.totalMes1;
        this.totalMes2 = this.totalMes2 + plan.mes2.totalMes2;
      }

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
      this.capacidadporDia = [];
      this.totalDisponible = 0;
      for (const dia of this.dias) {
        // let diaN = `dia${x + 1}`;
        let diaF = moment(dia.diaN).format('YYYY-MM-DD');
        this.capacidadporDia.push({'fecha' : diaF, 'total': 0, 'habil': true});

      }

      // se recorre arreglo de capacidad para ir detectanto si es sabado  o domingo y marcar el dia como no habil.
      for (let dia of this.capacidadporDia) {
        let diaS = Number(moment(dia.fecha).day());
        if (diaS == 0 || diaS == 6){
            dia.habil = false;
        }
      }
      // se recorre arreglo de capadidad para ir detectando si es feriado y marcar dia como no habil.
      for (let dia of this.capacidadporDia) {
        for (const feriado of this.feriados) {
            if (dia.fecha == feriado.fecha){
                dia.habil = false;
            }
        }
      }

      // se recorre arreglo para contar cuantos dias quedaron como habiles
      let cantDiasHabiles = 0;
      for (const dia of this.capacidadporDia) {
        if (dia.habil){
          cantDiasHabiles = cantDiasHabiles + 1;
        }
      }

    // se calcula horas por dia disponibles
      let HHporDias = (8910 -  this.horasMtto) / cantDiasHabiles;
      let difHH = (HHporDias - Math.round(HHporDias)) * cantDiasHabiles;

      // se recorre arreglo de capacidad para ir agregando la cantidad de horar por dia redondeada
      let x = 0;
      for (let dia of this.capacidadporDia) {
        if (dia.habil){
          dia.total = Math.round(HHporDias);
          // si llegamos al ulitmo dia habil se suma o resta la diferencia perdida por el redondeo.
          if ((x + 1 ) == cantDiasHabiles){
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
      console.log('mes2',  this.jsonDataPlanService2);
    }
}
