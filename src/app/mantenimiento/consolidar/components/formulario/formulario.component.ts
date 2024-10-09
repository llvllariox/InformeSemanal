import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { SweetAlertService } from 'src/app/services/sweet-alert.service';

import * as XLSX from 'xlsx';
import { ConsolidarDataService } from '../../services/consolidar-json-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'consolidar-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioConsolidarComponent implements OnInit {

  public formulario: FormGroup;

  public estadoHoras: number[];

  public jsonDataHoras = null;
  public jsonDataHorasComercial = null;
  public jsonDataHorasTransaccional = null;

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  constructor(
    private formBuilder: FormBuilder,
    private sweetAlertService: SweetAlertService,
    private consolidarDataService: ConsolidarDataService,
    private router: Router
  ) {
    this.crearFormulario();

    this.estadoHoras = [];
    this.monthNames.forEach(mes => {
        this.estadoHoras[mes] = 1;
    });
  }

  ngOnInit(): void {
  }

  //se activa al hacer submit
  generar(){
    this.monthNames.forEach(mes => {
      if(this.estadoHoras[mes]==4){
        this.formulario.value.horas = null;
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
        return 1;
      }
    });

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
      this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
    } else {
        this.sweetAlertService.mensajeOK('Informe semanal generado exitosamente').then(          
          resp => {
            if (resp.value) {
              //borramos campos que no se necesitan
              this.formulario.value.horas = null;

              this.router.navigateByUrl('/mantenimiento/consolidar/mostrar');
            }
          }
        );
    }
  }

  //cambia el estado de la variable dependiendo de mes
  cambiarEstado(mes: string, estado: number){
    this.estadoHoras[mes] = estado;
  }

  //se activa con el evento change del campo de horas/mes 
  uploadHoras(event, mes: string){
    if(!this.validarTipo(event)){
      this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
      this.cambiarEstado(mes, 4);
      return;
    }

    this.jsonDataHoras = [];
    this.cambiarEstado(mes, 2);
    
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      
      if (
        (
          workBook.SheetNames[0] !== 'CO'
          &&
          workBook.SheetNames[1] !== 'CO'
        )
        ||
        (
          workBook.SheetNames[0] !== 'TRX'
          &&
          workBook.SheetNames[1] !== 'TRX'
        )
      ){
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
        this.cambiarEstado(mes, 4);
        this.jsonDataHoras = [];
        return;
      }

      this.jsonDataHoras = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formularioHeaders(sheet, 'F1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);

        this.cambiarEstado(mes, 3);
        return initial;
      }, {});
    
      if (
        this.jsonDataHoras['CO'] === undefined
        ||
        this.jsonDataHoras['TRX'] === undefined
      ) {
        this.sweetAlertService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
        this.cambiarEstado(mes, 4);
        this.jsonDataHoras = [];
      } else {
        let tmpCO = this.jsonDataHoras['CO'];
        let tmpTRX = this.jsonDataHoras['TRX'];

        this.jsonDataHoras['CO'].pop();
        this.jsonDataHoras['TRX'].pop();

        this.consolidarDataService.setJsonDataHorasComercial(tmpCO, mes);
        this.consolidarDataService.setJsonDataHorasTransaccional(tmpTRX, mes);
      }
    };
    reader.readAsBinaryString(file);
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

  //headers de la hoja de calculo
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

  //crea el objeto formulario
  crearFormulario() {
    this.formulario = this.formBuilder.group({
        horasEnero: [''],
        horasFebrero: [''],
        horasMarzo: [''],
        horasAbril: [''],
        horasMayo: [''],
        horasJunio: [''],
        horasJulio: [''],
        horasAgosto: [''],
        horasSeptiembre: [''],
        horasOctubre: [''],
        horasNoviembre: [''],
        horasDiciembre: [''],
    });
  }

  get horasEneroNoValido() {
    return
     this.formulario.get('horasEnero').invalid 
     && 
     this.formulario.get('horasEnero').touched;
  }

  get horasFebreroNoValido() {
    return
     this.formulario.get('horasFebrero').invalid 
     && 
     this.formulario.get('horasFebrero').touched;
  }

  get horasMarzoNoValido() {
    return
     this.formulario.get('horasMarzo').invalid 
     && 
     this.formulario.get('horasMarzo').touched;
  }

  get horasAbrilNoValido() {
    return
     this.formulario.get('horasAbril').invalid 
     && 
     this.formulario.get('horasAbril').touched;
  }

  get horasMayoNoValido() {
    return
     this.formulario.get('horasMayo').invalid 
     && 
     this.formulario.get('horasMayo').touched;
  }

  get horasJunioNoValido() {
    return
     this.formulario.get('horasJunio').invalid 
     && 
     this.formulario.get('horasJunio').touched;
  }

  get horasJulioNoValido() {
    return
     this.formulario.get('horasJulio').invalid 
     && 
     this.formulario.get('horasJulio').touched;
  }

  get horasAgostoNoValido() {
    return
     this.formulario.get('horasAgosto').invalid 
     && 
     this.formulario.get('horasAgosto').touched;
  }

  get horasSeptiembreNoValido() {
    return
     this.formulario.get('horasSeptiembre').invalid 
     && 
     this.formulario.get('horasSeptiembre').touched;
  }

  get horasOctubreNoValido() {
    return
     this.formulario.get('horasOctubre').invalid 
     && 
     this.formulario.get('horasOctubre').touched;
  }

  get horasNoviembreNoValido() {
    return
     this.formulario.get('horasNoviembre').invalid 
     && 
     this.formulario.get('horasNoviembre').touched;
  }

  get horasDiciembreNoValido() {
    return
     this.formulario.get('horasDiciembre').invalid 
     && 
     this.formulario.get('horasDiciembre').touched;
  }
}

/*
  estadoHoras = 1 -> right
  estadoHoras = 2 -> spinner
  estadoHoras = 3 -> success
  estadoHoras = 4 -> danger
*/