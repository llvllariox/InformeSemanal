import { Component, OnInit } from '@angular/core';
import { SlaJsonDataService } from 'src/app/services/sla-json-data.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { JspdfService } from '../../services/jspdf.service';

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
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  today = new Date();

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

  constructor(public jsonDataService: SlaJsonDataService, private route: ActivatedRoute, private sweetAlerService: SweetAlertService, public pdfService: JspdfService) {
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

    this.today = new Date();

  }

  ngOnInit(): void {
  }

  getPE1(){
    this.cantidadPE1 = this.JsonArrayPE1.length;

    //Cumplen los que  Fecha Recepción VS Fec. Real Estimación <= 5 días hábiles
    let cantOk = 0;
    this.JsonArrayPE1.forEach(function(valor){
      let fechaRecepcion = new Date(valor['fechaRecepcion']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);

      cantOk += ((fecRealEstimacion.getDate()-fechaRecepcion.getDate())<=5) ? 1 : 0;
    });
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
}
