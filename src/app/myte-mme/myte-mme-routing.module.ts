import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormularioMyteMMEComponent } from './components/formulario/formulario.component';

const routes: Routes = [
  {
    path: 'formulario',
    component: FormularioMyteMMEComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyteMMERoutingModule { }
