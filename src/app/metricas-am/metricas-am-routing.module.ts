import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormularioComponent } from './components/formulario/formulario.component';
import { MostrarComponent } from './components/mostrar/mostrar.component';

const routes: Routes = [
    {
        path: 'mostrar',
        component: MostrarComponent,
    },
    {
        path: 'formulario',
        component: FormularioComponent,
    },
    {
        path: '**',
        component: FormularioComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild( routes ),
    ],
    exports: [
        RouterModule,
    ],
})
export class MetricasAMRoutingModule { }