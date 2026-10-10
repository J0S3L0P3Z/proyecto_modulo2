import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from '@openng/ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { Navbarcomponent } from './components/navbarcomponent/navbarcomponent';
import { Footercomponent } from './components/footercomponent/footercomponent';
import { Alojamientoscomponent } from './components/alojamientoscomponent/alojamientoscomponent';
import { Iniciocomponent } from './components/iniciocomponent/iniciocomponent';
import { Gestionalojamientocomponent } from './components/gestionalojamientocomponent/gestionalojamientocomponent';
import { Gestionreservascomponent } from './components/gestionreservascomponent/gestionreservascomponent';
import { Misreservascomponent } from './components/misreservascomponent/misreservascomponent';
import { Detallealojamientocomponent } from './components/detallealojamientocomponent/detallealojamientocomponent';

@NgModule({
  declarations: [
    App,
    Navbarcomponent,
    Footercomponent,
    Alojamientoscomponent,
    Iniciocomponent,
    Gestionalojamientocomponent,
    Gestionreservascomponent,
    Misreservascomponent,
    Detallealojamientocomponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
