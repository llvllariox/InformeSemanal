import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { JsonDataService } from 'src/app/services/json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import * as moment from 'moment'; // add this 1 of 4



@Component({
  selector: 'app-generar-informe',
  templateUrl: './generar-informe.component.html',
  styles: []
})
export class GenerarInformeComponent implements OnInit {

  forma: FormGroup;
  name = 'This is XLSX TO JSON CONVERTER';
  jsonDataReq = null;
  jsonDataTar = null;
  jsonDataEve = null;
  jsonDataFac = null;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private jsonDataService: JsonDataService, private sweetAlerService: SweetAlertService, private router: Router) {

    this.jsonDataService.jsonDataReqService = null;
    this.jsonDataService.jsonDataEveService = null;
    this.jsonDataService.jsonDataTarService = null;
    this.jsonDataService.jsonDataFacService = null;
    this.jsonDataService.jsonMasEve = null;
    this.jsonDataService.infoCargada = false;
    this.jsonDataService.ReqAgrupado = [];
    this.jsonDataService.facAgrupado = [];

    this.crearFormulario();
    // moment.lang('es');
    // let now = moment();
    // let fecha1 = moment().subtract(1,'months').format('LL');
    // let fecha2 = moment().subtract(2,'months').format('l');
    // let fecha3 = moment().subtract(3,'months').format('l');
    // let fecha4 = moment().subtract(4,'months').format('l');
    // let fecha5 = moment().subtract(5,'months').format('l');
    // let fecha6 = moment().subtract(6,'months').format('l');
    // let fecha7 = moment().subtract(7,'months').format('l');
    // let fecha8 = moment().subtract(8,'months').format('l');
    // let fecha9 = moment().subtract(9,'months').format('l');
    // let fecha10 = moment().subtract(10,'months').format('l');
    // let fecha11 = moment().subtract(11,'months').format('l');
    // let fecha12 = moment().subtract(11,'months').format('l');
    // console.log(fecha1);
  
    
    // let hoy = new Date();
    // console.log(hoy);
    // let mes1 = hoy;
    // let mes2 = hoy.setFullYear(hoy.getFullYear() - 1);
    

  }

  ngOnInit(): void {
  }

  uploadFac(event) {
    this.jsonDataFac = null;
    this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      this.jsonDataFac = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.sweetAlerService.close();

        return initial;
      }, {});
      if(this.jsonDataFac['Datos Facturación']==undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Consolidado de Facturacion');
        this.jsonDataFac = null;
      } else {
        delete this.jsonDataFac['Cuadre'];
        delete this.jsonDataFac['Info Requerimientos'];
        delete this.jsonDataFac['Info Solicitudes'];
        delete this.jsonDataFac['Parametros'];
        delete this.jsonDataFac['Res por mes'];
        delete this.jsonDataFac['Resumen'];
        delete this.jsonDataFac['Temporal'];
        this.filtrarFac(this.jsonDataFac);
        console.log(this.jsonDataFac);

      }
    };
    reader.readAsBinaryString(file);
  }

  filtrarFac(jsonDataReq: any) {

    // this.jsonDataFac['Datos Facturación'] = jsonDataReq['Datos Facturación'].filter(a => {
    //   return a['Línea de Servicio'] === 'Evolutivo Mayor';
    // });

    this.jsonDataService.setjsonDataFacService(this.jsonDataFac);

  }

  uploadTar(event) {
    this.jsonDataTar = null;
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

      if(this.jsonDataTar['Detalle Tareas']==undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Tareas');
        this.jsonDataTar = null;
      } else {
        this.filtrarTar(this.jsonDataTar);
        console.log(this.jsonDataTar);
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
    this.jsonDataReq = null;
    this.sweetAlerService.mensajeEsperar();
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
      if(this.jsonDataReq.Requerimientos==undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        this.jsonDataReq = null;
      } else {
        this.filtrarReq(this.jsonDataReq);
        console.log(this.jsonDataReq);
        let recepc = moment(this.jsonDataReq.Requerimientos[0]['Fecha Recepción']);
        console.log(recepc.format('LL'));

        let anno = '2018';
        let mes = 'noviembre';
        let dia = '20';
        let fecha = dia + '-' + mes  + '-' + anno;
        // console.log(fecha);
        let prueba = moment(fecha);
        console.log(prueba.format('LL'));
        let igual = moment(fecha).isSame(recepc, 'month');
        console.log(igual);
    
        // console.log(recepc);

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

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a['Etapa'] !== 'Comprometido';
  });

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a['Etapa'] !== 'Plan';
  });

  this.jsonDataService.setjsonDataReqService(jsonDataReq);

}

uploadEve(event) {
  this.jsonDataEve = null;
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
    if (this.jsonDataEve.Eventos==undefined) {
      this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Eventos');
      this.jsonDataEve = null;
    } else {
      this.filtrarEve(this.jsonDataEve);
      console.log(this.jsonDataEve);
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

        if (this.jsonDataFac == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Consolidado de Facturacion');
          return;
        }

        if (this.jsonDataTar == null) {
                this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Tareas');
                return;
        }
        if (this.jsonDataReq == null) {
                this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
                return;
        }
        if (this.jsonDataEve == null) {
              this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Eventos');
              return;
        }
        this.jsonDataService.consolidarArchivos();
        this.sweetAlerService.mensajeOK('Informe Semanal Generado Exitosamente').then(
          resp => {
            if (resp.value) {
              this.router.navigateByUrl('/informes/BO');
            }
          }
        );
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
