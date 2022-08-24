import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { SlaJsonDataService } from 'src/app/services/sla-json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { JspdfService } from '../../services/jspdf.service';

@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html'
})
export class SlaComponent implements OnInit {
  formulario: FormGroup;
  name = 'This is XLSX TO JSON CONVERTER';
  jsonDataReq = null;
  nuevosHeaders = [];
  estadoReq = 1;

  constructor(private formBuilder: FormBuilder, private jsonDataService: SlaJsonDataService, private sweetAlerService: SweetAlertService, private router: Router
    , private jspdfService: JspdfService) {  
      this.jsonDataService.jsonDataReqService = null;
      this.jsonDataService.infoCargada = false;
      this.jsonDataService.ReqAgrupado = [];
      this.crearFormulario();
  }

  ngOnInit(): void {
  }

  click(archivo){
    setTimeout(() => {
      switch (archivo) {
        case 1:
          this.estadoReq = 2;
          break;
        }
    }, 1000);    
  }

  uploadReq(event) {
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
        //PE1
        this.filtrarReqPE1(this.jsonDataReq);
        this.filtrarReq(this.jsonDataReq);
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

 filtrarReq(jsonDataReq: any) {
  this.jsonDataService.setjsonDataReqService(jsonDataReq);
 }

 filtrarReqPE1(jsonDataReq: any) {
  /*
  Filtrar Contrato = Evolutivo
  Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
  Revisar Fecha Recepción = MES del informe
  Validar Fecha Recepción VS Fec. Real Estimación <= 5 días hábiles, Se informa el total
  Liberar filtros
  */

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.contrato === 'Evolutivo';
  });

  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Evolutivo Menor';
  });

  //falta obtener mes del informe
  let mes_actual = 8;
  jsonDataReq.Requerimientos = jsonDataReq.Requerimientos.filter(a => {
    return a.fechaRecepcion.getMonth() === mes_actual;
  });

  this.jsonDataService.setjsonDataReqPE1Service(jsonDataReq);
 }

 guardar() {
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
        if (this.jsonDataReq == null) {
                this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
                return;
        }

        this.jsonDataService.consolidarArchivos();
        this.sweetAlerService.mensajeOK('Resumen SLA generado exitosamente').then(
          resp => {
            if (resp.value) {
              this.router.navigateByUrl('/sla-generar');
            }
          }
        );
    }
 }

 crearFormulario() {
  this.formulario = this.formBuilder.group({
    requerimientos : ['', [Validators.required]],
  });
}

get requerimientosNoValido() {
  return this.formulario.get('requerimientos').invalid && this.formulario.get('requerimientos').touched;
}

}
