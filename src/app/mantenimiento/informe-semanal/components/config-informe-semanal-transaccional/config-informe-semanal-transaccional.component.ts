import { Component, OnInit, OnDestroy } from '@angular/core';
import { MantoInformeSemanalConfService } from '../../services/manto-informe-semanal-conf.service';
import { MantoInformeSemanalFirebaseService } from '../../services/manto-informe-semanal-firebase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertService } from 'src/app/shared/services/sweet-alert.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import Hora from '../../interfaces/hora.interface';

@Component({
  selector: 'app-config-informe-semanal-transaccional',
  templateUrl: './config-informe-semanal-transaccional.component.html'
})
export class ConfigInformeSemanalTransaccionalComponent implements OnInit {

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

    //se debe llamar para probar la BD
    //this.cargarHorasT();
  }

  ngOnInit(): void {
    this.subscription = this.mantoInformeSemanalFirebaseService.getHoras('MantoHorasT').subscribe(MantoHorasT => {
      console.log(MantoHorasT);
      this.mantoInformeSemanalConfService.setDataOriginal(MantoHorasT, 'transaccional');
      
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
    if(this.mantoInformeSemanalConfService.existeHora(year, month, 'transaccional')) {
      let horaBorrar = this.mantoInformeSemanalConfService.getHora(year, month, 'transaccional');
      this.mantoInformeSemanalFirebaseService.deleteHora(horaBorrar, 'MantoHorasT');
    }

    let agregarHora: Hora = {
      year: year,
      month: month,
      utilizadas: Number(this.formularioHora.value.valorHoraUtilizada),
      anteriores: 0,
      propuestas: Number(this.formularioHora.value.valorHoraPropuesta),
    }
    this.mantoInformeSemanalFirebaseService.addHora(agregarHora, 'MantoHorasT');
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




  //carga la base de datos si es llamada
  cargarHorasT() {

    let hora0123: Hora = {
      year: 2023,
      month: 1,
      utilizadas: 1940,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0124: Hora = {
        year: 2024,
        month: 1,
        utilizadas: 746,
        anteriores: 0,
        propuestas: 706,
      }
    
    
    let hora0223: Hora = {
      year: 2023,
      month: 2,
      utilizadas: 1373,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0224: Hora = {
        year: 2024,
        month: 2,
        utilizadas: 695,
        anteriores: 0,
        propuestas: 706,
      }
    
    let hora0323: Hora = {
      year: 2023,
      month: 3,
      utilizadas: 1551,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0324: Hora = {
        year: 2024,
        month: 3,
        utilizadas: 647,
        anteriores: 0,
        propuestas: 706,
      }
    
    
    let hora0423: Hora = {
      year: 2023,
      month: 4,
      utilizadas: 1215,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0424: Hora = {
        year: 2024,
        month: 4,
        utilizadas: 652,
        anteriores: 0,
        propuestas: 706,
      }
    
    
    
    
    
  
  
  
  let hora0523: Hora = {
      year: 2023,
      month: 5,
      utilizadas: 1417,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0524: Hora = {
        year: 2024,
        month: 5,
        utilizadas: 549,
        anteriores: 0,
        propuestas: 706,
      }
   
   
   
   
   
   let hora0623: Hora = {
      year: 2023,
      month: 6,
      utilizadas: 1417,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0624: Hora = {
        year: 2024,
        month: 6,
        utilizadas: 582,
        anteriores: 0,
        propuestas: 706,
      }
    
    
    
  let hora0723: Hora = {
      year: 2023,
      month: 7,
      utilizadas: 1356,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0724: Hora = {
        year: 2024,
        month: 7,
        utilizadas: 795,
        anteriores: 0,
        propuestas: 706,
      }
    
    
  
  let hora0823: Hora = {
      year: 2023,
      month: 8,
      utilizadas: 1377,
      anteriores: 0,
      propuestas: 1417,
  }
   
   
   let hora0824: Hora = {
        year: 2024,
        month: 8,
        utilizadas: 822,
        anteriores: 0,
        propuestas: 706,
      }
    
  let hora0923: Hora = {
      year: 2023,
      month: 9,
      utilizadas: 1340,
      anteriores: 0,
      propuestas: 1417,
  }
  
  let hora0924: Hora = {
      year: 2024,
      month: 9,
      utilizadas: -1,
      anteriores: 0,
      propuestas: 706,
  }
  
  let hora1024: Hora = {
      year: 2024,
      month: 10,
      utilizadas: -1,
      anteriores: 0,
      propuestas: 706,
  }
  
  let hora1124: Hora = {
      year: 2024,
      month: 11,
      utilizadas: -1,
      anteriores: 0,
      propuestas: 706,
  }
    
    let hora1224: Hora = {
      year: 2024,
      month: 12,
      utilizadas: -1,
      anteriores: 0,
      propuestas: 706,
  }
  
  
  let hora1023: Hora = {
      year: 2023,
      month: 10,
      utilizadas: 1519,
      anteriores: 0,
      propuestas: 1417,
  }
  
  let hora1123: Hora = {
      year: 2023,
      month: 11,
      utilizadas: 1343,
      anteriores: 0,
      propuestas: 1417,
  }
  
  let hora1223: Hora = {
      year: 2023,
      month: 12,
      utilizadas: 0,
      anteriores: 0,
      propuestas: 1417,
  }
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0123, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0124, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0223, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0224, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0323, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0324, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0423, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0424, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0523, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0524, 'MantoHorasT');
    
  this.mantoInformeSemanalFirebaseService.addHora(hora0623, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0624, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0723, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0724, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0823, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0824, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora0923, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora0924, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora1023, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora1024, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora1123, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora1124, 'MantoHorasT');
  
  this.mantoInformeSemanalFirebaseService.addHora(hora1223, 'MantoHorasT');
  this.mantoInformeSemanalFirebaseService.addHora(hora1224, 'MantoHorasT');

  }
}
