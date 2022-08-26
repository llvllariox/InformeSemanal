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

  cantidadPE2;
  cantidadOKPE2;
  cantidadNOOKPE2;

  cantidadPE3;
  cantidadOKPE3;
  cantidadNOOKPE3;

  cantidadPE6;
  cantidadOKPE6;
  cantidadNOOKPE6;

  constructor(public jsonDataService: SlaJsonDataService, private route: ActivatedRoute, private sweetAlerService: SweetAlertService, public pdfService: JspdfService) {
    this.cantidadPE1 = 0;
    this.cantidadOKPE1 = 0;
    this.cantidadNOOKPE1 = 0;
    
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

  }

  ngOnInit(): void {
  }

  getPE1(){
    this.cantidadPE1 = this.JsonArrayPE1.length;

    //Validar Fecha Recepción VS Fec. Real Estimación <= 5 días hábiles
    let cantOk = 0;
    this.JsonArrayPE1.forEach(function(valor){
      let fechaRecepcion = new Date(valor['fechaRecepcion']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);

      cantOk += ((fecRealEstimacion.getDate()-fechaRecepcion.getDate())<=5) ? 1 : 0;
    });
    this.cantidadOKPE1 = cantOk;

    this.cantidadNOOKPE1 = this.cantidadPE1 - this.cantidadOKPE1;
  }

  getPE2(){
    //Validar Fec. Real Pase Aprobación = Mes en curso VS Fec. Plan. Pase Aprobación, deben ser iguales, Se informa el total
    this.cantidadPE2 = this.JsonArrayPE2.length;
    this.cantidadOKPE2 = 1;
    this.cantidadNOOKPE2 = this.cantidadPE2 - this.cantidadOKPE2;
  }

  getPE3(){
    this.cantidadPE3 = this.JsonArrayPE3.length;
    this.cantidadOKPE3 = 1;
    this.cantidadNOOKPE3 = this.cantidadPE3 - this.cantidadOKPE3;
    // Validar Fec Real Fin = mes en curso
    // Validar Horas Estimadas => Horas Incurridas, Se informa el total
  }

  getPE6(){
    this.cantidadPE6 = this.JsonArrayPE6.length;
    this.cantidadOKPE6 = 1;
    this.cantidadNOOKPE6 = this.cantidadPE6 - this.cantidadOKPE6;
    //Validar Fec. Real Pase Producción = Mes en curso VS  Fec. Plan. Pase Producción, deben ser iguales, Se informa el total
  }
}
