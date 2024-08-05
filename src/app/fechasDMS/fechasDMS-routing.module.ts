import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormularioFechasDMSCompararComponent } from './comparar/components/formulario/formulario.component';
import { MostrarFechasDMSCompararComponent } from './comparar/components/mostrar/mostrar.component';

const routes: Routes = [
  {
    path: 'formulario',
    component: FormularioFechasDMSCompararComponent,
  },
  
  {
    path: 'mostrar',
    component: MostrarFechasDMSCompararComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FechasDMSRoutingModule { }
