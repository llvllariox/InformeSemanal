import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import { SlaJsonDataService } from 'src/app/services/sla-json-data.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { JspdfService } from '../../services/jspdf.service';
import { FeriadosChileService } from '../../services/feriados-chile.service';

@Component({
  selector: 'app-sla-generar',
  templateUrl: './sla-generar.component.html'
})
export class SlaGenerarComponent implements OnInit {
  jsonDataReqInf: any;
  JsonArray: [] = [];
  JsonArrayPE1: [] = [];
  JsonArrayPE2: [] = [];
  JsonArrayPE3: [] = [];
  JsonArrayPE6: [] = [];

  JsonArrayPM1: [] = [];
  JsonArrayPM2: [] = [];

  JsonArrayPI1: [] = [];
  JsonArrayPI2: [] = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fechaInformeDate;

  cantidadPE1;
  cantidadOKPE1;
  cantidadNOOKPE1;
  SLAPE1;

  cantidadPE2;
  cantidadOKPE2;
  cantidadNOOKPE2;
  SLAPE2;

  cantidadPE3;
  cantidadOKPE3;
  cantidadNOOKPE3;
  SLAPE3;

  cantidadPE6;
  cantidadOKPE6;
  cantidadNOOKPE6;
  SLAPE6;

  cantidadPM1;
  cantidadOKPM1;
  cantidadNOOKPM1;
  SLAPM1;

  cantidadPM2;
  cantidadOKPM2;
  cantidadNOOKPM2;
  SLAPM2;

  cantidadPI1;
  cantidadOKPI1;
  cantidadNOOKPI1;
  SLAPI1;

  cantidadPI2;
  cantidadOKPI2;
  cantidadNOOKPI2;
  SLAPI2;

  private feriados = [];

  flag = 0;

  constructor(public jsonDataService: SlaJsonDataService, private route: ActivatedRoute, public pdfService: JspdfService, private sweetAlerService: SweetAlertService, private feriadosService: FeriadosChileService) {
    this.feriados = feriadosService.getFeriados(); 

    this.fechaInformeDate = new Date(jsonDataService.getFechaInforme());
    this.cantidadPE1 = 0;
    this.cantidadOKPE1 = 0;
    this.cantidadNOOKPE1 = 0;
    this.SLAPE1 = 0;

    this.cantidadPE2 = 0;
    this.cantidadOKPE2 = 0;
    this.cantidadNOOKPE2 = 0;
    this.SLAPE2 = 0;

    this.cantidadPE3 = 0;
    this.cantidadOKPE3 = 0;
    this.cantidadNOOKPE3 = 0;
    this.SLAPE3 = 0;

    this.cantidadPE6 = 0;
    this.cantidadOKPE6 = 0;
    this.cantidadNOOKPE6 = 0;
    this.SLAPE1 = 0;

    this.cantidadPM1 = 0;
    this.cantidadOKPM1 = 0;
    this.cantidadNOOKPM1 = 0;
    this.SLAPM1 = 0;

    this.cantidadPM2 = 0;
    this.cantidadOKPM2 = 0;
    this.cantidadNOOKPM2 = 0;
    this.SLAPM2 = 0;

    this.cantidadPI1 = 0;
    this.cantidadOKPI1 = 0;
    this.cantidadNOOKPI1 = 0;
    this.SLAPI1 = 0;
    
    this.cantidadPI2 = 0;
    this.cantidadOKPI2 = 0;
    this.cantidadNOOKPI2 = 0;
    this.SLAPI2 = 0;

    if(this.jsonDataService.jsonDataReqPE1Service !== undefined) {
      this.JsonArrayPE1 = this.jsonDataService.getJsonDataReqPE1Service();
      this.getPE1();
    }

    if(this.jsonDataService.jsonDataReqPE2Service !== undefined) {
      this.JsonArrayPE2 = this.jsonDataService.getJsonDataReqPE2Service();
      this.getPE2();
    }

    if(this.jsonDataService.jsonDataReqPE3Service !== undefined) {
      this.JsonArrayPE3 = this.jsonDataService.getJsonDataReqPE3Service();
      this.getPE3();
    }

    if(this.jsonDataService.jsonDataReqPE6Service !== undefined) {
      this.JsonArrayPE6 = this.jsonDataService.getJsonDataReqPE6Service();
      this.getPE6();
    }

    if(this.jsonDataService.jsonDataReqPM1Service !== undefined) {
      this.JsonArrayPM1 = this.jsonDataService.getJsonDataReqPM1Service();
      this.getPM1();
    }

    if(this.jsonDataService.jsonDataReqPM2Service !== undefined) {
      this.JsonArrayPM2 = this.jsonDataService.getJsonDataReqPM2Service();
      this.getPM2();
    }

    if(this.jsonDataService.jsonDataReqPI1Service !== undefined) {
      this.JsonArrayPI1 = this.jsonDataService.getJsonDataReqPI1Service();
      this.getPI1();
    }

    if(this.jsonDataService.jsonDataReqPI2Service !== undefined) {
      this.JsonArrayPI2 = this.jsonDataService.getJsonDataReqPI2Service();
      this.getPI2();
    }
  }

