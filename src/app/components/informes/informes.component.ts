import { Component, OnInit } from '@angular/core';
import { JsonDataService } from 'src/app/services/json-data.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import htmlToImage from 'html-to-image';
import { Exportador } from '../../common/exportador/Exportador';
import html2canvas from 'html2canvas';


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


  constructor(public jsonDataService: JsonDataService, private route: ActivatedRoute, private sweetAlerService: SweetAlertService) {
    this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backend');
    if (this.jsonDataService.jsonDataReqService!== undefined) {
    this.jsonDataReqInf = this.jsonDataService.getJsonDataReqService();
    this.route.params.subscribe(params => {
      this.paramSeg = params['segmento'];
      if (this.paramSeg =='BO') {
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backoffice');
          return a['Área'] === 'Segmento Backoffice';
        });
      } else if (this.paramSeg =='BE') {
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Segmento Backend');
          return a['Área'] === 'Segmento Backend' || a['Área'] === 'Nuevo Backend Crédito';
        });
      } else {
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          this.exportador = new Exportador('Informe Semanal Evolutivo -', 'Plataforma de Integración');
          return a['Área'] === 'Plataforma de Integración';
        });
      }
    });
  }
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

          resolve(canvas.toDataURL('image/jpeg'));

        }).catch(error => {
          reject('error al generar imagen desde div');
        });

    });
  }
  ngOnInit(): void {
  }

}
