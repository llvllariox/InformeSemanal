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
  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  today = new Date();

  cantidadPE1;
  cantidadOKPE1;
  cantidadNOOKPE1;

  constructor(public jsonDataService: SlaJsonDataService, private route: ActivatedRoute, private sweetAlerService: SweetAlertService, public pdfService: JspdfService) {
    this.cantidadPE1 = 0;
    this.cantidadOKPE1 = 0;
    this.cantidadNOOKPE1 = 0;
    
    if(this.jsonDataService.jsonDataReqPE1Service !== undefined) {
      this.jsonDataReqInf = this.jsonDataService.getJsonDataReqPE1Service();
      this.JsonArrayPE1 = this.jsonDataReqInf.Requerimientos.filter(a => {
        return a;
      });

      this.getPE1();
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
}
