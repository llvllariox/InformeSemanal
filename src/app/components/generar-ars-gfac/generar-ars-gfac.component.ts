import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { JsonDataService } from 'src/app/services/json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { JspdfService } from '../../services/jspdf.service';
import * as moment from 'moment'; // add this 1 of 4

@Component({
  selector: 'app-generar-ars-gfac',
  templateUrl: './generar-ars-gfac.component.html',
  styles: [
  ]
})

export class GenerarArsGfacComponent implements OnInit {

  forma: FormGroup;
  name = 'This is XLSX TO JSON CONVERTER';
  jsonDataReq = null; //REQUERIMIENTOS
  jsonDataTar = null; //JIRA
  jsonDataFac = null; //HITOS
  nuevosHeaders = [];
  fechaHoy = '';
  estadoReq = 1;
  estadoTar = 1;
  estadoFac = 1;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private jsonDataService: JsonDataService, private sweetAlerService: SweetAlertService, private router: Router
            , private jspdfService: JspdfService) {

    this.jsonDataService.jsonDataReqService = null;
    this.jsonDataService.jsonDataTarService = null;
    this.jsonDataService.jsonDataFacService = null;
    this.jsonDataService.jsonMasEve = null;
    this.jsonDataService.infoCargada = false;
    this.jsonDataService.ReqAgrupado = [];
    this.jsonDataService.facAgrupado = [];
    this.crearFormulario();
    const currentDate = new Date().toISOString().substring(0, 10);
  }

  ngOnInit(): void {
  }

  uploadFac(event) {
    if (!this.validarTipo(event)){
      this.estadoFac = 4;
      return;
    }
    this.jsonDataFac = null;
    this.estadoFac = 2;
    // this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates: true  });
      if (workBook.SheetNames[0] !== 'Datos Facturación'){
        this.estadoFac = 4;
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Consolidado de Facturacion');
        this.jsonDataFac = null;
        return;
      }
      this.jsonDataFac = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        if (name === 'Datos Facturación'){
          this.formatHeaders(sheet, 'F1');
        }
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.estadoFac = 3;
        // this.sweetAlerService.close();
        return initial;
      }, {});
      if (this.jsonDataFac['Datos Facturación'] === undefined) {
        this.estadoFac = 4;
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
  
  click(archivo){

    setTimeout(() => {
      switch (archivo) {
        case 1:
          this.estadoReq = 2;
          break;
        case 2:
          this.estadoTar = 2;
          break;
        case 4:
          this.estadoFac = 2;
          break;
      }
    }, 1000);
    
  }

  uploadTar(event) {
    console.log(event);
    if (!this.validarTipo(event)){
      this.estadoTar = 4;
      return;
    }
    this.jsonDataTar = null;
    this.estadoTar = 2;

    // this.sweetAlerService.mensajeEsperar();
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      
      workBook = XLSX.read(data, { type: 'binary', cellDates: true });
      // if (workBook.SheetNames[0] !== 'Detalle Tareas'){
      //   this.estadoTar = 4;
      //   this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Tareas');
      //   this.jsonDataTar = null;
      //   return;
      // }
      this.jsonDataTar = workBook.SheetNames.reduce((initial, name) => {
      
        const sheet = workBook.Sheets[name];
        this.formatHeadersTar(sheet, 'I3');
 
        initial[name] = XLSX.utils.sheet_to_json(sheet,{range:2});
    
        // this.sweetAlerService.close();
        this.estadoTar = 3;
        return initial;
    
      }, {});
  
      console.log(this.jsonDataTar);
      if (this.jsonDataTar['Sheet0'] === undefined) {
        this.estadoTar = 4;
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

  jsonDataReq['Sheet0'] = jsonDataReq['Sheet0'].filter(a => {
    return a.tipoDeIncidencia !== 'Distribución';
  });

  // jsonDataReq['Detalle Tareas'] = jsonDataReq['Detalle Tareas'].filter(a => {
  //   return a.tipoContrato === 'Evolutivo';
  // });

  this.jsonDataService.setjsonDataTarService(jsonDataReq);

}
  uploadReq(event) {
    // console.log(event);
    if (!this.validarTipo(event)){
      this.estadoReq = 4;
      return;
    }
    this.jsonDataReq = null;
    this.estadoReq = 2;
    // this.sweetAlerService.mensajeEsperar();
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
        this.formatHeaders(sheet, 'AO1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        // this.sweetAlerService.close();
        this.estadoReq = 3;
        return initial;
      }, {});
      if (this.jsonDataReq.Requerimientos === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        this.estadoReq = 4;
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

filtrarReq(jsonDataReq: any) {

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.lineaDeServicio === 'Evolutivo Mayor';
  });

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.contrato === 'Evolutivo';
  });

  // jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
  //   return a.etapa !== 'Comprometido';
  // });

  // jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
  //   return a.etapa !== 'Plan';
  // });

  this.jsonDataService.setjsonDataReqService(jsonDataReq);

}

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
        this.jspdfService.fechaInformes = this.forma.value.fecha;

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
      facturacion : ['']
    });

  }

  get requerimientosNoValido() {
    return this.forma.get('requerimientos').invalid && this.forma.get('requerimientos').touched;
  }
  get tareasNoValido() {
    return this.forma.get('tareas').invalid && this.forma.get('tareas').touched;
  }

  get facturacionNoValido() {
    return this.forma.get('facturacion').invalid && this.forma.get('facturacion').touched;
  }

  }

