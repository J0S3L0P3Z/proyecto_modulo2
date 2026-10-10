import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Iniciocomponent } from './components/iniciocomponent/iniciocomponent';
import { Alojamientoscomponent } from './components/alojamientoscomponent/alojamientoscomponent';
import { Misreservascomponent } from './components/misreservascomponent/misreservascomponent';
import { Gestionreservascomponent } from './components/gestionreservascomponent/gestionreservascomponent';
import { Gestionalojamientocomponent } from './components/gestionalojamientocomponent/gestionalojamientocomponent';
import { Detallealojamientocomponent } from './components/detallealojamientocomponent/detallealojamientocomponent';

const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'inicio', component: Iniciocomponent },
  { path: 'alojamientos', component: Alojamientoscomponent },
  { path: 'alojamientos/:id', component: Detallealojamientocomponent },
  { path: 'mis-reservas', component: Misreservascomponent },

  { path: 'gestion-reservas', component: Gestionreservascomponent },
  { path: 'gestion-alojamientos', component: Gestionalojamientocomponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
