import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';

import { MostrarConsolidarComponent } from './consolidar/components/mostrar/mostrar.component';
import { FormularioConsolidarComponent } from './consolidar/components/formulario/formulario.component';
import { TablaPorMesComponent } from './consolidar/components/tabla-por-mes/tabla-por-mes.component';
import { FormularioConsolidarARSComponent } from './consolidar/components/formulario-consolidar-ars/formulario-consolidar-ars.component';
import { MostrarARSConsolidarComponent } from './consolidar/components/mostrar-ars/mostrar-ars.component';

@NgModule({
  declarations: [
    MostrarConsolidarComponent,
    MostrarARSConsolidarComponent,
    FormularioConsolidarComponent,
    FormularioConsolidarARSComponent,
    TablaPorMesComponent,
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,

    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MantenimientoModule { }