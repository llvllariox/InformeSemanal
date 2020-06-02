import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { JsonDataService } from 'src/app/services/json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';


@Component({
  selector: 'app-generar-informe',
  templateUrl: './generar-informe.component.html',
  styles: []
})
export class GenerarInformeComponent implements OnInit {

  forma: FormGroup;
  // file: File = null;
  name = 'This is XLSX TO JSON CONVERTER';
  // willDownload = false;
  jsonDataReq = null;
  jsonDataTar = null;
  jsonDataEve = null;
  jsonDataFac = null;

  constructor(private formBuilder: FormBuilder, private jsonDataService: JsonDataService, private sweetAlerService: SweetAlertService) {

    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  uploadTar(event) {
    this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      this.jsonDataTar = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.sweetAlerService.close();

        return initial;
      }, {});
      const dataString = JSON.stringify(this.jsonDataTar);

      if(this.jsonDataTar['Detalle Tareas']==undefined) {
        console.log('nok');
        console.log(this.jsonDataTar);
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Tareas');
        this.jsonDataTar = null;
      } else {
        console.log('ok');
        console.log(this.jsonDataTar);
        this.filtrarTar(this.jsonDataTar);
      }
    };
    reader.readAsBinaryString(file);

 }


filtrarTar(jsonDataReq: any) {

  jsonDataReq['Detalle Tareas'] = jsonDataReq['Detalle Tareas'].filter(a => {
    return a['Línea de Servicio'] === 'Evolutivo Mayor';
  });

  jsonDataReq['Detalle Tareas'] = jsonDataReq['Detalle Tareas'].filter(a => {
    return a['Tipo Contrato'] === 'Evolutivo';
  });

  this.jsonDataService.setjsonDataTarService(jsonDataReq);

}
  uploadReq(event) {
    this.sweetAlerService.mensajeEsperar();
    // let minDate = new Date('Sun Dec 31 1899 00:00:00 GMT-0442 (hora de verano de Chile)');
    // console.log('REQ');
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true});
      this.jsonDataReq = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.sweetAlerService.close();
        return initial;
      }, {});
      const dataString = JSON.stringify(this.jsonDataReq);
      if(this.jsonDataReq.Requerimientos==undefined) {
        // console.log('nok');
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        this.jsonDataReq = null;
      } else {
        // console.log('ok');
        this.filtrarReq(this.jsonDataReq);
      }
    };
    reader.readAsBinaryString(file);

 }


filtrarReq(jsonDataReq: any){

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a['Línea de Servicio'] === 'Evolutivo Mayor';
  });

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a['Contrato'] === 'Evolutivo';
  });

  this.jsonDataService.setjsonDataReqService(jsonDataReq);

}

uploadEve(event) {
  this.sweetAlerService.mensajeEsperar();
  let workBook = null;
  const reader = new FileReader();
  const file = event.target.files[0];
  reader.onload = (event) => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' , cellDates: true });
    this.jsonDataEve = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      this.sweetAlerService.close();

      return initial;
    }, {});
    const dataString = JSON.stringify(this.jsonDataEve);
    if (this.jsonDataEve.Eventos==undefined) {
      // console.log('nok');
      this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Eventos');
      this.jsonDataEve = null;
    } else {
      // console.log('ok');
      this.filtrarEve(this.jsonDataEve);
    }
  };
  reader.readAsBinaryString(file);
}

filtrarEve(jsonDataEve: any){

  jsonDataEve.Eventos = jsonDataEve.Eventos.filter(a => {
    return a['Línea de servicio'] === 'Evolutivo Mayor';
  });

  jsonDataEve.Eventos = jsonDataEve.Eventos.filter(a => {
    return a['Tipo de contrato'] === 'Evolutivo';
  });

  jsonDataEve.Eventos = jsonDataEve.Eventos.filter(a => {
    return a['Tipo'] === 'REQ';
  });

  this.jsonDataService.setjsonDataEveService(jsonDataEve);

}
  guardar() {

    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
        control.markAsTouched();
        }
      });
    } else {
      // console.log('vaildo');
        // TODO SACAR DE ACA-----------------------------------------------------------------------------
        this.jsonDataService.consolidarArchivos();
        this.sweetAlerService.mensajeOK('Informe Semanal Generado Exitosamente');
      // ----------------------------------------------------------------------------------------------
    }
  }

  crearFormulario() {

    this.forma = this.formBuilder.group({

      requerimientos : ['', [Validators.required]],
      tareas : ['', [Validators.required]],
      eventos : ['', [Validators.required]],
      facturacion : ['', [Validators.required]],
      // anno : ['', [Validators.required]],
      // mes : ['', [Validators.required]],
    });

  }

  get requerimientosNoValido() {
    return this.forma.get('requerimientos').invalid && this.forma.get('requerimientos').touched;
  }
  get tareasNoValido() {
    return this.forma.get('tareas').invalid && this.forma.get('tareas').touched;
  }
  get eventosNoValido() {
    return this.forma.get('eventos').invalid && this.forma.get('eventos').touched;
  }
  get facturacionNoValido() {
    return this.forma.get('facturacion').invalid && this.forma.get('facturacion').touched;
  }
  // get annoNoValido() {
  //   return this.forma.get('anno').invalid && this.forma.get('anno').touched;
  // }
  // get mesNoValido() {
  //   return this.forma.get('mes').invalid && this.forma.get('mes').touched;
  // }

}
