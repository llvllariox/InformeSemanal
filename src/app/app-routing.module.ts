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

  { 
    path: 'mantenimiento', 
    loadChildren: () => import('./mantenimiento/mantenimiento.module').then( m => m.MantenimientoModule ),
  },

  { 
    path: 'fechasDMS', 
    loadChildren: () => import('./fechasDMS/fechasDMS.module').then( m => m.FechasDMSModule ),
  },

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
