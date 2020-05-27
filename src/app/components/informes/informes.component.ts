import { Component, OnInit } from '@angular/core';
import { JsonDataService } from 'src/app/services/json-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: []
})
export class InformesComponent implements OnInit {

  jsonDataReq: any;
  paramSeg = '';
  JsonArray: [] = [];

  constructor(private jsonDataService: JsonDataService, private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.paramSeg = params['segmento'];
      console.log('DESDE SEERVICE' , this.jsonDataService.jsonDataReqService);
      this.jsonDataReq = this.jsonDataService.jsonDataReqService;
      // console.log(this.jsonDataReq);
      console.log('constructor');

      if (this.paramSeg =='BO') {
        // this.paramSeg = 'Segmento Backoffice';
        this.jsonDataReq.Requerimientos = this.jsonDataReq.Requerimientos.filter(a => {
          return a['Área'] === 'Segmento Backoffice';
        });
      } else if (this.paramSeg =='BE') {
        this.jsonDataReq.Requerimientos = this.jsonDataReq.Requerimientos.filter(a => {
          return a['Área'] === 'Segmento Backend';
        });
      }else{
        this.jsonDataReq.Requerimientos = this.jsonDataReq.Requerimientos.filter(a => {
          return a['Área'] === 'Plataforma de Integración';
        });
      }
      console.log('FILTRADO' ,this.jsonDataReq);
      this.JsonArray = this.jsonDataReq.Requerimientos;
    });
    
    // this.jsonDataReq = JSON.parse(jsonDataService.jsonDataReq);
    // console.log(this.jsonDataReq);
    // console.log(this.jsonDataReq);
  }

  ngOnInit(): void {
    // this.jsonDataReq = this.jsonDataService.jsonDataReq;
  }

}
