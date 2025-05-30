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
import { FechaVaciaPipe } from './pipes/fecha-vacia.pipe';
import { CuadraFacturacionComponent } from './components/cuadra-facturacion/cuadra-facturacion.component';
import { CuadraFacturacionGenerarComponent } from './components/cuadra-facturacion-generar/cuadra-facturacion-generar.component';

import { GenerarArsGplanComponent } from './components/generar-ars-gplan/generar-ars-gplan.component';
import { VerArsJiraPlanComponent } from './components/ver-ars-jira-plan/ver-ars-jira-plan.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

import { MetricasAMModule } from './metricas-am/metricas-am.module';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';
import { FechasDMSModule } from './fechasDMS/fechasDMS.module';
import { MyteMMEModule } from './myte-mme/myte-mme.module';
import { ValidarHHModule } from './validarHH/validarHH.module';
import { SharedModule } from './shared/shared.module';

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
    FechaVaciaPipe,
    CuadraFacturacionComponent,
    CuadraFacturacionGenerarComponent,
    GenerarArsGplanComponent,
    VerArsJiraPlanComponent,
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
    FechasDMSModule,
    MyteMMEModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }