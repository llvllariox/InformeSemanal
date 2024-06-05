import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioConsolidarComponent } from './consolidar/components/formulario/formulario.component';
import { FormularioConsolidarARSComponent } from './consolidar/components/formulario-consolidar-ars/formulario-consolidar-ars.component';
import { MostrarConsolidarComponent } from './consolidar/components/mostrar/mostrar.component';
import { MostrarARSConsolidarComponent } from './consolidar/components/mostrar-ars/mostrar-ars.component';

const routes: Routes = [
  {
    path: 'formulario',
    component: FormularioConsolidarComponent,
  },
  {
    
    path: 'formulario-ars',
    component: FormularioConsolidarARSComponent,
  },
  {
    path: 'mostrar',
    component: MostrarConsolidarComponent,
  },
  {
    path: 'mostrar-ars',
    component: MostrarARSConsolidarComponent,
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
