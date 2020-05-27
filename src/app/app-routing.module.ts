import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformesComponent } from './components/informes/informes.component';


const routes: Routes = [
  { path: 'informes', component: InformesComponent },
  { path: '', pathMatch: 'full', redirectTo: 'informes' },
  { path: '**', component: InformesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
