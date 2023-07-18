import { Component, OnInit, OnDestroy } from '@angular/core';
import { MantoInformeSemanalConfService } from 'src/app/services/manto-informe-semanal-conf.service';
import { MantoInformeSemanalFirebaseService } from 'src/app/services/manto-informe-semanal-firebase.service';
import Hora from '../../../model/hora.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-informe-semanal-conf',
  templateUrl: './informe-semanal-conf.component.html'
})
export class InformeSemanalConfComponent implements OnInit {
  horas: Hora[];
  formularioHoraPropuesta: FormGroup;
  formularioHoraUtilizada: FormGroup;

  fechaMinUtilizadas;
  fechaMaxUtilizadas;

  fechaMinPropuestas;
  fechaMaxPropuestas;

  esPosibleBorrarModificar = false;

  subscription: Subscription;

  constructor(
              public mantoInformeSemanalConfService: MantoInformeSemanalConfService,
              public mantoInformeSemanalFirebaseService: MantoInformeSemanalFirebaseService,
              private sweetAlerService: SweetAlertService, 
              private formBuilder: FormBuilder,
              private router: Router
             ) {
              this.crearFormulario();

              //se debe llamar solo para la entrega
              //this.inicioPropuestas();
              //this.inicioUtilizadas();
             }
 
  ngOnInit(): void {
    this.subscription = this.mantoInformeSemanalFirebaseService.getHoras('transaccional').subscribe(MantoHoras => {
      console.log("init conf transaccional");
      this.horas = MantoHoras;
      this.mantoInformeSemanalConfService.setDataOriginal(this.horas, 'transaccional');

      let hoy = new Date();
      const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
      
      //obtenemos el mes y año por defecto UTILIZADAS
      this.fechaMinUtilizadas = Number(hoy.getFullYear())-2 + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
      this.fechaMaxUtilizadas = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
    
      //obtenemos el mes y año por defecto PROPUESTAS
      this.fechaMinPropuestas = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
      this.fechaMaxPropuestas = Number(hoy.getFullYear())+5 + '-' + String(hoy.getMonth() + 1).padStart(2, '0');

      this.esPosibleBorrarModificar = true;
    });
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe;
  }

  //crea el formulario
  crearFormulario() {
    this.formularioHoraPropuesta = this.formBuilder.group({
        mesHoraPropuesta : ['', [Validators.required]],
        valorHoraPropuesta : ['', [Validators.required]],
    });

    this.formularioHoraUtilizada = this.formBuilder.group({
      mesHoraUtilizada : ['', [Validators.required]],
      valorHoraUtilizada : ['', [Validators.required]],
    });
  }


  modificarHora(year, month, isUtilizada){
    if(this.esPosibleBorrarModificar){
      let hora;
      let tipo;
      if(isUtilizada){
        tipo = "Utilizadas";
        hora = this.mantoInformeSemanalConfService.getHoraUtilizadas(year, month, "transaccional");
      }
      else {
        tipo = "Propuestas";
        hora = this.mantoInformeSemanalConfService.getHoraPropuestas(year, month, "transaccional");
      }
      
      this.sweetAlerService.mensajeConfirmacion("Modificar Hora", "Seguro que desea modificar la hora?").then(
        async resp => {
          if(resp.isConfirmed) {
            let inputId = "inputHora"+ tipo + year + month;
            const inputValue = (<HTMLInputElement>document.getElementById(inputId)).value;
            const response = await this.mantoInformeSemanalFirebaseService.deleteHora(hora);
            //console.log(response);
    
            let horaAgregar = {
              year: Number(year),
              month: Number(month),
              valor: Number(inputValue),
              isUtilizada: isUtilizada 
            }

            const response2 = await this.mantoInformeSemanalFirebaseService.addHora(horaAgregar);
            //console.log(response2);

            this.router.navigateByUrl('/manto-informe-semanal-conf');
          }
        }
      );
    }
  }

  async borrarHora(year, month, isUtilizada){
    if(this.esPosibleBorrarModificar){
      
      let hora;
      if(isUtilizada) hora = this.mantoInformeSemanalConfService.getHoraUtilizadas(year, month, "transaccional");
      else hora = this.mantoInformeSemanalConfService.getHoraPropuestas(year, month, "transaccional");
      
      this.sweetAlerService.mensajeConfirmacion("Borrar Hora", "Seguro que desea borrar la hora?").then(

        async resp => {
          if(resp.isConfirmed) {
            const response = await this.mantoInformeSemanalFirebaseService.deleteHora(hora);
            console.log("borrar: ");
            console.log(response);
            this.router.navigateByUrl('/manto-informe-semanal-conf');
          }
        }
      );   
    }
  }

