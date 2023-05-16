import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-informe-semanal',
  templateUrl: './informe-semanal.component.html'
})
export class InformeSemanalComponent implements OnInit {
  formulario: FormGroup;
  jsonDataHoras = null;
  estadoHoras = 1;
  fechaInforme;
  fechaMin;
  fechaMax;

  constructor(
              private formBuilder: FormBuilder, 
              private sweetAlerService: SweetAlertService,
             ) { 
                this.crearFormulario();
                
                let hoy = new Date();
                const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
                this.fechaMin = '2015-01';
                this.fechaMax = currentDate;
                this.formulario.controls['fecha'].setValue(currentDate);  

             }

  ngOnInit(): void {
  }

  //transforma la data a JSON
  uploadHoras(event) {
  }

  //genera el informe
  generar() {

  }

  //crea el formulario
  crearFormulario() {
    this.formulario = this.formBuilder.group({
        horas : ['', [Validators.required]],
        fecha : ['', [Validators.required]],
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

  get horasNoValido() {
    return this.formulario.get('horas').invalid && this.formulario.get('horas').touched;
  }

  get fechaNoValido() {
    return this.formulario.get('fecha').invalid && this.formulario.get('fecha').touched;
  }
}
