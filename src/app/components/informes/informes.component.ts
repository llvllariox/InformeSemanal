import { Component } from '@angular/core';
import { JsonDataService } from 'src/app/services/json-data.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import * as moment from 'moment'; // add this 1 of 4
import { JspdfService } from '../../services/jspdf.service';
declare function init_customJS();


@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: []
})
export class InformesComponent {

  jsonDataReqInf: any;
  paramSeg = '';
  JsonArray: [] = [];
  icon = '';
  dimensiones = [];
  fecha1 = '';
  fecha2 = '';
  fecha3 = '';
  fecha4 = '';
  fecha5 = '';
  fecha6 = '';
  fecha7 = '';
  fecha8 = '';
  fecha9 = '';
  fecha10 = '';
  fecha11 = '';
  fecha12 = '';
  fecha13 = '';
  fecha14 = '';
  fecha15 = '';
  fecha16 = '';
  fecha17 = '';
  fecha18 = '';
  fecha19 = '';
  fecha20 = '';
  fecha21 = '';
  fecha22 = '';
  fecha23 = '';
  fecha24 = '';
  fecha25 = '';

  tablaFac = [];
  contProgress = 0;
  mostrarVal = true;
  mostrarError = true;

  constructor(public jsonDataService: JsonDataService, private route: ActivatedRoute, private sweetAlerService: SweetAlertService, public pdfService: JspdfService) {
    init_customJS();

    // tslint:disable-next-line: deprecation
    moment.lang('es');
    this.fecha1 = moment().format('MM/YY');
    this.fecha2 = moment().subtract(1, 'months').format('MM/YY');
    this.fecha3 = moment().subtract(2, 'months').format('MM/YY');
    this.fecha4 = moment().subtract(3, 'months').format('MM/YY');
    this.fecha5 = moment().subtract(4, 'months').format('MM/YY');
    this.fecha6 = moment().subtract(5, 'months').format('MM/YY');
    this.fecha7 = moment().subtract(6, 'months').format('MM/YY');
    this.fecha8 = moment().subtract(7, 'months').format('MM/YY');
    this.fecha9 = moment().subtract(8, 'months').format('MM/YY');
    this.fecha10 = moment().subtract(9, 'months').format('MM/YY');
    this.fecha11 = moment().subtract(10, 'months').format('MM/YY');
    this.fecha12 = moment().subtract(11, 'months').format('MM/YY');
    this.fecha13 = moment().subtract(12, 'months').format('MM/YY');
    this.fecha14 = moment().subtract(13, 'months').format('MM/YY');
    this.fecha15 = moment().subtract(14, 'months').format('MM/YY');
    this.fecha16 = moment().subtract(15, 'months').format('MM/YY');
    this.fecha17 = moment().subtract(16, 'months').format('MM/YY');
    this.fecha18 = moment().subtract(17, 'months').format('MM/YY');
    this.fecha19 = moment().subtract(18, 'months').format('MM/YY');
    this.fecha20 = moment().subtract(19, 'months').format('MM/YY');
    this.fecha21 = moment().subtract(20, 'months').format('MM/YY');
    this.fecha22 = moment().subtract(21, 'months').format('MM/YY');
    this.fecha23 = moment().subtract(22, 'months').format('MM/YY');
    this.fecha24 = moment().subtract(23, 'months').format('MM/YY');
    this.fecha25 = moment().subtract(24, 'months').format('MM/YY');
    // let now = moment();


    //  this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backend');
    if (this.jsonDataService.jsonDataReqService !== undefined) {
      this.jsonDataReqInf = this.jsonDataService.getJsonDataReqService();
      this.route.params.subscribe(params => {
        this.paramSeg = params['segmento'];
        if (this.paramSeg === 'BO') {
          // this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backoffice', this.jsonDataService.fechaInformes);
          //this.pdfService.segmento =  'Segmento Backoffice';
          this.pdfService.segmento =  'Preproceso';
          this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
            return (a.bloque == 'VS - Transacciones y Procesamiento' && a.area == 'Procesamiento');
            //return a.area === 'Segmento Backoffice';
          });
          this.tablasFac();
        } else if (this.paramSeg === 'BE') {
          // this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backend', this.jsonDataService.fechaInformes);
          //this.pdfService.segmento =  'Segmento Backend';
          this.pdfService.segmento = 'Proceso';
          this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
            //return a.area === 'Segmento Backend' || a.area === 'Nuevo Backend Crédito';
            return a.bloque == 'VS - Onboarding & Contratación & Sibel';
          });
          this.tablasFac();
        } else {
          // this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Plataforma de Integración', this.jsonDataService.fechaInformes);
          this.pdfService.segmento =  'Plataforma de Integración';
          this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
            return a.area === 'Plataforma de Integración';
          });
          this.tablasFac();
        }
      });
    }

    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  generaNuevoPDF(){
    this.sweetAlerService.mensajeEsperar2().then(resp=>{
      this.pdfService.generaPDF(this.JsonArray, this.tablaFac).then(resp => {
        this.sweetAlerService.mensajeOK('PDF Generado Exitosamente');
      });
    });
  }

  tablasFac() {
  this.tablaFac = [];
  this.tablaFac.push(this.JsonArray);
  }

  cambiaValor() {

    this.mostrarVal = !this.mostrarVal;
  }

  mostrarErrores(){
    this.mostrarError = !this.mostrarError;
  }
}
