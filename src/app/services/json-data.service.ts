import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  jsonDataReqService;
  jsonDataEveService;

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
}
