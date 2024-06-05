import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricasAMRoutingModule } from './metricas-am-routing.module';

import { MostrarComponent } from './components/mostrar/mostrar.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* import { FechasPipe } from '../pipes/fechas.pipe'; */



@NgModule({
  declarations: [
    MostrarComponent,
    FormularioComponent,
  ],
  imports: [
    CommonModule,
    MetricasAMRoutingModule,

    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MetricasAMModule { }
