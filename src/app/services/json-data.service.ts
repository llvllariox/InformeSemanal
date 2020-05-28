import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  jsonDataReqService;
  jsonDataEveService;
  jsonMasEve;

  constructor() { }

  getJsonDataReqService(){
    console.log('get service');
    console.log(this.jsonDataReqService);
    return this.jsonDataReqService;
  }

  setjsonDataReqService(jsonDataReqService: any){
    console.log('jsonDataReqService: ', jsonDataReqService);
    this.jsonDataReqService = jsonDataReqService;
  }

  getJsonDataEveService(){
    console.log('get service');
    console.log(this.jsonDataEveService);
    return this.jsonDataEveService;
  }

  setjsonDataEveService(jsonDataEveService: any){
    console.log('jsonDataEveService: ', jsonDataEveService);
    this.jsonDataEveService = jsonDataEveService;
  }

  AddEveToReq(){
    // console.log(this.jsonDataReqService.Requerimientos[0]['Nro. Req.']);
    console.log('AddEveToReq');
    let x = 0;
    for (let req of this.jsonDataReqService.Requerimientos) {
      // console.log(req);
      // console.log(req['Nro. Req.']);
      let i = 0;
      let eventos = [];
      for (const  eve of this.jsonDataEveService.Eventos) {
        
        // console.log(eve['Número de req. o sol']);
        if(req['Nro. Req.'] == eve['Número de req. o sol.']){
  
          // console.log('Iguales', req);
          // console.log('Iguales', eve);
          // req.push(eve);
         
          eventos[i] = eve;
          i++;
          // console.log(jsonMasEve);
        }
 
        // console.log(eve.index);
      }
      if(eventos.length>0){
        console.log(eventos);

        this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], eventos };
      }
      
      eventos = [];
      x++;
    }
    console.log(this.jsonDataReqService.Requerimientos);
  }
}
