import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesComponent } from './components/informes/informes.component';
import { GenerarInformeComponent } from './components/generar-informe/generar-informe.component';
import { GenerarCapacityComponent } from './components/generar-capacity/generar-capacity.component';
import { VerCapacityComponent } from './components/ver-capacity/ver-capacity.component';

const routes: Routes = [
  { path: '', component: GenerarInformeComponent},
  { path: 'informes/:segmento', component: InformesComponent },
  { path: 'verCapacity', component: VerCapacityComponent },
  { path: 'capacity', component: GenerarCapacityComponent },
  { path: 'generar', component: GenerarInformeComponent },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', component: GenerarInformeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
