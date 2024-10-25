import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioMyteMMEComponent } from './components/formulario/formulario.component';
import { MyteMMERoutingModule } from './myte-mme-routing.module';

@NgModule({
  declarations: [
    FormularioMyteMMEComponent
  ],
  imports: [
    CommonModule,
    MyteMMERoutingModule
  ]
})
export class MyteMMEModule { }
