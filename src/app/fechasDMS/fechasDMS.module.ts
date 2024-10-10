import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FechasDMSRoutingModule } from './fechasDMS-routing.module';

import { FormularioFechasDMSCompararComponent } from './comparar/components/formulario/formulario.component';
import { MostrarFechasDMSCompararComponent } from './comparar/components/mostrar/mostrar.component';

import { FormularioFechasDMSValidarComponent } from './validar/components/formulario/formulario.component';
import { MostrarFechasDMSValidarComponent } from './validar/components/mostrar/mostrar.component';

import { FechaDMSPipe } from './pipes/fecha-dms.pipe';

@NgModule({
  declarations: [
    FormularioFechasDMSCompararComponent,
    MostrarFechasDMSCompararComponent,
    FechaDMSPipe,
    FormularioFechasDMSValidarComponent,
    MostrarFechasDMSValidarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FechasDMSRoutingModule,
  ]
})
export class FechasDMSModule { }
