import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DmsJsonDataService {
  jsonDataDmsAService;
  jsonDataDmsBService;
  
  constructor() { }

  getJsonDataDmsAService() {
    return this.jsonDataDmsAService;
  }

  getJsonDataDmsBService() {
    return this.jsonDataDmsBService;
  }

  setJsonDataDmsService(jsonDataReqService: any, reporte: String){
    if(reporte == 'A') {
      this.jsonDataDmsAService = jsonDataReqService;
    } else if(reporte == 'B') {
      this.jsonDataDmsBService = jsonDataReqService;
    }
  }


}
