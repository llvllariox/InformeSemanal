import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioValidarHHComponent } from './components/formulario/formulario.component';
import { MostrarValidarHHComponent } from './components/mostrar/mostrar.component';

const routes: Routes = [
  {
    path: '',
    component: FormularioValidarHHComponent,
  },
  {
    path: 'mostrar',
    component: MostrarValidarHHComponent,
  },
  {
    path: '**',
    component: FormularioValidarHHComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidarHHRoutingModule { }
