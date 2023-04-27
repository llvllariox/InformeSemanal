import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { DmsJsonDataService } from 'src/app/services/dms-json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fechas',
  templateUrl: './fechas.component.html'
})
export class FechasComponent implements OnInit {
  formulario: FormGroup;
  jsonDataDms = null;
  estadoDms = 1;
  fechaInforme;
  fechaMin;
  fechaMax;
  
  constructor(
    private formBuilder: FormBuilder, 
    private jsonDataService: DmsJsonDataService,
    private sweetAlerService: SweetAlertService,
    private router: Router) { 
      this.crearFormulario();
  
      let hoy = new Date();
      const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
      this.fechaMin = '2015-01';
      this.fechaMax = currentDate;
      this.formulario.controls['fecha'].setValue(currentDate);  

      this.jsonDataService.setFechaInforme(this.formulario.value.fecha);
      this.fechaInforme = new Date(jsonDataService.getFechaInforme() + '-05');
  }

  ngOnInit(): void {
  }

  crearFormulario() {
    this.formulario = this.formBuilder.group({
        dms : ['', [Validators.required]],
        fecha : ['', [Validators.required]],
      });
  }

  click(archivo){
    this.formulario.controls.dms.reset();
    this.estadoDms = 4;
  }

  //si hay archivo se borra y se pide cargar de nuevo
  cambiarFecha(event) {
    //si no ha subido archivo
    this.fechaInforme = new Date(this.formulario.value.fecha + "-05");
  
    if(this.formulario.value.dms){
      this.formulario.controls.dms.reset();
      this.estadoDms = 4;
    }
  }

  //transforma la data a JSON
  uploadDms(event) {
    if(!this.validarTipo(event)){
      this.estadoDms = 4;
      return;
    }


    this.jsonDataDms = null;
    this.estadoDms = 2;
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      
      if (workBook.SheetNames[1] !== 'DMS Detalle'){
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
        this.estadoDms = 4;
        this.jsonDataDms = null;
        return;
      }

      this.jsonDataDms = workBook.SheetNames.reduce((initial, name) => {
        if(name == 'DMS Detalle'){
          const sheet = workBook.Sheets[name];

          this.formularioHeaders(sheet, 'P1');
          XLSX.utils.sheet_to_json(sheet);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.estadoDms = 3;
        }
        return initial;
      }, {});
    
      if (this.jsonDataDms['DMS Detalle'] === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
        this.estadoDms = 4;
        this.jsonDataDms = null;
      } else {
        this.jsonDataService.setJsonDataDmsService(this.jsonDataDms['DMS Detalle']);
      }
    };
    reader.readAsBinaryString(file);    
 }

 //valida que el tipo del archivo contenga la palabra sheet
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

  guardar() {
    if(this.estadoDms==4){
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
        this.jsonDataService.setFechaInforme(this.formulario.value.fecha);

        if (this.jsonDataDms == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
          return;
        }

        this.sweetAlerService.mensajeOK('Fechas validadas exitosamente').then(          
          resp => {
            if (resp.value) {
          
              //borramos campos que no se necesitan
              this.formulario.value.dms = null;

              this.router.navigateByUrl('/fechas-generar');        
            }
          }
        );
    }
  }

  get dmsNoValido() {
    return this.formulario.get('dms').invalid && this.formulario.get('dms').touched;
  }

  get fechaNoValido() {
    return this.formulario.get('fecha').invalid && this.formulario.get('fecha').touched;
  }

}
