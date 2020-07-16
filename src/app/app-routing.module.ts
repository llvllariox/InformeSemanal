import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesComponent } from './components/informes/informes.component';
import { GenerarInformeComponent } from './components/generar-informe/generar-informe.component';


const routes: Routes = [
  { path: 'informes/:segmento', component: InformesComponent },
  { path: 'generar', component: GenerarInformeComponent },
  { path: '', pathMatch: 'full', component: GenerarInformeComponent},
  { path: '**', pathMatch: 'full', component: GenerarInformeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
