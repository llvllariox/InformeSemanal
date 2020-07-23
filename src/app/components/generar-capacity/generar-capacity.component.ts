import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { JsonDataService } from 'src/app/services/json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import * as moment from 'moment'; // add this 1 of 4
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

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private capacityService: CapacityService, private sweetAlerService: SweetAlertService, private router: Router) {


    // this.jsonDataService.jsonDataFacService = null;
    // this.jsonDataService.infoCargada = false;

    this.crearFormulario();

    // moment.lang('es');
    // let now = moment();


  }

  ngOnInit(): void {
  }

  uploadPlan(event) {
    this.jsonDataPlan = null;
    this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      this.jsonDataPlan = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
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


filtrarTar(jsonDataReq: any) {

  jsonDataReq['Detalle Horas Planificadas'] = jsonDataReq['Detalle Horas Planificadas'].filter(a => {
    return a['Línea de Servicio'] === 'Evolutivo Mayor' || a['Línea de Servicio'] === 'Asesoramiento y Consulta';
  });

  // jsonDataReq['Detalle Tareas'] = jsonDataReq['Detalle Tareas'].filter(a => {
  //   return a['Tipo Contrato'] === 'Evolutivo';
  // });

  this.capacityService.setjsonDataPlanService(jsonDataReq);

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

        this.capacityService.generarCapacity();

        this.sweetAlerService.mensajeOK('Capacity Generado Exitosamente').then(
          resp => {
            if (resp.value) {
              // this.router.navigateByUrl('/informes/BO');
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



