import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InformesComponent } from './components/informes/informes.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GenerarInformeComponent } from './components/generar-informe/generar-informe.component';
import {ReactiveFormsModule} from '@angular/forms';
import { FechasPipe } from './pipes/fechas.pipe';
import { GenerarCapacityComponent } from './components/generar-capacity/generar-capacity.component';
import { VerCapacityComponent } from './components/ver-capacity/ver-capacity.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { FormsModule } from '@angular/forms';
import { HttpClientModule , HttpClientJsonpModule} from '@angular/common/http';
import { GenerarArsGfacComponent } from './components/generar-ars-gfac/generar-ars-gfac.component';
import { VerArsJiraComponent } from './components/ver-ars-jira/ver-ars-jira.component';
import { SlaComponent } from './components/sla/sla.component';
import { SlaGenerarComponent } from './components/sla-generar/sla-generar.component';
import { FechaVaciaPipe } from './pipes/fecha-vacia.pipe';
import { CuadraFacturacionComponent } from './components/cuadra-facturacion/cuadra-facturacion.component';
import { CuadraFacturacionGenerarComponent } from './components/cuadra-facturacion-generar/cuadra-facturacion-generar.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
