import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
// import { JsonDataService } from 'src/app/services/json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
// import * as moment from 'moment'; // add this 1 of 4
import { CapacityService } from '../../services/capacity.service';

@Component({
  selector: 'app-generar-capacity',
  templateUrl: './generar-capacity.component.html',
  styles: []
})
export class GenerarCapacityComponent implements OnInit {

  forma: FormGroup;
  name = 'This is XLSX TO JSON CONVERTER';
  jsonDataPlan = null;
  jsonDataReq = null;
  jsonDataPlanCS = null;
  estadoPlan = 1;
  estadoReq = 1;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private capacityService: CapacityService, private sweetAlerService: SweetAlertService, private router: Router) {
    this.capacityService.jsonDataPlanService = null;
    this.capacityService.jsonDataPlanServiceCS = null;
    this.capacityService.planAgrupado = [];
    this.capacityService.planAgrupadoCS = [];
    // this.jsonDataService.jsonDataFacService = null;
    // this.jsonDataService.infoCargada = false;

    this.crearFormulario();

    // moment.lang('es');
    // let now = moment();
  }
  
  click(archivo){
    setTimeout(() => {
      switch (archivo) {
        case 1:
          this.estadoPlan = 2;
          break;
        case 2:
          this.estadoReq = 2;
          break;
      }
    }, 1000);
  }

  ngOnInit(): void {
  }

  uploadPlan(event) {
    if (!this.validarTipo(event)){
      this.estadoPlan = 4;
      return;
    }
    this.jsonDataPlan = null;
    this.estadoPlan = 2;
    // this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      if (workBook.SheetNames[0] !== 'Detalle Horas Planificadas'){
        this.estadoPlan = 4;
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Plan');
        this.jsonDataPlan = null;
        return;
      }
      this.jsonDataPlan = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formatHeaders(sheet, 'BA1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.estadoPlan = 3;
        // this.sweetAlerService.close();

        return initial;
      }, {});

      if (this.jsonDataPlan['Detalle Horas Planificadas'] === undefined) {
        this.estadoPlan = 4;
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Plan');
        this.jsonDataPlan = null;
      } else {
        this.filtrarTar(this.jsonDataPlan);
        console.log(this.jsonDataPlan);
      }
    };
    reader.readAsBinaryString(file);
 }

  //se gatilla al cambiar el campo file del formulario
  uploadReq(event) {
    if (!this.validarTipoReq(event)){
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
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
    
      if (workBook.SheetNames[0] !== 'Requerimientos'){
        this.estadoReq = 4;
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
        this.jsonDataReq = null;
        return;
      }

      this.jsonDataReq = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formatHeaders(sheet, 'AO1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.estadoReq = 3;

        return initial;
      }, {});

      if (this.jsonDataReq['Requerimientos'] === undefined) {
        this.estadoReq = 4;
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
        this.jsonDataReq = null;
      } else {
        this.jsonDataReq = this.jsonDataReq['Requerimientos'];
        this.filtrarReq(this.jsonDataReq);
        this.prepararEnvio();
        this.capacityService.setjsonDataReqService(this.jsonDataReq);
      }
  };
  reader.readAsBinaryString(file);
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

  filtrarTar(jsonDataReq: any) {
    this.capacityService.setjsonDataPlanService(jsonDataReq);
  }

  //se aplican filtros sobre los requisitos
  filtrarReq(jsonDataReq: any) {
    jsonDataReq = jsonDataReq.filter(a => {
      return (
                a.lineaDeServicio === 'Capacity Service'
                && a.estado === '01 En curso'
                && a.prioridad !== 'No Aplica'

                //&& a.bloque==='VS - Transacciones y Procesamiento'
                //&& a.origen==='Keyciren Trigo'
              );
    });

    this.jsonDataReq = jsonDataReq;
  }

  validarTipo(event){
    if(event.target.files[0]){
      let tipo = event.target.files[0].type;
      if (!tipo.includes('sheet')) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Plan');
        return false;
      }else{
        return true;
      }
    }
  }

  //retorna true si el archivo de requisitos es una hoja de calculo
  validarTipoReq(event){
    if(event.target.files[0]){
      let tipo = event.target.files[0].type;
      if (!tipo.includes('sheet')) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requisitos');
        return false;
      }else{
        return true;
      }
    }
  }

guardar() {

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

        if (this.jsonDataPlan == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Plan');
          return;
        }

        //Requerimientos
        if (this.jsonDataReq == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
          return;
        }

        // this.capacityService.horasMtto = 3780;
        this.capacityService.generarCapacity();

        this.sweetAlerService.mensajeOK('Capacity Generado Exitosamente').then(
          resp => {
            if (resp.value) {
              this.router.navigateByUrl('/verCapacity');
            }
          }
        );
      // ----------------------------------------------------------------------------------------------
    }
  }

  crearFormulario() {

    this.forma = this.formBuilder.group({

      planificacion : ['', [Validators.required]],
      requerimientos : ['', [Validators.required]],
      // tareas : ['', [Validators.required]],
      // eventos : ['', [Validators.required]],
      // facturacion : ['', [Validators.required]],
      // anno : ['', [Validators.required]],
      // mes : ['', [Validators.required]],
    });

  }

  //dejamos solamente los campos que vamos a usar
  prepararEnvio(){
    let arrayTemp = [];

    this.jsonDataReq.forEach(element => {
      let req = [];
      req['bloque'] = element.bloque;
      req['origen'] = element.origen;
      req['prioridad'] = element.prioridad;
      req['fechaRecepcion'] = element.fechaRecepcion;
      arrayTemp.push(req);
    });

    this.jsonDataReq = arrayTemp;
  }

  get planificacionNoValido() {
    return this.forma.get('planificacion').invalid && this.forma.get('planificacion').touched;
  }

  get requerimientosNoValido() {
    return this.forma.get('requerimientos').invalid && this.forma.get('requerimientos').touched;
  }
  // get tareasNoValido() {
  //   return this.forma.get('tareas').invalid && this.forma.get('tareas').touched;
  // }
  // get eventosNoValido() {
  //   return this.forma.get('eventos').invalid && this.forma.get('eventos').touched;
  // }
  // get facturacionNoValido() {
  //   return this.forma.get('facturacion').invalid && this.forma.get('facturacion').touched;
  // }
  // // get annoNoValido() {
  // //   return this.forma.get('anno').invalid && this.forma.get('anno').touched;
  // // }
  // // get mesNoValido() {
  // //   return this.forma.get('mes').invalid && this.forma.get('mes').touched;
  // // }

}



