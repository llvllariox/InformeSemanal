import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { MantoInformeSemanalConfService } from 'src/app/services/manto-informe-semanal-conf.service';
import { MantoInformeSemanalFirebaseService } from 'src/app/services/manto-informe-semanal-firebase.service';
import HoraC from '../../../model/horaC.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-informe-semanal-conf-comercial',
  templateUrl: './informe-semanal-conf-comercial.component.html'
})
export class InformeSemanalConfComercialComponent implements OnInit {
  subscription: Subscription;

  esPosibleBorrarModificar = false;

  formularioHoraC: FormGroup;

  fechaMin;
  fechaMax;

  constructor(
      public mantoInformeSemanalConfService: MantoInformeSemanalConfService,
      public mantoInformeSemanalFirebaseService: MantoInformeSemanalFirebaseService,
      private sweetAlerService: SweetAlertService, 
      private formBuilder: FormBuilder,
      private router: Router
  ) { 
      this.crearFormulario();

      //se debe llamar solo para la entrega
      //this.inicioHorasC();
    }

  ngOnInit(): void {
    this.subscription = this.mantoInformeSemanalFirebaseService.getHorasC().subscribe(MantoHorasC => {
      this.mantoInformeSemanalConfService.setDataCOriginal(MantoHorasC);
      
      let hoy = new Date();
      const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  

      //obtenemos el mes y año por defecto UTILIZADAS
      this.fechaMin = hoy.getFullYear()-2 + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
      this.fechaMax = hoy.getFullYear()+2 + '-' + String(hoy.getMonth() + 1).padStart(2, '0');

      this.esPosibleBorrarModificar = true;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe;
  }

  modificarHoraC(year, month){
    if(this.esPosibleBorrarModificar){
      let horaC = this.mantoInformeSemanalConfService.getHoraC(year, month);

      this.sweetAlerService.mensajeConfirmacion("Modificar Hora", "Seguro que desea modificar la hora?").then(
        async resp => {
          if(resp.isConfirmed) {
            let inputUtilizadasId = "inputHoraCUtilizadas" + year + month;
            const inputUtilizadasValue = (<HTMLInputElement>document.getElementById(inputUtilizadasId)).value;

            let inputAnterioresId = "inputHoraCAnteriores" + year + month;
            const inputAnterioresValue = (<HTMLInputElement>document.getElementById(inputAnterioresId)).value;

            let inputPropuestasId = "inputHoraCPropuestas" + year + month;
            let inputPropuestasValue = (<HTMLInputElement>document.getElementById(inputPropuestasId)).value;

            let horaCAgregar = {
              year: Number(year),
              month: Number(month),
              utilizadas: Number(inputUtilizadasValue),
              anteriores: Number(inputAnterioresValue),
              propuestas: Number(inputPropuestasValue)
            }
 
            const response2 = await this.mantoInformeSemanalFirebaseService.updateHoraC(horaC, horaCAgregar);
          }
        }
      );
    }
  }

  async borrarHoraC(year, month){
    if(this.esPosibleBorrarModificar){
      
      let horaC = this.mantoInformeSemanalConfService.getHoraC(year, month);
      
      this.sweetAlerService.mensajeConfirmacion("Borrar Hora", "Seguro que desea borrar la hora?").then(

        async resp => {
          if(resp.isConfirmed) {
            const response = await this.mantoInformeSemanalFirebaseService.deleteHoraC(horaC);
            this.router.navigateByUrl('/manto-informe-semanal-conf-comercial');
          }
        }
      );   
    }
  }

  async agregarHoraC(){
    if(this.formularioHoraC.invalid) {
      Object.values(this.formularioHoraC.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
        control.markAsTouched();
        }
      });
    } else {
      let year = Number(this.formularioHoraC.value.mesHoraC.split('-')[0]);
      let month = Number(this.formularioHoraC.value.mesHoraC.split('-')[1]);
      
      let horaC = {
        year: Number(this.formularioHoraC.value.mesHoraC.split('-')[0]),
        month: Number(this.formularioHoraC.value.mesHoraC.split('-')[1]),
        utilizadas: Number(this.formularioHoraC.value.utilizada),
        anteriores: Number(this.formularioHoraC.value.anterior),
        propuestas: Number(this.formularioHoraC.value.propuesta),
      }

      if(this.mantoInformeSemanalConfService.validarAgregar(false, year, month, "comercial")){
        const response = await this.mantoInformeSemanalFirebaseService.addHoraC(horaC);
        this.sweetAlerService.mensajeOK('Hora agregada correctamente').then(          
          resp => {
            if (resp.value) {
              this.router.navigateByUrl('/manto-informe-semanal-conf-comercial');
            }
          }
        );
      } else {
        this.sweetAlerService.mensajeError('Hora no agregada', 'Ya se encuentra un valor para esa fecha.');
      }
    }
  }

