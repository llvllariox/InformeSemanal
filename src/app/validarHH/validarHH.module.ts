import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidarHHRoutingModule } from './validarHH-routing.module';

import { MostrarValidarHHComponent } from './components/mostrar/mostrar.component';
import { FormularioValidarHHComponent } from './components/formulario/formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MostrarValidarHHComponent,
    FormularioValidarHHComponent,
  ],
  imports: [
    CommonModule,
    ValidarHHRoutingModule,

    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ValidarHHModule { }