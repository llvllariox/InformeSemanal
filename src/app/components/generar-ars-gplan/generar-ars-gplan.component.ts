import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
// import { JsonDataService } from 'src/app/services/json-data.service';
import { ArsJiraService } from 'src/app/services/ars-jira.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generar-ars-gplan',
  templateUrl: './generar-ars-gplan.component.html',
  styles: [
  ]
})

export class GenerarArsGplanComponent implements OnInit {

  forma: FormGroup;
  jsonDataReq = null; //REQUERIMIENTOS PLANIFICADOS
  jsonDataTar = null; //JIRA

  nuevosHeaders = [];
  fechaHoy = '';
  estadoReq = 1;
  estadoTar = 1;

  constructor( private formBuilder: FormBuilder,
               private jsonDataService: ArsJiraService,
               private sweetAlertService: SweetAlertService, 
               private router: Router) {

    this.jsonDataService.jsonDataReqPlanService = null;
    this.jsonDataService.jsonDataJiraService = null;
    this.jsonDataService.infoCargada = false;

    this.crearFormulario();
    const currentDate = new Date().toISOString().substring(0, 10);
  }

  ngOnInit(): void {
  }
  
  click(archivo){

    setTimeout(() => {
      switch (archivo) {
        case 1:
          this.estadoReq = 2;
          break;
        case 2:
          this.estadoTar = 2;
          break;
      }
    }, 1000);
    
  }

