import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioConsolidarComponent } from './consolidar/components/formulario/formulario.component';
import { MostrarConsolidarComponent } from './consolidar/components/mostrar/mostrar.component';

import { FormularioInformeSemanalComponent } from './informe-semanal/components/formulario-informe-semanal/formulario-informe-semanal.component';
import { MostrarInformeSemanalTransaccionalComponent } from './informe-semanal/components/mostrar-informe-semanal-transaccional/mostrar-informe-semanal-transaccional.component';
import { MostrarInformeSemanalComercialComponent } from './informe-semanal/components/mostrar-informe-semanal-comercial/mostrar-informe-semanal-comercial.component';
import { ConfigInformeSemanalComercialComponent } from './informe-semanal/components/config-informe-semanal-comercial/config-informe-semanal-comercial.component';
import { ConfigInformeSemanalTransaccionalComponent } from './informe-semanal/components/config-informe-semanal-transaccional/config-informe-semanal-transaccional.component';

const routes: Routes = [
  {
    path: 'consolidar/formulario',
    component: FormularioConsolidarComponent,
  },
  {
    path: 'consolidar/mostrar',
    component: MostrarConsolidarComponent,
  },

  {
    path: 'informe-semanal/formulario',
    component: FormularioInformeSemanalComponent,
  },

  {
    path: 'informe-semanal/mostrar-comercial',
    component: MostrarInformeSemanalComercialComponent,
  },

  {
    path: 'informe-semanal/mostrar-transaccional',
    component: MostrarInformeSemanalTransaccionalComponent,
  },

  {
    path: 'informe-semanal/config/comercial',
    component: ConfigInformeSemanalComercialComponent,
  },

  {
    path: 'informe-semanal/config/transaccional',
    component: ConfigInformeSemanalTransaccionalComponent,
  },

  {
    path: '**',
    component: FormularioConsolidarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
