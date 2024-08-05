import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FechasDMSRoutingModule } from './fechasDMS-routing.module';

import { FormularioFechasDMSCompararComponent } from './comparar/components/formulario/formulario.component';
import { MostrarFechasDMSCompararComponent } from './comparar/components/mostrar/mostrar.component';

@NgModule({
  declarations: [
    FormularioFechasDMSCompararComponent,
    MostrarFechasDMSCompararComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FechasDMSRoutingModule,
  ]
})
export class FechasDMSModule { }