  //crea el formulario
  crearFormulario() {
    this.formularioHoraC = this.formBuilder.group({
        mesHoraC : ['', [Validators.required]],
        valorHoraCUtilizada : ['', [Validators.required]],
        valorHoraCAnterior : ['', [Validators.required]],
        valorHoraCPropuesta : ['', [Validators.required]]
    });
  }

  get mesHoraCNoValido() {
    return this.formularioHoraC.get('mesHoraC').invalid && this.formularioHoraC.get('mesHoraC').touched;
  }

  get valorHoraCUtilizadaNoValido() {
    return this.formularioHoraC.get('valorHoraCUtilizada').invalid && this.formularioHoraC.get('valorHoraCUtilizada').touched;
  }

  get valorHoraCAnteriorNoValido() {
    return this.formularioHoraC.get('valorHoraCAnterior').invalid && this.formularioHoraC.get('valorHoraCAnterior').touched;
  }

  get valorHoraCPropuestaNoValido() {
    return this.formularioHoraC.get('valorHoraCPropuesta').invalid && this.formularioHoraC.get('valorHoraCPropuesta').touched;
  }



  //carga la base de datos si es llamada (se llama solo para la entrega)
  inicioHorasC(){
    let horaIniEnero = {
      year: 2023,
      month: 1,
      utilizadas: 804,
      anteriores: 0, 
      propuestas: 747
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniEnero);

    let horaIniFebrero = {
      year: 2023,
      month: 2,
      utilizadas: 729,
      anteriores: 57, 
      propuestas: 837
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniFebrero);

    let horaIniMarzo = {
      year: 2023,
      month: 3,
      utilizadas: 822,
      anteriores: 0, 
      propuestas: 747
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniMarzo);

    let horaIniAbril = {
      year: 2023,
      month: 4,
      utilizadas: 714,
      anteriores: 75, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniAbril);

    let horaIniMayo = {
      year: 2023,
      month: 5,
      utilizadas: 836,
      anteriores: 132, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniMayo);

    let horaIniJunio = {
      year: 2023,
      month: 6,
      utilizadas: 882,
      anteriores: 80, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniJunio);

    let horaIniJulio = {
      year: 2023,
      month: 7,
      utilizadas: 0,
      anteriores: 0, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniJulio);

    let horaIniAgosto = {
      year: 2023,
      month: 8,
      utilizadas: 0,
      anteriores: 0, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniAgosto);

    let horaIniSeptiembre = {
      year: 2023,
      month: 9,
      utilizadas: 0,
      anteriores: 0, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniSeptiembre);

    let horaIniOctubre = {
      year: 2023,
      month: 10,
      utilizadas: 0,
      anteriores: 0, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniOctubre);

    let horaIniNoviembre = {
      year: 2023,
      month: 11,
      utilizadas: 0,
      anteriores: 0, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniNoviembre);

    let horaIniDiciembre = {
      year: 2023,
      month: 12,
      utilizadas: 0,
      anteriores: 0, 
      propuestas: 657
    }
    this.mantoInformeSemanalFirebaseService.addHoraC(horaIniDiciembre);
  }
}