  ngOnInit(): void {
  }

  getPE1(){
    this.cantidadPE1 = this.JsonArrayPE1.length;
    
    //Cumplen los que  Fecha Recepción VS Fec. Real Estimación <= 5 días hábiles
    
    let cantOk = 0;
    this.JsonArrayPE1.forEach(function(valor, index){
      let fechaRecepcion = new Date(valor['fechaRecepcion']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);

      let fechaIni;
      let fechaFin;

      if(fechaRecepcion < fecRealEstimacion){ 
        fechaIni = fechaRecepcion;
        fechaFin = fecRealEstimacion;
      } else {
        fechaIni = fecRealEstimacion;
        fechaFin = fechaRecepcion;
      }

      let contador = 0;
      for(let i=fechaIni; i<fechaFin; i.setDate(i.getDate()+1)){
        let fechaString = i.getDate()+ "/" + (i.getMonth()+Number(1)) + "/" + i.getFullYear();
        //console.log(fechaString + ' - ' + this.esHabil(i));
        if(this.esHabil(i)){
          contador++;
        }
      }

      let cantDiasHabiles = 2;
      //console.log(valor['nroReq']+ ' - ' + contador);
      if(contador>=cantDiasHabiles){
        //cumple
        //console.log(valor['nroReq']+ ' - ' + contador);
        this.JsonArrayPE1[index]['cumple']=1;
      } else {
        this.JsonArrayPE1[index]['cumple']=0;
      }

      cantOk += (contador>=cantDiasHabiles) ? 1 : 0; 
    }, this);
    this.cantidadOKPE1 = cantOk;

    this.cantidadNOOKPE1 = this.cantidadPE1 - this.cantidadOKPE1;

    if(this.cantidadPE1 != 0) {
      this.SLAPE1 = this.cantidadOKPE1 * 100 / this.cantidadPE1;  
    }
    else {
      this.SLAPE1 = 100;  
    }
  }

  getPE2(){
    this.cantidadPE2 = this.JsonArrayPE2.length;

    //Cumplen los que Fec. Real Pase Aprobación <= Fec. Plan. Pase Aprobación.
    let cantOk = 0;
    this.JsonArrayPE2.forEach(function(valor){
      let fecRealPaseAprobacion = new Date(valor['fecRealPaseAprobacion']);
      let fecPlanPaseAprobacion = new Date(valor['fecPlanPaseAprobacion']);

      cantOk += (fecRealPaseAprobacion <= fecPlanPaseAprobacion) ? 1 : 0;
    });
    this.cantidadOKPE2 = cantOk;
    
    this.cantidadNOOKPE2 = this.cantidadPE2 - this.cantidadOKPE2;

    if(this.cantidadPE2 != 0) {
      this.SLAPE2 = this.cantidadOKPE2 * 100 / this.cantidadPE2;  
    }
    else {
      this.SLAPE2 = 100;  
    }
  }

  getPE3(){
    this.cantidadPE3 = this.JsonArrayPE3.length;

    //cumplen las que Horas Incurridas <= Horas Estimadas
    let cantOk = 0;
    this.JsonArrayPE3.forEach(function(valor){
        cantOk += (valor['horasIncurridas'] <= valor['horasEstimadas']) ? 1 : 0;
    });
    this.cantidadOKPE3 = cantOk;

    this.cantidadNOOKPE3 = this.cantidadPE3 - this.cantidadOKPE3;

    //SLA
      if(this.cantidadPE3 != 0) {
      this.SLAPE3 = this.cantidadOKPE3 * 100 / this.cantidadPE3;  
    }
    else {
      this.SLAPE3 = 100;  
    }
  }

