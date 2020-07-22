import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesComponent } from './components/informes/informes.component';
import { GenerarInformeComponent } from './components/generar-informe/generar-informe.component';
import { GenerarCapacityComponent } from './components/generar-capacity/generar-capacity.component';


const routes: Routes = [
  { path: 'informes/:segmento', component: InformesComponent },
  { path: 'capacity', component: GenerarCapacityComponent },
  { path: 'generar', component: GenerarInformeComponent },
  { path: '', pathMatch: 'full', component: GenerarInformeComponent},
  { path: '**', pathMatch: 'full', component: GenerarInformeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
