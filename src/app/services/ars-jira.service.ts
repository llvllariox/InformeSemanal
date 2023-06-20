import { Injectable } from '@angular/core';
import { arrayBuffer } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class ArsJiraService {

  jsonDataReqService;
  jsonDataReqPlanService;

  jsonDataJiraService;
  jsonDataHitosService;
  jsonDataJiraSinArsService;
  infoCargada = false;
  conFact = true;
  fechaInformes: string;

  constructor() { }

  getJsonDataReqService() {
    return this.jsonDataReqService;
  }

  getJsonDataReqPlanService() {
    return this.jsonDataReqPlanService;
  }

  setjsonDataReqService(jsonDataReqService: any) {
    this.jsonDataReqService = jsonDataReqService;
  }

  setjsonDataReqPlanService(jsonDataReqService: any) {
    this.jsonDataReqPlanService = jsonDataReqService;
  }

  getJsonDataJiraService() {
    return this.jsonDataJiraService;
  }

  setjsonDataJiraService(jsonDataJiraService: any) {
    this.jsonDataJiraService = jsonDataJiraService;
  }

  getJsonDataHitosService() {
    return this.jsonDataHitosService;
  }

  setjsonDataHitosService(jsonDataHitosService: any) {
    this.jsonDataHitosService = jsonDataHitosService;
  }

  consolidarArchivos() {
    console.log('ARS-JIRA SERVICE');
    this.blancoEnCero()
    this.AddJiraToReq();
    this.buscarJiraSinARS();
    console.log(this.jsonDataReqService);
  //  console.log(this.jsonDataJiraService);
  }

  consolidarArchivosPlan() {
    console.log('ARS-JIRA PLAN SERVICE');
    console.log(this.jsonDataJiraService);
    this.blancoEnCero();
    this.AddJiraToReqPlan();
    this.buscarJiraSinARSPlan();
    //console.log(this.jsonDataReqPlanService);
  }

  
  blancoEnCero(){
    let x = 0;
    for (let jira of this.jsonDataJiraService.Sheet0) {

      if(jira["Duración en HH"] == null || jira["Duración en HH"] == ''){
        jira["Duración en HH"] = 0;
      }

      if(jira["Tarifa HH/UF"] == null || jira["Tarifa HH/UF"] == ''){
        jira["Tarifa HH/UF"] = 0;
      }

      if(jira["HH Consumidas"] == null || jira["HH Consumidas"] == ''){
        jira["HH Consumidas"] = 0;
      }

      if(jira["HH Restantes"] == null || jira["HH Restantes"] == ''){
        jira["HH Restantes"] = 0;
      }

      x++;
    }
  }

  AddJiraToReq() {
    let jirapaso = this.jsonDataJiraService.Sheet0[0];
      jirapaso.proyecto = '',
      jirapaso.tipoDeIncidencia = '',
      jirapaso.clave = '',
      jirapaso.responsable = '',
      jirapaso.estado = '',
      jirapaso.fechaDeInicio = '',
      jirapaso.resumen = '',
      jirapaso.incidenciasEnlazadas = ''

      const jira = jirapaso;
      let i = 0;
   
      for (let req of this.jsonDataReqService.Requerimientos) {
     

      // console.log(jirapaso.estado)
      this.jsonDataReqService.Requerimientos[i] = {...this.jsonDataReqService.Requerimientos[i], jira };
      // console.log(this.jsonDataReqService.Requerimientos[i])
      i++;
    }

    // se agregan JIRA a los requerimientos como un arreglo
    let x = 0;
    // tslint:disable-next-line: prefer-const
    for (let req of this.jsonDataReqService.Requerimientos) {

      
      for (const  jira of this.jsonDataJiraService.Sheet0) {

        if (req.codigoExterno === jira.clave) {
          this.jsonDataReqService.Requerimientos[x] = {...this.jsonDataReqService.Requerimientos[x], jira };
        }
      }
      x++;
    }
  }


  //se cruzan los requisitos planificados ya sumarizados con lo de Jira
  AddJiraToReqPlan() {
    //para cada requerimiento buscamos si tiene un jira
    let jira;
    let jiravacio = [];
    jiravacio['tipoDeIncidencia'] = '';
    jiravacio['clave'] = '';
    jiravacio['responsable'] = '';
    jiravacio['estado'] = '';
    jiravacio['Duración en HH'] = '';
    jiravacio['Tarifa HH/UF'] = '';
    jiravacio['HH Consumidas'] = '';
    jiravacio['HH Restantes'] = '';
    
    this.jsonDataReqPlanService.forEach((element, index) => {
      jira = this.jsonDataJiraService.Sheet0.find((e) => element.codigoExterno === e.clave);
      
      if(jira) {
        this.jsonDataReqPlanService[index]['jira'] = jira;
      } else {
        this.jsonDataReqPlanService[index]['jira'] = jiravacio;
      }
    });
  }

  buscarJiraSinARS() {
    let JiraSinARS = [];
    for (let jira of this.jsonDataJiraService.Sheet0) {
      let req = [];
      req = this.jsonDataReqService.Requerimientos.find((e) => e.codigoExterno === jira.clave);
  
      if(req){
        // console.log('existe ', req);
      }else{
        // console.log('no existe ', jira.clave);
        JiraSinARS.push(jira);
      } 
    }
    console.log(JiraSinARS);
    // JiraSinARS.filter(x => x !== '') 
    this.jsonDataJiraSinArsService = JiraSinARS.slice(1);
    console.log(this.jsonDataJiraSinArsService);
 
//  // se agregan JIRA a los requerimientos como un arreglo
//  let x = 0;
//  // tslint:disable-next-line: prefer-const

//  for (let  jira of this.jsonDataJiraService.Sheet0) {

   
//    for (let req of this.jsonDataReqService.Requerimientos) {

//      if (req.codigoExterno === jira.clave) {
//        console.log('existe' + req.codigoExterno );
//      }
//    }
//    if ()
//    x++;
//  }

  }

  //buscamos los Jira sin ARS
  buscarJiraSinARSPlan() {
    let JiraSinARS = [];
    for (let jira of this.jsonDataJiraService.Sheet0) {
      let req = [];
      req = this.jsonDataReqPlanService.find((e) => e.codigoExterno === jira.clave);
  
      if(req){
        // console.log('existe ', req);
      }else{
        // console.log('no existe ', jira.clave);
        JiraSinARS.push(jira);
      }
      
      
        if(jira.clave == 'GOTI-5171') console.log(jira);

    }
    
    this.jsonDataJiraSinArsService = JiraSinARS.slice(1);
  }
}
