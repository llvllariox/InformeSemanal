import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformesComponent } from './components/informes/informes.component';
import { GenerarInformeComponent } from './components/generar-informe/generar-informe.component';
import { GenerarCapacityComponent } from './components/generar-capacity/generar-capacity.component';
import { VerCapacityComponent } from './components/ver-capacity/ver-capacity.component';

import { GenerarArsGfacComponent } from './components/generar-ars-gfac/generar-ars-gfac.component';
import { GenerarArsGplanComponent } from './components/generar-ars-gplan/generar-ars-gplan.component';

import { VerArsJiraComponent } from './components/ver-ars-jira/ver-ars-jira.component';
import { VerArsJiraPlanComponent } from './components/ver-ars-jira-plan/ver-ars-jira-plan.component';

import { SlaComponent } from './components/sla/sla.component';
import { SlaGenerarComponent } from './components/sla-generar/sla-generar.component';
import { CuadraFacturacionComponent } from './components/cuadra-facturacion/cuadra-facturacion.component';
import { CuadraFacturacionGenerarComponent } from './components/cuadra-facturacion-generar/cuadra-facturacion-generar.component';
//import { MywizardRvComponent } from './components/mywizard-rv/mywizard-rv.component';
//import { MywizardRvGeneracionComponent } from './components/mywizard-rv-generacion/mywizard-rv-generacion.component';

import { FechasComponent } from './components/fechas/fechas.component';
import { FechasGeneracionComponent } from './components/fechas-generacion/fechas-generacion.component';

import { InformeSemanalComponent } from './components/manto/informe-semanal/informe-semanal.component';
import { InformeSemanalGeneracionComponent } from './components/manto/informe-semanal-generacion/informe-semanal-generacion.component';
import { InformeSemanalGeneracionComercialComponent } from './components/manto/informe-semanal-generacion-comercial/informe-semanal-generacion-comercial.component';
import { InformeSemanalConfComponent } from './components/manto/informe-semanal-conf/informe-semanal-conf.component';
import { InformeSemanalConfComercialComponent } from './components/manto/informe-semanal-conf-comercial/informe-semanal-conf-comercial.component';
import { InformeSemanalConfupdComponent } from './components/manto/informe-semanal-confupd/informe-semanal-confupd.component';

import { MyteMmeGeneracionComponent } from './components/mytemme/myte-mme-generacion/myte-mme-generacion.component';

const routes: Routes = [
  { path: '', component: GenerarInformeComponent},
  { path: 'informes/:segmento', component: InformesComponent },
  { path: 'verCapacity', component: VerCapacityComponent },
  { path: 'capacity', component: GenerarCapacityComponent },
  { path: 'generar', component: GenerarInformeComponent },
  
  { path: 'ars-gfac', component: GenerarArsGfacComponent },
  { path: 'ars-gplan', component: GenerarArsGplanComponent },
  
  { path: 'ver-ars-jira', component: VerArsJiraComponent },
  { path: 'ver-ars-jira-plan', component: VerArsJiraPlanComponent },

  { path: 'sla', component: SlaComponent },
  { path: 'sla-generar', component: SlaGenerarComponent },

  { path: 'cuadra-facturacion', component: CuadraFacturacionComponent },
  { path: 'cuadra-facturacion-generar', component: CuadraFacturacionGenerarComponent },

 // { path: 'mywizard-rv', component: MywizardRvComponent },
//  { path: 'mywizard-rv-generar', component: MywizardRvGeneracionComponent },

  { path: 'fechas', component: FechasComponent },
  { path: 'fechas-generar', component: FechasGeneracionComponent },

  { 
    path: 'mantenimiento-consolidar', 
    loadChildren: () => import('./mantenimiento/mantenimiento.module').then( m => m.MantenimientoModule ),
  },

  { path: 'manto-informe-semanal', component: InformeSemanalComponent },
  { path: 'manto-informe-semanal-generar', component: InformeSemanalGeneracionComponent },
  { path: 'manto-informe-semanal-generar-comercial', component: InformeSemanalGeneracionComercialComponent },
  { path: 'manto-informe-semanal-conf', component: InformeSemanalConfComponent },
  { path: 'manto-informe-semanal-conf-comercial', component: InformeSemanalConfComercialComponent },
  { path: 'manto-informe-semanal-confupd', component: InformeSemanalConfupdComponent },

  { path: 'myte-mme-generacion', component: MyteMmeGeneracionComponent },

  // Metricas AM
  { 
    path: 'metricas-am', 
    loadChildren: () => import('./metricas-am/metricas-am.module').then( m => m.MetricasAMModule ),
  },

  // validarHH
  { 
    path: 'validarHH', 
    loadChildren: () => import('./validarHH/validarHH.module').then( m => m.ValidarHHModule ),
  },

  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', component: GenerarInformeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
