import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { SlaJsonDataService } from 'src/app/services/sla-json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { FeriadosChileService } from '../../services/feriados-chile.service';

@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html'
})
export class SlaComponent implements OnInit {
  formulario: FormGroup;
  jsonDataReq = null;
  jsonDataSol = null;
  estadoReq = 1;
  estadoSol = 1;
  fechaInforme;
  fechaMin;
  fechaMax;
  feriados = null;

  constructor(private formBuilder: FormBuilder, private jsonDataService: SlaJsonDataService, private sweetAlerService: SweetAlertService, private router: Router, private feriadosService: FeriadosChileService) {  
    
      this.crearFormulario();
  
      let hoy = new Date();
      const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
      this.fechaMin = '2015-01';
      this.fechaMax = currentDate;
      this.formulario.controls['fecha'].setValue(currentDate);  

      this.jsonDataService.setFechaInforme(this.formulario.value.fecha);
      this.fechaInforme = new Date(jsonDataService.getFechaInforme() + '-05');
      
      // Se obtienen los feriados
      this.feriadosService.obtenerFeriados().subscribe(resp => {
           this.feriados = resp;
      }, err => {
          this.feriados = null;
          this.sweetAlerService.mensajeError('Error al obtener Feriados', err.og.message);
      });
  }

  ngOnInit(): void {
  }

  clickReq(archivo){
    this.formulario.controls.requerimientos.reset();
    this.estadoReq = 4;
  }

  clickSol(archivo){
    this.formulario.controls.solicitudes.reset();
    this.estadoSol = 4;
  }

  //si hay archivo se borra y se pide cargar de nuevo
  cambiarFecha(event) {
    //si no ha subido archivo
    this.fechaInforme = new Date(this.formulario.value.fecha + "-05");
  
    if(this.formulario.value.requerimientos){
      this.formulario.controls.requerimientos.reset();
      this.estadoReq = 4;
    }

    if(this.formulario.value.solicitudes){
      this.formulario.controls.solicitudes.reset();
      this.estadoSol = 4;
    }
  }

