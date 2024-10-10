import { Component, OnInit, OnDestroy } from '@angular/core';
import { MantoInformeSemanalConfService } from '../../services/manto-informe-semanal-conf.service';
import { MantoInformeSemanalFirebaseService } from '../../services/manto-informe-semanal-firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { Subscription } from 'rxjs';

import Hora from '../../interfaces/hora.interface';

@Component({
  selector: 'app-config-informe-semanal-comercial',
  templateUrl: './config-informe-semanal-comercial.component.html',
})
export class ConfigInformeSemanalComercialComponent implements OnInit {
  horas: Hora[];
  formularioHora: FormGroup;

  fechaMinUtilizadas;
  fechaMaxUtilizadas;

  fechaMinPropuestas;
  fechaMaxPropuestas;

  esPosibleBorrarModificar = false;

  subscription: Subscription;

  flagHorasCargadas = false;

  constructor(
    public mantoInformeSemanalConfService: MantoInformeSemanalConfService,
      public mantoInformeSemanalFirebaseService: MantoInformeSemanalFirebaseService,
      private formBuilder: FormBuilder,
  ) { 
    this.crearFormulario();

    //se debe llamar solo para la entrega
    //this.inicioPropuestas();
    //this.inicioUtilizadas();
  }

  ngOnInit(): void {
    this.subscription = this.mantoInformeSemanalFirebaseService.getHoras('MantoHorasC').subscribe(MantoHorasC => {
      this.mantoInformeSemanalConfService.setDataCOriginal(MantoHorasC);
    
      let hoy = new Date();
      const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
      
       //obtenemos el mes y año por defecto UTILIZADAS
       this.fechaMinUtilizadas = Number(hoy.getFullYear())-2 + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
       this.fechaMaxUtilizadas = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
     
       //obtenemos el mes y año por defecto PROPUESTAS
       this.fechaMinPropuestas = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
       this.fechaMaxPropuestas = Number(hoy.getFullYear())+5 + '-' + String(hoy.getMonth() + 1).padStart(2, '0');

      this.flagHorasCargadas = true;
      this.esPosibleBorrarModificar = true;
    });

  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe;
  }

  crearFormulario() {
    this.formularioHora = this.formBuilder.group({
      mesHora : ['', [Validators.required]],
      valorHoraPropuesta : ['', [Validators.required]],
      valorHoraUtilizada : ['', [Validators.required]],
    });
  }

  async agregarHora(){
    let year = Number(this.formularioHora.value.mesHora.split('-')[0]);
    let month = Number(this.formularioHora.value.mesHora.split('-')[1]);

    //si existe se debe borrar antes de agregar
    if(this.mantoInformeSemanalConfService.existeHora(year, month, 'comercial')) {
      let horaBorrar = this.mantoInformeSemanalConfService.getHora(year, month, 'comercial');
      this.mantoInformeSemanalFirebaseService.deleteHora(horaBorrar, 'MantoHorasC');
    }

    let agregarHora: Hora = {
      year: year,
      month: month,
      utilizadas: Number(this.formularioHora.value.valorHoraUtilizada),
      anteriores: 0,
      propuestas: Number(this.formularioHora.value.valorHoraPropuesta),
    }
    this.mantoInformeSemanalFirebaseService.addHora(agregarHora, 'MantoHorasC');
  }

  get mesHoraNoValido() {
    return this.formularioHora.get('mesHora').invalid && this.formularioHora.get('mesHora').touched;
  }

  get valorHoraPropuestaNoValido() {
    return this.formularioHora.get('valorHoraPropuesta').invalid && this.formularioHora.get('valorHoraPropuesta').touched;
  }

  get valorHoraUtilizadaNoValido() {
    return this.formularioHora.get('valorHoraUtilizada').invalid && this.formularioHora.get('valorHoraUtilizada').touched;
  }

}
