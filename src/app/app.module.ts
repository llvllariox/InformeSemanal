import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InformesComponent } from './components/informes/informes.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GenerarInformeComponent } from './components/generar-informe/generar-informe.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FechasPipe } from './pipes/fechas.pipe';
import { GenerarCapacityComponent } from './components/generar-capacity/generar-capacity.component';
import { VerCapacityComponent } from './components/ver-capacity/ver-capacity.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { FormsModule } from '@angular/forms';
import { HttpClientModule , HttpClientJsonpModule } from '@angular/common/http';
import { GenerarArsGfacComponent } from './components/generar-ars-gfac/generar-ars-gfac.component';
import { VerArsJiraComponent } from './components/ver-ars-jira/ver-ars-jira.component';
import { SlaComponent } from './components/sla/sla.component';
import { SlaGenerarComponent } from './components/sla-generar/sla-generar.component';
import { FechaVaciaPipe } from './pipes/fecha-vacia.pipe';
import { CuadraFacturacionComponent } from './components/cuadra-facturacion/cuadra-facturacion.component';
import { CuadraFacturacionGenerarComponent } from './components/cuadra-facturacion-generar/cuadra-facturacion-generar.component';
import { MywizardRvComponent } from './components/mywizard-rv/mywizard-rv.component';
import { MywizardRvGeneracionComponent } from './components/mywizard-rv-generacion/mywizard-rv-generacion.component';
import { FechasComponent } from './components/fechas/fechas.component';
import { FechasGeneracionComponent } from './components/fechas-generacion/fechas-generacion.component';
import { FechaDMSPipe } from './pipes/fecha-dms.pipe';
import { GenerarArsGplanComponent } from './components/generar-ars-gplan/generar-ars-gplan.component';
import { VerArsJiraPlanComponent } from './components/ver-ars-jira-plan/ver-ars-jira-plan.component';
import { InformeSemanalComponent } from './components/manto/informe-semanal/informe-semanal.component';
import { InformeSemanalGeneracionComponent } from './components/manto/informe-semanal-generacion/informe-semanal-generacion.component';
import { InformeSemanalConfComponent } from './components/manto/informe-semanal-conf/informe-semanal-conf.component';
import { InformeSemanalConfupdComponent } from './components/manto/informe-semanal-confupd/informe-semanal-confupd.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { InformeSemanalGeneracionComercialComponent } from './components/manto/informe-semanal-generacion-comercial/informe-semanal-generacion-comercial.component';
import { InformeSemanalConfComercialComponent } from './components/manto/informe-semanal-conf-comercial/informe-semanal-conf-comercial.component';
import { MyteMmeGeneracionComponent } from './components/mytemme/myte-mme-generacion/myte-mme-generacion.component';

import { MetricasAMModule } from './metricas-am/metricas-am.module';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';
import { ValidarHHModule } from './validarHH/validarHH.module';
import { SharedModule } from './shared/shared.module';


// import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    InformesComponent,
    NavbarComponent,
    GenerarInformeComponent,
    FechasPipe,
    GenerarCapacityComponent,
    VerCapacityComponent,
    GenerarArsGfacComponent,
    VerArsJiraComponent,
    SlaComponent,
    SlaGenerarComponent,
    FechaVaciaPipe,
    CuadraFacturacionComponent,
    CuadraFacturacionGenerarComponent,
    MywizardRvComponent,
    MywizardRvGeneracionComponent,
    FechasComponent,
    FechasGeneracionComponent,
    FechaDMSPipe,
    GenerarArsGplanComponent,
    VerArsJiraPlanComponent,
    InformeSemanalComponent,
    InformeSemanalGeneracionComponent,
    InformeSemanalConfComponent,
    InformeSemanalConfupdComponent,
    InformeSemanalGeneracionComercialComponent,
    InformeSemanalConfComercialComponent,
    MyteMmeGeneracionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    FormsModule,
    
    HttpClientModule,
    HttpClientJsonpModule,

    SharedModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),


    MetricasAMModule,
    MantenimientoModule,
    ValidarHHModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
