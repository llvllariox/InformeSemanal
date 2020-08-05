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