  getPE6(){
    this.cantidadPE6 = this.JsonArrayPE6.length;

    //Cumplen los que  Fec. Real Pase Producción <=  Fec. Plan. Pase Producción.
    let cantOk = 0;
    this.JsonArrayPE6.forEach(function(valor){
      let fecRealPaseProduccion = new Date(valor['fecRealPaseProduccion']);
      let fecPlanPaseProduccion = new Date(valor['fecPlanPaseProduccion']);
      
      cantOk += (fecRealPaseProduccion <= fecPlanPaseProduccion) ? 1 : 0;
    });
    this.cantidadOKPE6 = cantOk;

    this.cantidadNOOKPE6 = this.cantidadPE6 - this.cantidadOKPE6;

    if(this.cantidadPE6 != 0) {
      this.SLAPE6 = this.cantidadOKPE6 * 100 / this.cantidadPE6;  
    }
    else {
      this.SLAPE6 = 100;  
    }
  }

  getPM1(){
    this.cantidadPM1 = this.JsonArrayPM1.length;

    //se cuentan la cantidad de días desde Fecha Recepción 
    //hasta Fec.Real Estimación <= 11 días.
    let cantOk = 0;

    this.JsonArrayPM1.forEach(function(valor){
      let fechaRecepcion = new Date(valor['fechaRecepcion']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);
        cantOk += ((((fecRealEstimacion.getTime() - fechaRecepcion.getTime())) *(1000*60*60*24)) <= 11 ) ? 1 : 0;
    });
    this.cantidadOKPM1 = cantOk;

    this.cantidadNOOKPM1 = this.cantidadPM1 - this.cantidadOKPM1;

    //SLA
      if(this.cantidadPM1 != 0) {
      this.SLAPM1 = this.cantidadOKPM1 * 100 / this.cantidadPM1;  
    }
    else {
      this.SLAPM1 = 100;  
    }
  }

  getPM2(){
    this.cantidadPM2 = this.JsonArrayPM2.length;

    //Fec. Real Inicio vs Fec.Real Estimación <= 2 días.
    let cantOk = 0;

    this.JsonArrayPM2.forEach(function(valor){
      let fecRealInicio = new Date(valor['fecRealInicio']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);
        cantOk += ((((fecRealInicio.getTime() - fecRealEstimacion.getTime())) *(1000*60*60*24)) <= 11 ) ? 1 : 0;
    });
    this.cantidadOKPM2 = cantOk;

    this.cantidadNOOKPM2 = this.cantidadPM2 - this.cantidadOKPM2;

    //SLA
      if(this.cantidadPM2 != 0) {
      this.SLAPM2 = this.cantidadOKPM2 * 100 / this.cantidadPM2;  
    }
    else {
      this.SLAPM2 = 100;  
    }
  }

  
  getPI1(){
    //PI1: Cumplimiento de Plazo en Resolución de Incidencia, se cuentan y se informa
    this.cantidadPI1 = this.JsonArrayPI1.length;
    this.cantidadOKPI1 = this.cantidadPI1;
    this.cantidadNOOKPI1 = 0;
    this.SLAPI1 = 100;
  }

  getPI2(){
    //se repite PI1
    this.cantidadPI2 = this.cantidadPI1;
    this.cantidadOKPI2 = this.cantidadPI2;
    this.cantidadNOOKPI2 = 0;
    this.SLAPI2 = 100;
  }

  //true si la fecha es habil
  esHabil(fecha: Date){
   
    //sábado o domingo
    if(fecha.getDay()===0 || fecha.getDay()===6){
      return false;
    }

    /*
    if(this.flag == 0){
    this.feriados.push('2021-08-27');
    this.flag = 1;
    }
    */
  
   for(const feriado of this.feriados){
    let f = new Date(feriado + 'T00:00:00');
    if(f.getTime()==fecha.getTime()){
      return false;
    }
   }

/*
    this.feriados.forEach(element => {
      let f = new Date(element + 'T00:00:00');

      if(f.getTime()==fecha.getTime()){
        console.log(f);
        return false;
      }
    }, this);
*/
    return true;
  }
}