import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { MantoInformeSemanalService } from '../../services/manto-informe-semanal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-informe-semanal',
  templateUrl: './formulario-informe-semanal.component.html'
})
export class FormularioInformeSemanalComponent implements OnInit {
  formulario: FormGroup;
  jsonDataHoras = null;
  
  estadoHoras = 1;
  
  fechaInforme;
  fechaMin;
  fechaMax;

  constructor(
    private mantoInformeSemanalService: MantoInformeSemanalService, 
    private formBuilder: FormBuilder, 
    private sweetAlerService: SweetAlertService,
    private router: Router
   ) { 
      this.crearFormulario();

      let hoy = new Date();
      const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
      this.fechaMin = '2015-01';
      this.fechaMax = currentDate;

      this.formulario.controls['fecha'].setValue(currentDate);  
      this.mantoInformeSemanalService.setFechaInforme(this.formulario.value.fecha);
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
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      if (workBook.SheetNames[0] !== 'Exportación de Horas'){
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
        this.estadoHoras = 4;
        this.jsonDataHoras = null;
        return;
      }

      this.jsonDataHoras = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formularioHeaders(sheet, 'BC1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);

        this.estadoHoras = 3;
        return initial;
      }, {});
    
      if (this.jsonDataHoras['Exportación de Horas'] === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
        this.estadoHoras = 4;
        this.jsonDataHoras = null;
      } else {
        let tmp = this.jsonDataHoras['Exportación de Horas'];
        this.filtrarHoras(tmp);    
      }
    };
    reader.readAsBinaryString(file);
  }

  /*
    Tipo Contrato	= Mantenimiento
    Línea de Servicio sin Capacity Service ni General ni Backlog de Mantenimiento

    ambos
    comercial -> Grupo de Trabajo Asignado = Mantenimiento - Carlos Navarro
    transaccional -> Grupo de Trabajo Asignado = Mantenimiento - Keyciren Trigo

    Bloque o descripcion sin sobreesfuerzo
    descipción tarea sin retrabajo
  */
  filtrarHoras(jsonDataReqArray: any) {
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.tipoContrato === 'Mantenimiento';
    });

    /* jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.facturable === 'SI';
    }); */

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (
          a.lineaDeServicio != 'Capacity Service' 
          && a.lineaDeServicio != 'General'
          && a.lineaDeServicio != 'Backlog de Mantenimiento'
        );
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      //return a.grupoDeTrabajoAsignado === 'Mantenimiento - Carlos Navarro' 
      //|| a.grupoDeTrabajoAsignado === 'Mantenimiento - Keyciren Trigo';
      return a.grupoDeTrabajoAsignado === 'Mantenimiento - BO CO' 
      || a.grupoDeTrabajoAsignado === 'Mantenimiento - BO TRX';
    });

    let sobreesfuerzo = "SOBREESFUERZO";
    let sobresfuerzo = "SOBRESFUERZO";
    
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      let bloque = a.bloque.toUpperCase();
      let descripcion = a.descripcion.toUpperCase();

      return !(
                bloque.includes(sobreesfuerzo)
                || descripcion.includes(sobreesfuerzo)
                || bloque.includes(sobresfuerzo)
                || descripcion.includes(sobresfuerzo)

      )
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return !(
                a.descripcionTarea.includes('retrabajo')
                || a.descripcionTarea.includes('Retrabajo')
              )
    });

    this.jsonDataHoras = jsonDataReqArray;
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
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
          return;
        }

        if (this.jsonDataHoras == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
          return;
        }

        //se filtra por comercial o transaccional
        let arrayJSON = this.jsonDataHoras;
        if(this.formulario.value.tipo=='comercial'){
          arrayJSON = arrayJSON.filter(a => {
            //return a.grupoDeTrabajoAsignado === 'Mantenimiento - Carlos Navarro';
            return a.grupoDeTrabajoAsignado === 'Mantenimiento - BO CO';
          });
        } else if(this.formulario.value.tipo=='transaccional'){
          arrayJSON = arrayJSON.filter(a => {
            //return a.grupoDeTrabajoAsignado === 'Mantenimiento - Keyciren Trigo';
            return a.grupoDeTrabajoAsignado === 'Mantenimiento - BO TRX';
          });
        }

        this.mantoInformeSemanalService.setJsonDataMantoInformeSemanal(arrayJSON);
        this.mantoInformeSemanalService.setTipo(this.formulario.value.tipo);
        this.mantoInformeSemanalService.setFechaInforme(this.formulario.value.fecha);

        this.sweetAlerService.mensajeOK('Informe semanal generado exitosamente').then(          
          resp => {
            if (resp.value) {
              //borramos campos que no se necesitan
              this.formulario.value.horas = null;
              
              //se muestra un componente dependiendo el tipo
              if(this.formulario.value.tipo=='comercial'){
                this.router.navigateByUrl('/mantenimiento/informe-semanal/mostrar-comercial');
              } else if(this.formulario.value.tipo=='transaccional'){
                this.router.navigateByUrl('/mantenimiento/informe-semanal/mostrar-transaccional');
              }
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

 changeTipo(tipo){
  //console.log(tipo);
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