import { Component, OnInit } from '@angular/core';
import { JsonDataService } from 'src/app/services/json-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: []
})
export class InformesComponent implements OnInit {

  jsonDataReqInf:any;
  paramSeg = '';
  JsonArray: [] = [];
  icon = '';

  constructor(private jsonDataService: JsonDataService, private route: ActivatedRoute) {
    this.jsonDataReqInf = this.jsonDataService.getJsonDataReqService();
    this.route.params.subscribe(params => {
      this.paramSeg = params['segmento'];
      // console.log('Obtiene', this.jsonDataReqInf);
      // console.log('constructor');

      if (this.paramSeg =='BO') {
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          return a['Área'] === 'Segmento Backoffice';
        });
      } else if (this.paramSeg =='BE') {
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          return a['Área'] === 'Segmento Backend';
        });
      } else {
        this.JsonArray = this.jsonDataReqInf.Requerimientos.filter(a => {
          return a['Área'] === 'Plataforma de Integración';
        });
      }
    });

  }

  ngOnInit(): void {
  }

}
