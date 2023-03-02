import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesComponent } from './components/informes/informes.component';
import { GenerarInformeComponent } from './components/generar-informe/generar-informe.component';
import { GenerarCapacityComponent } from './components/generar-capacity/generar-capacity.component';
import { VerCapacityComponent } from './components/ver-capacity/ver-capacity.component';
import { GenerarArsGfacComponent } from './components/generar-ars-gfac/generar-ars-gfac.component';
import { VerArsJiraComponent } from './components/ver-ars-jira/ver-ars-jira.component';
import { SlaComponent } from './components/sla/sla.component';
import { SlaGenerarComponent } from './components/sla-generar/sla-generar.component';
import { CuadraFacturacionComponent } from './components/cuadra-facturacion/cuadra-facturacion.component';
import { CuadraFacturacionGenerarComponent } from './components/cuadra-facturacion-generar/cuadra-facturacion-generar.component';
import { MywizardRvComponent } from './components/mywizard-rv/mywizard-rv.component';
import { MywizardRvGeneracionComponent } from './components/mywizard-rv-generacion/mywizard-rv-generacion.component';

import { FechasComponent } from './components/fechas/fechas.component';
import { FechasGeneracionComponent } from './components/fechas-generacion/fechas-generacion.component';


const routes: Routes = [
  { path: '', component: GenerarInformeComponent},
  { path: 'informes/:segmento', component: InformesComponent },
  { path: 'verCapacity', component: VerCapacityComponent },
  { path: 'capacity', component: GenerarCapacityComponent },
  { path: 'generar', component: GenerarInformeComponent },
  { path: 'ars-gfac', component: GenerarArsGfacComponent },
  { path: 'ver-ars-jira', component: VerArsJiraComponent },

  { path: 'sla', component: SlaComponent },
  { path: 'sla-generar', component: SlaGenerarComponent },

  { path: 'cuadra-facturacion', component: CuadraFacturacionComponent },
  { path: 'cuadra-facturacion-generar', component: CuadraFacturacionGenerarComponent },

  { path: 'mywizard-rv', component: MywizardRvComponent },
  { path: 'mywizard-rv-generar', component: MywizardRvGeneracionComponent },

  { path: 'fechas', component: FechasComponent },
  { path: 'fechas-generar', component: FechasGeneracionComponent },

  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', component: GenerarInformeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
