import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { JsonDataService } from 'src/app/services/json-data.service';


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
  jsonDataSol = null;
  jsonDataEve = null;
  jsonDataFac = null;

  constructor(private formBuilder: FormBuilder, private jsonDataService: JsonDataService) {

    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  uploadReq(event) {
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      this.jsonDataReq = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(this.jsonDataReq);
      // console.log(this.jsonDataReq.Requerimientos[0]);
      this.filtrarReq(this.jsonDataReq);
      // console.log(this.jsonDataReq);
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
  let workBook = null;
  const reader = new FileReader();
  const file = event.target.files[0];
  reader.onload = (event) => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' });
    this.jsonDataEve = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      return initial;
    }, {});
    const dataString = JSON.stringify(this.jsonDataEve);
    // console.log(this.jsonDataEve.Eveuerimientos[0]);
    // console.log(this.jsonDataEve);
    this.filtrarEve(this.jsonDataEve);
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
  guardar(){

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
    }
  }



  crearFormulario() {

    this.forma = this.formBuilder.group({
      // correo : ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],

      requerimientos : ['', [Validators.required]],
      solicitudes : ['', [Validators.required]],
      eventos : ['', [Validators.required]],
      facturacion : ['', [Validators.required]],
      anno : ['', [Validators.required]],
      mes : ['', [Validators.required]],
    });

  }

  get requerimientosNoValido() {
    return this.forma.get('requerimientos').invalid && this.forma.get('requerimientos').touched;
  }
  get solicitudesNoValido() {
    return this.forma.get('solicitudes').invalid && this.forma.get('solicitudes').touched;
  }
  get eventosNoValido() {
    return this.forma.get('eventos').invalid && this.forma.get('eventos').touched;
  }
  get facturacionNoValido() {
    return this.forma.get('facturacion').invalid && this.forma.get('facturacion').touched;
  }
  get annoNoValido() {
    return this.forma.get('anno').invalid && this.forma.get('anno').touched;
  }
  get mesNoValido() {
    return this.forma.get('mes').invalid && this.forma.get('mes').touched;
  }

}
