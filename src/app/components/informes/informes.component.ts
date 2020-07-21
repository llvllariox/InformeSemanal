import { Component, OnInit } from '@angular/core';
import { JsonDataService } from 'src/app/services/json-data.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import htmlToImage from 'html-to-image';
import { Exportador } from '../../common/exportador/Exportador';
import html2canvas from 'html2canvas';
import * as moment from 'moment'; // add this 1 of 4


@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: []
})
export class InformesComponent implements OnInit {

  jsonDataReqInf: any;
  paramSeg = '';
  JsonArray: [] = [];
  icon = '';
  exportador: Exportador;
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

  tablaFac= [];


  constructor(public jsonDataService: JsonDataService, private route: ActivatedRoute, private sweetAlerService: SweetAlertService) {

    moment.lang('es');
    this.fecha1 = moment().format('MM/YY');
    this.fecha2 = moment().subtract(1,'months').format('MM/YY');
    this.fecha3 = moment().subtract(2,'months').format('MM/YY');
    this.fecha4 = moment().subtract(3,'months').format('MM/YY');
    this.fecha5 = moment().subtract(4,'months').format('MM/YY');
    this.fecha6 = moment().subtract(5,'months').format('MM/YY');
    this.fecha7 = moment().subtract(6,'months').format('MM/YY');
    this.fecha8 = moment().subtract(7,'months').format('MM/YY');
    this.fecha9 = moment().subtract(8,'months').format('MM/YY');
    this.fecha10 = moment().subtract(9,'months').format('MM/YY');
    this.fecha11 = moment().subtract(10,'months').format('MM/YY');
    this.fecha12 = moment().subtract(11,'months').format('MM/YY');
    this.fecha13 = moment().subtract(12,'months').format('MM/YY');
    this.fecha14 = moment().subtract(13,'months').format('MM/YY');
    this.fecha15 = moment().subtract(14,'months').format('MM/YY');
    this.fecha16 = moment().subtract(15,'months').format('MM/YY');
    this.fecha17 = moment().subtract(16,'months').format('MM/YY');
    this.fecha18 = moment().subtract(17,'months').format('MM/YY');
    this.fecha19 = moment().subtract(18,'months').format('MM/YY');
    this.fecha20 = moment().subtract(19,'months').format('MM/YY');
    this.fecha21 = moment().subtract(20,'months').format('MM/YY');
    this.fecha22 = moment().subtract(21,'months').format('MM/YY');
    this.fecha23 = moment().subtract(22,'months').format('MM/YY');
    this.fecha24 = moment().subtract(23,'months').format('MM/YY');
    this.fecha25 = moment().subtract(24,'months').format('MM/YY');
    // let now = moment();


    //  this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backend');
    if (this.jsonDataService.jsonDataReqService!== undefined) {
    this.jsonDataReqInf = this.jsonDataService.getJsonDataReqService();
    this.route.params.subscribe(params => {
      this.paramSeg = params['segmento'];
      if (this.paramSeg =='BO') {
        this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backoffice');
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          return a['Área'] === 'Segmento Backoffice';
        });
        this.tablasFac();
      } else if (this.paramSeg =='BE') {
        this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backend');
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          return a['Área'] === 'Segmento Backend' || a['Área'] === 'Nuevo Backend Crédito';
        });
        this.tablasFac();
      } else {
        this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Plataforma de Integración');
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          return a['Área'] === 'Plataforma de Integración';
        });
        this.tablasFac();
      }
    });

   
  }
  }

  tablasFac(){
  this.tablaFac = [];
  let div = Math.ceil(this.JsonArray.length / 3);
  // console.log(div);
  // console.log(this.JsonArray.Requerimientos.length);
  for (let i = 0; i < this.JsonArray.length; i += div) {
    let pedazo = this.JsonArray.slice(i, i + div);
    this.tablaFac.push(pedazo);
  }
  // console.log(this.tablaFac.length);
  // console.log("TablaFac ", this.tablaFac);

  }

  async generarPDF() {
    this.sweetAlerService.mensajeEsperar();
    let imagenes = await this.imagnesDeTareas();
    this.exportador.exportarPDF(imagenes, this.dimensiones);
    this.sweetAlerService.mensajeOK('PDF Generado Exitosamente');

  }


  async generarPPT() {
    this.sweetAlerService.mensajeEsperar();
    let imagenes = await this.imagnesDeTareas().then(
      resp => this.exportador.exportarPPT(imagenes)
    );
    this.sweetAlerService.mensajeOK('PDF Generado Exitosamente');

  }
  async imagnesDeTareas() {
    let elements:any = document.querySelectorAll('#tareas')
    let imagenes = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < elements.length; i++) {
      try {
        imagenes.push(await this.generarImagenfromDiv2(elements[i]));
      } catch (error) {
        throw error;
      }

    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < elements.length; i++) {
      this.dimensiones.push({widht: elements[i].clientWidth, height: elements[i].clientHeight});
    }

    return imagenes;
  }


  async generarImagenFromDiv(divElement) {
    return new Promise((resolve, reject) => {

      htmlToImage.toPng(divElement)
        .then(dataUrl => {
          // console.log(dataUrl);
          resolve(dataUrl);
        }).catch(err => {
          reject('error al generar imagen desde div');
        });
    })
  }

  

  async generarImagenfromDiv2(divElement) {
    return new Promise((resolve, reject) => {
      html2canvas(divElement,{scale:2, width: 1300,
        height: divElement.clientHeight})
        .then(canvas => {
          // console.log(canvas.toDataURL('image/jpeg'));
          resolve(canvas.toDataURL('image/jpeg'));

        }).catch(error => {
          reject('error al generar imagen desde div');
        });

    });
  }
  ngOnInit(): void {
  }

}
