import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SLARoutingModule } from './sla-routing.module';

import { FormularioSLAComponent } from './components/formulario-sla/formulario-sla.component';
import { MostrarSLAComponent } from './components/mostrar-sla/mostrar-sla.component';

import { FechaVaciaPipe } from 'src/app/shared/pipes/fecha-vacia.pipe'

@NgModule({
  declarations: [
    FormularioSLAComponent,
    MostrarSLAComponent,
    FechaVaciaPipe
  ],
  imports: [
    CommonModule,
    SLARoutingModule,

    FormsModule,
    ReactiveFormsModule
  ]
})
export class SLAModule { }
