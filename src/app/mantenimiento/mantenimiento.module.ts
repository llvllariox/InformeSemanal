import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';

import { MostrarConsolidarComponent } from './consolidar/components/mostrar/mostrar.component';
import { FormularioConsolidarComponent } from './consolidar/components/formulario/formulario.component';
import { TablaPorMesComponent } from './consolidar/components/tabla-por-mes/tabla-por-mes.component';
import { ResumenComponent } from './consolidar/components/resumen/resumen.component';

import { FormularioInformeSemanalComponent } from './informe-semanal/components/formulario-informe-semanal/formulario-informe-semanal.component';

import { MostrarInformeSemanalComercialComponent } from './informe-semanal/components/mostrar-informe-semanal-comercial/mostrar-informe-semanal-comercial.component';
import { MostrarInformeSemanalTransaccionalComponent } from './informe-semanal/components/mostrar-informe-semanal-transaccional/mostrar-informe-semanal-transaccional.component';

import { ConfigInformeSemanalComercialComponent } from './informe-semanal/components/config-informe-semanal-comercial/config-informe-semanal-comercial.component';
import { ConfigInformeSemanalTransaccionalComponent } from './informe-semanal/components/config-informe-semanal-transaccional/config-informe-semanal-transaccional.component';

@NgModule({
  declarations: [
    FormularioConsolidarComponent,
    MostrarConsolidarComponent,
    TablaPorMesComponent,
    ResumenComponent,
    FormularioInformeSemanalComponent,
    MostrarInformeSemanalComercialComponent,
    MostrarInformeSemanalTransaccionalComponent,
    ConfigInformeSemanalComercialComponent,
    ConfigInformeSemanalTransaccionalComponent,
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,

    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MantenimientoModule { }