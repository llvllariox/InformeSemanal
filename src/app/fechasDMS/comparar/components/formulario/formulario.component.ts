import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

import { DmsJsonDataService } from '../../services/dms-json-data.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioFechasDMSCompararComponent implements OnInit {
  formulario: FormGroup;
  estadoDmsA = 1;
  estadoDmsB = 1;
  jsonDataDmsA = null;
  jsonDataDmsB = null;

  constructor(
    private formBuilder: FormBuilder, 
    private jsonDataService: DmsJsonDataService,
    private sweetAlerService: SweetAlertService,
    private router: Router) {
      this.crearFormulario();
  }

  ngOnInit(): void {
  }

  crearFormulario() {
    this.formulario = this.formBuilder.group({
        dmsA : ['', [Validators.required]],
        dmsB : ['', [Validators.required]],
      });
  }

  //transforma la data a JSON - reporte: A | B
  uploadDms(event, reporte) {
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];

    if(reporte=='A') {
      this.jsonDataDmsA = null;
      this.estadoDmsA = 2;
    } else if(reporte=='B') {
      this.jsonDataDmsB = null;
      this.estadoDmsB = 2;
    }

    if(!this.validarTipo(file)){
      if(reporte=='A') this.estadoDmsA = 4;
      else if(reporte=='B') this.estadoDmsB = 4;
      return;
    }

    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });

      if (workBook.SheetNames[0] !== 'DMS Detalle'){
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
        if(reporte=='A') {
          this.jsonDataDmsA = null;
          this.estadoDmsA = 4;
        }
        else if(reporte == 'B') {
          this.jsonDataDmsB = null;
          this.estadoDmsB = 4;
        }

        return;
      }

      if(reporte=='A') {
        this.jsonDataDmsA = workBook.SheetNames.reduce((initial, name) => {
          if(name == 'DMS Detalle'){
            const sheet = workBook.Sheets[name];
  
            this.formularioHeaders(sheet, 'P1');
            XLSX.utils.sheet_to_json(sheet);
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            this.estadoDmsA = 3;
          }
          return initial;
        }, {});
      } else if(reporte=='B') {
        this.jsonDataDmsB = workBook.SheetNames.reduce((initial, name) => {
          if(name == 'DMS Detalle'){
            const sheet = workBook.Sheets[name];
  
            this.formularioHeaders(sheet, 'P1');
            XLSX.utils.sheet_to_json(sheet);
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            this.estadoDmsB = 3;
          }
          return initial;
        }, {});
      }

      if(reporte=='A') {
        if (this.jsonDataDmsA['DMS Detalle'] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.estadoDmsA = 4;
          this.jsonDataDmsA = null;
        } else {
          this.jsonDataService.setJsonDataDmsService(this.jsonDataDmsA['DMS Detalle'], reporte);
        }
      } else if(reporte=='B') {
        if (this.jsonDataDmsB['DMS Detalle'] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          this.estadoDmsB = 4;
          this.jsonDataDmsB = null;
        } else {
          this.jsonDataService.setJsonDataDmsService(this.jsonDataDmsB['DMS Detalle'], reporte);
        }
      }      
    };

    reader.readAsBinaryString(file);
  }

  generar(){
    if(this.estadoDmsA==4 || this.estadoDmsB==4){
      this.formulario.value.dms = null;
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
        if (this.jsonDataDmsA == null || this.jsonDataDmsB == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }

        this.sweetAlerService.mensajeOK('Fechas comparadas exitosamente').then(          
          resp => {
            if (resp.value) {
          
              //borramos campos que no se necesitan
              this.formulario.value.dmsA = null;
              this.formulario.value.dmsB = null;

              //this.router.navigateByUrl('/fechasDMS-comparar');        
              this.router.navigateByUrl('/fechasDMS-comparar/mostrar');
            }
          }
        );
    }
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

   //valida que el tipo del archivo contenga la palabra sheet
   validarTipo(file){
    if(file){
      let tipo = file.type;
      if (!tipo.includes('sheet')) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo es invalido');
        return false;
      }else{
        return true;
      }
    }
  }

  get dmsANoValido() {
    return this.formulario.get('dmsA').invalid && this.formulario.get('dmsA').touched;
  }

  get dmsBNoValido() {
    return this.formulario.get('dmsB').invalid && this.formulario.get('dmsB').touched;
  }
}