  async agregarHoraPropuesta(){
    if(this.formularioHoraPropuesta.invalid) {
      Object.values(this.formularioHoraPropuesta.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
        control.markAsTouched();
        }
      });
    } else {
      let year = Number(this.formularioHoraPropuesta.value.mesHoraPropuesta.split('-')[0]);
      let month = Number(this.formularioHoraPropuesta.value.mesHoraPropuesta.split('-')[1]);
      
      let hora = {
        year: Number(this.formularioHoraPropuesta.value.mesHoraPropuesta.split('-')[0]),
        month: Number(this.formularioHoraPropuesta.value.mesHoraPropuesta.split('-')[1]),
        valor: Number(this.formularioHoraPropuesta.value.valorHoraPropuesta),
        isUtilizada: false 
      }

      if(this.mantoInformeSemanalConfService.validarAgregar(false, year, month, "transaccional")){
        const response = await this.mantoInformeSemanalFirebaseService.addHora(hora);
        console.log("agrregar: ");
        console.log(response);

        this.sweetAlerService.mensajeOK('Hora agregada correctamente').then(          
          resp => {
            if (resp.value) {
              this.router.navigateByUrl('/manto-informe-semanal-conf');
            }
          }
        );
      } else {
        this.sweetAlerService.mensajeError('Hora no agregada', 'Ya se encuentra un valor para esa fecha.');
      }
    }
  }

  async agregarHoraUtilizada(){

    if(this.formularioHoraUtilizada.invalid) {
      Object.values(this.formularioHoraUtilizada.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
        control.markAsTouched();
        }
      });
    } else {
      let year = Number(this.formularioHoraUtilizada.value.mesHoraUtilizada.split('-')[0]);
      let month = Number(this.formularioHoraUtilizada.value.mesHoraUtilizada.split('-')[1]);
      
      let hora = {
        year: Number(this.formularioHoraUtilizada.value.mesHoraUtilizada.split('-')[0]),
        month: Number(this.formularioHoraUtilizada.value.mesHoraUtilizada.split('-')[1]),
        valor: Number(this.formularioHoraUtilizada.value.valorHoraUtilizada),
        isUtilizada: true 
      }

      if(this.mantoInformeSemanalConfService.validarAgregar(true, year, month, "transaccional")){
        const response = await this.mantoInformeSemanalFirebaseService.addHora(hora);
        console.log(response);

        this.sweetAlerService.mensajeOK('Hora agregada correctamente').then(          
          resp => {
            if (resp.value) {
              this.router.navigateByUrl('/manto-informe-semanal-conf');
            }
          }
        );
      } else {
        this.sweetAlerService.mensajeError('Hora no agregada', 'Ya se encuentra un valor para esa fecha.');
      }
    }
  }

  get mesHoraPropuestaNoValido() {
    return this.formularioHoraPropuesta.get('mesHoraPropuesta').invalid && this.formularioHoraPropuesta.get('mesHoraPropuesta').touched;
  }

  get valorHoraPropuestaNoValido() {
    return this.formularioHoraPropuesta.get('valorHoraPropuesta').invalid && this.formularioHoraPropuesta.get('valorHoraPropuesta').touched;
  }

  get mesHoraUtilizadaNoValido() {
    return this.formularioHoraUtilizada.get('mesHoraUtilizada').invalid && this.formularioHoraUtilizada.get('mesHoraUtilizada').touched;
  }

  get valorHoraUtilizadaNoValido() {
    return this.formularioHoraUtilizada.get('valorHoraUtilizada').invalid && this.formularioHoraUtilizada.get('valorHoraUtilizada').touched;
  }

  //carga la base de datos si es llamada (se llama solo para la entrega)
  inicioPropuestas(){
    for (let i = 1; i <= 12; i++) {
      let horaIni = {
        year: 2023,
        month: i,
        valor: 1417,
        isUtilizada: false
      }
      this.mantoInformeSemanalFirebaseService.addHora(horaIni);
    }
  }

  inicioUtilizadas(){
    let horaIniEnero = {
      year: 2023,
      month: 1,
      valor: 1940.5,
      isUtilizada: true
    }
    this.mantoInformeSemanalFirebaseService.addHora(horaIniEnero);

    let horaIniFebrero = {
      year: 2023,
      month: 2,
      valor: 1373,
      isUtilizada: true
    }
    this.mantoInformeSemanalFirebaseService.addHora(horaIniFebrero);

    let horaIniMarzo = {
      year: 2023,
      month: 3,
      valor: 1551,
      isUtilizada: true
    }
    this.mantoInformeSemanalFirebaseService.addHora(horaIniMarzo);

    let horaIniAbril = {
      year: 2023,
      month: 4,
      valor: 1215,
      isUtilizada: true
    }
    this.mantoInformeSemanalFirebaseService.addHora(horaIniAbril);

    let horaIniMayo = {
      year: 2023,
      month: 5,
      valor: 1417,
      isUtilizada: true
    }
    this.mantoInformeSemanalFirebaseService.addHora(horaIniMayo);
  }
}