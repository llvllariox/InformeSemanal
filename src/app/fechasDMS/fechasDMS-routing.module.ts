import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormularioFechasDMSCompararComponent } from './comparar/components/formulario/formulario.component';
import { MostrarFechasDMSCompararComponent } from './comparar/components/mostrar/mostrar.component';

import { FormularioFechasDMSValidarComponent } from './validar/components/formulario/formulario.component';
import { MostrarFechasDMSValidarComponent } from './validar/components/mostrar/mostrar.component';

const routes: Routes = [
  {
    path: 'comparar/formulario',
    component: FormularioFechasDMSCompararComponent,
  },
  
  {
    path: 'comparar/mostrar',
    component: MostrarFechasDMSCompararComponent,
  },

  {
    path: 'validar/formulario',
    component: FormularioFechasDMSValidarComponent,
  },
  
  {
    path: 'validar/mostrar',
    component: MostrarFechasDMSValidarComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FechasDMSRoutingModule { }
