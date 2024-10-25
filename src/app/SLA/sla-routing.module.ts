import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormularioSLAComponent } from './components/formulario-sla/formulario-sla.component';
import { MostrarSLAComponent } from './components/mostrar-sla/mostrar-sla.component';

const routes: Routes = [
  {
    path: 'formulario',
    component: FormularioSLAComponent,
  },
  {
    path: 'mostrar',
    component: MostrarSLAComponent,
  },

  {
    path: '**',
    component: FormularioSLAComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SLARoutingModule { }