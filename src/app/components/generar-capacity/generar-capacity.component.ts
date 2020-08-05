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
  jsonDataPlanCS = null;

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

  ngOnInit(): void {
  }

  uploadPlan(event) {
    // console.log(event);
    if (!this.validarTipo(event)){
      return;
    }
    this.jsonDataPlan = null;
    this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      // console.log(workBook);
      if (workBook.SheetNames[0] !== 'Detalle Horas Planificadas'){
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Plan');
        this.jsonDataPlan = null;
        return;
      }
      this.jsonDataPlan = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        // console.log(sheet);
        this.formatHeaders(sheet, 'BA1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.sweetAlerService.close();

        return initial;
      }, {});

      if (this.jsonDataPlan['Detalle Horas Planificadas'] === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Plan');
        this.jsonDataPlan = null;
      } else {
        this.filtrarTar(this.jsonDataPlan);
        console.log(this.jsonDataPlan);
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

  // let jsonDataCS = [...jsonDataReq['Detalle Horas Planificadas']];
  // console.log(jsonDataCS);

  // jsonDataReq['Detalle Horas Planificadas'] = jsonDataReq['Detalle Horas Planificadas'].filter(a => {
  //   return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Asesoramiento y Consulta';
  // });

  // jsonDataCS = jsonDataCS.filter(a => {
  //   return a.lineaDeServicio === 'Capacity Service' &&  a.numeroArs !== 434;
  // });

  // jsonDataReq['Detalle Tareas'] = jsonDataReq['Detalle Tareas'].filter(a => {
  //   return a['Tipo Contrato'] === 'Evolutivo';
  // });

  this.capacityService.setjsonDataPlanService(jsonDataReq);
  // this.capacityService.setjsonDataPlanServiceCS(jsonDataCS);

}
  validarTipo(event){

    let tipo = event.target.files[0].type;
    // console.log(tipo);
    if (!tipo.includes('sheet')) {
      // console.log('entro');
      this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Plan');
      return false;
    }else{
      return true;
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
        this.capacityService.horasMtto = 3780;
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
      // tareas : ['', [Validators.required]],
      // eventos : ['', [Validators.required]],
      // facturacion : ['', [Validators.required]],
      // anno : ['', [Validators.required]],
      // mes : ['', [Validators.required]],
    });

  }

  get planificacionNoValido() {
    return this.forma.get('planificacion').invalid && this.forma.get('planificacion').touched;
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



