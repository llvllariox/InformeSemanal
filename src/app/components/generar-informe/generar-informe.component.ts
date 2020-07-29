import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { JsonDataService } from 'src/app/services/json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';

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
  nuevosHeaders = [];

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

  }

  ngOnInit(): void {
  }

  uploadFac(event) {
    this.jsonDataFac = null;
    this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      this.jsonDataFac = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        console.log(sheet);
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.sweetAlerService.close();
        return initial;
      }, {});
      if (this.jsonDataFac['Datos Facturación'] === undefined) {
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

    this.jsonDataService.setjsonDataFacService(this.jsonDataFac);

  }

  uploadTar(event) {
    this.jsonDataTar = null;
    this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      this.jsonDataTar = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formatHeaders(sheet, 'BH1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.sweetAlerService.close();

        return initial;
      }, {});

      if (this.jsonDataTar['Detalle Tareas'] === undefined) {
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
    return a.lineaDeServicio === 'Evolutivo Mayor';
  });

  jsonDataReq['Detalle Tareas'] = jsonDataReq['Detalle Tareas'].filter(a => {
    return a.tipoContrato === 'Evolutivo';
  });

  this.jsonDataService.setjsonDataTarService(jsonDataReq);

}
  uploadReq(event) {
    this.jsonDataReq = null;
    this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      this.jsonDataReq = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formatHeaders(sheet, 'AO1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.sweetAlerService.close();
        return initial;
      }, {});
      if (this.jsonDataReq.Requerimientos === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        this.jsonDataReq = null;
      } else {
        this.filtrarReq(this.jsonDataReq);
        console.log(this.jsonDataReq);
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

filtrarReq(jsonDataReq: any) {

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.lineaDeServicio === 'Evolutivo Mayor';
  });

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.contrato === 'Evolutivo';
  });

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.etapa !== 'Comprometido';
  });

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.etapa !== 'Plan';
  });

  this.jsonDataService.setjsonDataReqService(jsonDataReq);

}

uploadEve(event) {
  this.jsonDataEve = null;
  this.sweetAlerService.mensajeEsperar();
  let workBook = null;
  const reader = new FileReader();
  const file = event.target.files[0];
  reader.onload = () => {
    const data = reader.result;
    workBook = XLSX.read(data, { type: 'binary' , cellDates: true });
    this.jsonDataEve = workBook.SheetNames.reduce((initial, name) => {
      const sheet = workBook.Sheets[name];
      this.formatHeaders(sheet, 'T1');
      initial[name] = XLSX.utils.sheet_to_json(sheet);
      this.sweetAlerService.close();
      return initial;
    }, {});
    if (this.jsonDataEve.Eventos === undefined) {
      this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Eventos');
      this.jsonDataEve = null;
    } else {
      this.filtrarEve(this.jsonDataEve);
      console.log(this.jsonDataEve);
    }
  };
  reader.readAsBinaryString(file);
}

filtrarEve(jsonDataEve: any) {

  jsonDataEve.Eventos = jsonDataEve.Eventos.filter(a => {
    return a.lineaDeServicio === 'Evolutivo Mayor';
  });

  jsonDataEve.Eventos = jsonDataEve.Eventos.filter(a => {
    return a.tipoDeContrato === 'Evolutivo';
  });

  jsonDataEve.Eventos = jsonDataEve.Eventos.filter(a => {
    return a.tipo === 'REQ';
  });

  this.jsonDataService.setjsonDataEveService(jsonDataEve);

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

        this.jsonDataService.fechaInformes = this.forma.value.fecha;

        // if (this.jsonDataFac == null) {
        //   this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Consolidado de Facturacion');
        //   return;
        // }
        if (this.jsonDataFac == null) {
          this.jsonDataService.conFact = false;
        } else {
          this.jsonDataService.conFact = true;
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
    }
  }

  crearFormulario() {

    this.forma = this.formBuilder.group({

      requerimientos : ['', [Validators.required]],
      tareas : ['', [Validators.required]],
      eventos : ['', [Validators.required]],
      facturacion : [''],
      fecha : ['', [Validators.required]],
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
  get fechaNoValido() {
    return this.forma.get('fecha').invalid && this.forma.get('fecha').touched;
  }
}
