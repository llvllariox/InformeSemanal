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

@NgModule({
  declarations: [
    AppComponent,
    InformesComponent,
    NavbarComponent,
    GenerarInformeComponent,
    FechasPipe,
    GenerarCapacityComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
