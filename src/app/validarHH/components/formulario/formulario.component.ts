import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ValidarHHService } from 'src/app/validarHH/services/validarHH.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioValidarHHComponent implements OnInit {
  formulario: FormGroup;
  jsonDataHoras = null;
  
  estadoHoras = 1;
  
  fechaInforme;
  fechaMin;
  fechaMax;

  constructor(
              private validarHHService: ValidarHHService, 
              private formBuilder: FormBuilder, 
              private sweetAlertService: SweetAlertService,
              private router: Router
             ) { 
                this.crearFormulario();
        
                let hoy = new Date();
                const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
                this.fechaMin = '2015-01';
                this.fechaMax = currentDate;
 
                this.formulario.controls['fecha'].setValue(currentDate);  
                this.validarHHService.setFechaInforme(this.formulario.value.fecha);
              }

  ngOnInit(): void {
  }
  
  //transforma la data a JSON
  uploadHoras(event) {
    if(!this.validarTipo(event)){
      this.estadoHoras = 4;
      return;
    }

    this.jsonDataHoras = null;
    this.estadoHoras = 2;
    
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = () => {
      const data = reader.result;
      try {
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      } catch (error) {
        this.sweetAlertService.mensajeError('ERROR!','ECMA-376 Encrypted file');
      }
     // workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      //if (workBook.SheetNames[0] !== 'Forecasted Time Details'){
      
      if (workBook.SheetNames[0] !== 'AIA00gb_PBIPg_ForecastedTimeDet'){
        console.log("ERROR 1:",workBook.SheetNames[0]);
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
        this.estadoHoras = 4;
        this.jsonDataHoras = null;
        return;
      }

      this.jsonDataHoras = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
      //  if(name == 'Forecasted Time Details') {
        if(name == 'AIA00gb_PBIPg_ForecastedTimeDet') {
          this.formularioHeaders(sheet, 'AB', 2);
          initial[name] = XLSX.utils.sheet_to_json(sheet, {range:1});

          this.estadoHoras = 3;
        }
        
        return initial;
      }, {});
   
    //  if (this.jsonDataHoras['Forecasted Time Details'] === undefined) {
      if (this.jsonDataHoras['AIA00gb_PBIPg_ForecastedTimeDet'] === undefined) {
        console.log("ERROR 2:",this.jsonDataHoras['AIA00gb_PBIPg_ForecastedTimeDet']);
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
        this.estadoHoras = 4;
        this.jsonDataHoras = null;
      } else {
       // this.jsonDataHoras = this.jsonDataHoras['Forecasted Time Details'];
        this.jsonDataHoras = this.jsonDataHoras['AIA00gb_PBIPg_ForecastedTimeDet'];
      }
    };
    reader.readAsBinaryString(file);
  
  } 

  //genera el informe
  generar() {
    if(this.estadoHoras==4){
      this.formulario.value.horas = null;
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
        if (this.jsonDataHoras == null) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
          return;
        }

        if (this.jsonDataHoras == null) {
          this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
          return;
        }

        //console.log(this.jsonDataHoras);

        this.validarHHService.setJsonDataValidarHH(this.jsonDataHoras);
        this.validarHHService.setFechaInforme(this.formulario.value.fecha);
        
        this.sweetAlertService.mensajeOK('Informe semanal generado exitosamente').then(          
          resp => {
            if (resp.value) {
              //borramos campos que no se necesitan
              this.formulario.value.horas = null;

              this.router.navigateByUrl('/validarHH/mostrar');
            }
          }
        );
    }
  }

  //crea el formulario
  crearFormulario() {
    this.formulario = this.formBuilder.group({
        horas : ['', [Validators.required]],
        fecha : ['', [Validators.required]],
        tipo: ['comercial'],
      });
  }

   //valida que el tipo del archivo contenga la palabra sheet
   validarTipo(event){
    if(event.target.files[0]){
      let tipo = event.target.files[0].type;
      if (!tipo.includes('sheet')) {
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo es invalido');
        return false;
      }else{
        return true;
      }
    }
  }

  formularioHeaders(sheet, limit, fila){
    function camalize(str) {
        str = str.replace(/\./g, '');
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    let abc = ['A',	'B',	'C',	'D',	'E',	'F',	'G',	'H',	'I',	'J',	'K',	'L',
                'M',	'N',	'O',	'P',	'Q',	'R',	'S',	'T',	'U',	'V',	'W',	'X',
                'Y',	'Z',	'AA',	'AB',	'AC',
              ];

    for (const letra of abc) {
      let celda = letra + fila.toString();
      sheet[celda].w = camalize(sheet[celda].w);

      if (letra == limit){
        break;
      }
    }
 }

  get horasNoValido() {
    return this.formulario.get('horas').invalid && this.formulario.get('horas').touched;
  }

  get fechaNoValido() {
    return this.formulario.get('fecha').invalid && this.formulario.get('fecha').touched;
  }
}

/*
  estadoHoras = 1 -> right
  estadoHoras = 2 -> spinner
  estadoHoras = 3 -> success
  estadoHoras = 4 -> danger
*/