  uploadTar(event) {
    if (!this.validarTipo(event)){
      this.estadoTar = 4;
      return;
    }
    this.jsonDataTar = null;
    this.estadoTar = 2;

    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      
      workBook = XLSX.read(data, { type: 'binary', cellDates: true });

      if (workBook.SheetNames[0] !== 'Sheet0'){
        this.estadoTar = 4;
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Tareas');
        this.jsonDataTar = null;
        return;
      }
      this.jsonDataTar = workBook.SheetNames.reduce((initial, name) => {
      
        const sheet = workBook.Sheets[name];
        this.formatHeadersTar(sheet, 'I3');
 
        initial[name] = XLSX.utils.sheet_to_json(sheet,{range:2});

        this.estadoTar = 3;
        return initial;
    
      }, {});
  
      if (this.jsonDataTar['Sheet0'] === undefined) {
        this.estadoTar = 4;
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Tareas');
        this.jsonDataTar = null;
      } else {
        this.filtrarTar(this.jsonDataTar);
      }
    };
    reader.readAsBinaryString(file);
  }

  filtrarTar(jsonDataReq: any) {
    console.log("filtrar 1");
    console.log(jsonDataReq);

    jsonDataReq['Sheet0'] = jsonDataReq['Sheet0'].filter(a => {
      return a.tipoDeIncidencia !== 'Distribución';
    });  
    
    console.log("filtrar 2");
    console.log(jsonDataReq);

    this.jsonDataService.setjsonDataJiraService(jsonDataReq);
    console.log("filtrar");
    console.log(this.jsonDataService.jsonDataJiraService);
  }

  //uploadReq Planificados
  uploadReq(event) {
    if (!this.validarTipo(event)){
      this.estadoReq = 4;
      return;
    }
    this.jsonDataReq = null;
    this.estadoReq = 2;

    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      
      if (workBook.SheetNames[0] !== 'Detalle Horas Planificadas'){
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos Planificados');
        this.estadoReq = 4;
        this.jsonDataReq = null;
        return;
      }
      this.jsonDataReq = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formatHeaders(sheet, 'BA1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.estadoReq = 3;
        return initial;
      }, {});
     
      if (this.jsonDataReq['Detalle Horas Planificadas'] === undefined) {
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos Planificados');
        this.estadoReq = 4;
        this.jsonDataReq = null;
      } else {
        this.filtrarReq(this.jsonDataReq['Detalle Horas Planificadas']);
      }
    };
    reader.readAsBinaryString(file);
 }

 
  //se agregan filtros a los requisitos planificados
  filtrarReq(jsonDataReq: any) {
  
    jsonDataReq = jsonDataReq.filter(a => {
      return a.lineaDeServicio === 'Evolutivo Mayor';
    });

    jsonDataReq = jsonDataReq.filter(a => {
      return a.tipoContrato === 'Evolutivo';
    });

    this.sumarizar(jsonDataReq);
  }

  //suma el campo horasPlanificadas para filas con numeroArs iguales
  sumarizar(jsonDataReq) {
    let jsonTemporal: [][] = [];
    let encontrado;
    
    jsonDataReq.forEach((element)=>{      
      encontrado = false;
      jsonTemporal.forEach((elementTemp)=>{
        if(element.numeroArs == elementTemp['numeroArs']){
          elementTemp['horasPlanificadas'] += element.horasPlanificadas;
          encontrado = true;
        }
      });

      if(!encontrado){
        jsonTemporal.push(element);
      }
    });

    this.jsonDataService.setjsonDataReqPlanService(jsonTemporal);
  }


 formatHeaders(sheet, limit){
    function camalize(str) {
      
        str = str.replace(/\./g, '');
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    let abc = ['A1',	'B1',	'C1',	'D1',	'E1',	'F1',	'G1',	'H1',	'I1',	'J1',	'K1',	'L1',
               'M1',	'N1',	'O1',	'P1',	'Q1',	'R1',	'S1',	'T1',	'U1',	'V1',	'W1',	'X1',
               'Y1',	'Z1',	'AA1',	'AB1',	'AC1',	'AD1',	'AE1',	'AF1',	'AG1', 'AH1',
               'AI1',	'AJ1',	'AK1',	'AL1',	'AM1',	'AN1',	'AO1', 'AP1',	'AQ1', 'AR1',
               'AS1',	'AT1',	'AU1',	'AV1',	'AW1',	'AX1',	'AY1',	'AZ1',	'BA1',	'BB1',
               'BC1',	'BD1',	'BE1',	'BF1',	'BG1',	'BH1',
              ];
            
    for (const letra of abc) {
      sheet[letra].w = camalize(sheet[letra].w);

      if (letra == limit){
        break;
      }
    }
 }

  formatHeadersTar(sheet, limit){
    function camalize(str) {
    
      str = str.replace(/\./g, '');
      str = str.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
      
      return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    let abc = ['A3',	'B3',	'C3',	'D3',	'E3',	'F3',	'G3',	'H3',	'I3',	'J3',	'K3',	'L3',
             'M3',	'N3',	'O3',	'P3',	'Q3',	'R3',	'S3',	'T3',	'U3',	'V3',	'W3',	'X3',
             'Y3',	'Z3',	'AA3',	'AB3',	'AC3',	'AD3',	'AE3',	'AF3',	'AG3', 'AH3',
             'AI3',	'AJ3',	'AK3',	'AL3',	'AM3',	'AN3',	'AO3', 'AP3',	'AQ3', 'AR3',
             'AS3',	'AT3',	'AU3',	'AV3',	'AW3',	'AX3',	'AY3',	'AZ3',	'BA3',	'BB3',
             'BC3',	'BD3',	'BE3',	'BF3',	'BG3',	'BH3',
            ];
          
    for (const letra of abc) {
      sheet[letra].w = camalize(sheet[letra].w);

      if (letra == limit){
        break;
      }
    }
  }

  validarTipo(event){
    if(event.target.files[0]){
      let tipo = event.target.files[0].type;
      if (!tipo.includes('sheet')) {
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo es invalido');
        return false;
      }else{
        return true;
      }
    }
  }

  guardar() {   
    console.log("guardar");
    console.log(this.jsonDataService.jsonDataJiraService);

    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {

        if (control instanceof FormGroup) {
          // tslint:disable-next-line: no-shadowed-variable
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
        control.markAsTouched();
        }
      });
    } else {
        this.jsonDataService.fechaInformes = this.forma.value.fecha;
        
        if (this.jsonDataTar == null) {
                this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Tareas');
                return;
        }
        if (this.jsonDataReq == null) {
                this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
                return;
        }

        this.jsonDataService.consolidarArchivosPlan();
        this.sweetAlertService.mensajeOK('Generado Exitosamente').then(
          resp => {
            if (resp.value) {
              this.router.navigateByUrl('/ver-ars-jira-plan');
            }
          }
        );
    }
  }

  crearFormulario() {
    this.forma = this.formBuilder.group({
      requerimientos : ['', [Validators.required]],
      tareas : ['', [Validators.required]]
    });
  }

  get requerimientosNoValido() {
    return this.forma.get('requerimientos').invalid && this.forma.get('requerimientos').touched;
  }
  get tareasNoValido() {
    return this.forma.get('tareas').invalid && this.forma.get('tareas').touched;
  }
}