  //transforma la data de requisitos a JSON
  uploadReq(event) {
    if(!this.validarTipo(event)){
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
      if (workBook.SheetNames[0] !== 'Requerimientos'){
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
        this.estadoReq = 4;
        this.jsonDataReq = null;
        return;
      }
      this.jsonDataReq = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formularioHeaders(sheet, 'AO1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);

        this.estadoReq = 3;
        return initial;
      }, {});
    
      if (this.jsonDataReq.Requerimientos === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        this.estadoReq = 4;
        this.jsonDataReq = null;
      } else {
        let tmp = this.jsonDataReq.Requerimientos;
        
        //PROYECTO
        this.filtrarReq(tmp);
      }
    };
    reader.readAsBinaryString(file);    
 }

 //transforma la data de solicitudes a JSON
 uploadSol(event) {
  if(!this.validarTipo(event)){
    this.estadoSol = 4;
    return;
  }

  this.jsonDataSol = null;
  this.estadoSol = 2;
  let workBook = null;
  const reader = new FileReader();
  const file = event.target.files[0];
  reader.onload = () => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary', cellDates : true });
    if (workBook.SheetNames[0] !== 'Solicitudes'){
      this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Solicitudes');
      this.estadoSol = 4;
      this.jsonDataSol = null;
      return;
    }
    this.jsonDataSol = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      this.formularioHeaders(sheet, 'AH1');
      initial[name] = XLSX.utils.sheet_to_json(sheet);

      this.estadoSol = 3;
      return initial;
    }, {});
  
    if (this.jsonDataSol.Solicitudes === undefined) {
      this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Solicitudes');
      this.estadoSol = 4;
      this.jsonDataSol = null;
    } else {
      let tmp = this.jsonDataSol.Solicitudes;
      this.filtrarSol(tmp);
    }
  };
  reader.readAsBinaryString(file);    
}


   formularioHeaders(sheet, limit){
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

 /*
  Filtrar Contrato = Evolutivo
  Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
 */
 filtrarReq(jsonDataReqArray: any) {
  jsonDataReqArray = jsonDataReqArray.filter(a => {
    return (
              (a.contrato === 'Evolutivo'
              &&
              (a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Evolutivo Menor'))
              ||
              (a.contrato === 'Mantenimiento'
              &&
              a.lineaDeServicio === 'Problemas')
              && a.facurable == 'SI'
    );
  });

  //definimos un arreglo temporal para hacer unicos los objetos
  let jsontemporal = [];
  jsonDataReqArray.forEach(element => {
    let tmp = this.agregarJson(element);
    jsontemporal.push(tmp);
  });

  this.jsonDataService.setjsonDataReqService(jsontemporal);
}


/*
  Fitrar Contrato = Mantenimiento
  Filtrar Bloque = Cancelaciones
*/
filtrarSol(jsonDataReqArray: any){
  jsonDataReqArray = jsonDataReqArray.filter(a => {
    return (
              a.contrato === 'Mantenimiento'
              &&
              a.bloque === 'Cancelaciones'
    );

    //definimos un arreglo temporal para hacer unicos los objetos
    let jsontemporal = [];
    jsonDataReqArray.forEach(element => {
      let tmp = this.agregarJson(element);
      jsontemporal.push(tmp);
    });

    this.jsonDataService.setjsonDataSolService(jsontemporal);
  });
}

guardar() {
    if(this.estadoReq==4){
      this.formulario.value.requerimientos = null;
      return 1;
    }

    if(this.estadoSol==4){
      this.formulario.value.solicitudes = null;
      return 1;
    }

    if (this.formulario.invalid) {
      Object.values(this.formulario.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
        control.markAsTouched();
        }
      });
    } else {
        this.jsonDataService.setFechaInforme(this.formulario.value.fecha);

        if (this.jsonDataReq == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
          return;
        }

        if (this.jsonDataSol == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Solicitudes');
          return;
        }

        if(this.feriados == null){
          this.sweetAlerService.mensajeError('Feriados', 'No se ha podido obtener los feriados');
          return;
        }

        this.sweetAlerService.mensajeOK('Resumen SLA generado exitosamente').then(          
          resp => {
            if (resp.value) {
              this.feriadosService.setFeriados(this.feriados);
          
              //borramos campos que no se necesitan
              this.formulario.value.requerimientos = null;
              this.formulario.value.solicitudes = null;

              this.router.navigateByUrl('/sla-generar');        
            }
          }
        );
    }
 }

 crearFormulario() {
  this.formulario = this.formBuilder.group({
      requerimientos : ['', [Validators.required]],
      solicitudes : ['', [Validators.required]],
      fecha : ['', [Validators.required]],
    });
  }

  get requerimientosNoValido() {
    return this.formulario.get('requerimientos').invalid && this.formulario.get('requerimientos').touched;
  }

  get solicitudesNoValido() {
    return this.formulario.get('solicitudes').invalid && this.formulario.get('solicitudes').touched;
  }

  get fechaNoValido() {
    return this.formulario.get('fecha').invalid && this.formulario.get('fecha').touched;
  }

  //devuelve un arreglo con los valores a enviar
  agregarJson(ars){
    let tmp = [];
    tmp['nroReq'] = ars['nroReq'];
    tmp['fecRealEstimacion'] = ars['fecRealEstimacion'];
    tmp['fecRealInicio'] = ars['fecRealInicio'];
    tmp['fecPlanPaseAprobacion'] = ars['fecPlanPaseAprobacion'];
    tmp['fecRealPaseAprobacion'] = ars['fecRealPaseAprobacion'];
    tmp['fecRealFin'] = ars['fecRealFin'];
    tmp['fecPlanPaseProduccion'] = ars['fecPlanPaseProduccion'];
    tmp['fecRealPaseProduccion'] = ars['fecRealPaseProduccion'];
    tmp['contrato'] = ars['contrato'];
    tmp['lineaDeServicio'] = ars['lineaDeServicio'];

    tmp['fechaRecepcion'] = ars['fechaRecepcion'];

    tmp['horasEstimadas'] = ars['horasEstimadas'];
    tmp['horasIncurridas'] = ars['horasIncurridas'];
    tmp['bloque'] = ars['bloque'];

    tmp['responsable'] = ars['responsable'];
    
    tmp['estado'] = ars['estado'];
    return tmp;
  }

  //valida que el tipo del archivo contenga la palabra sheet
  validarTipo(event){
    if(event.target.files[0]){
      let tipo = event.target.files[0].type;
      if (!tipo.includes('sheet')) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo es invalido');
        return false;
      }else{
        return true;
      }
    }
  }
}
