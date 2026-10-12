import { Component, OnInit } from '@angular/core';
import { Climaservice, ClimaActual } from '../../services/climaservice';

@Component({
  selector: 'app-iniciocomponent',
  standalone: false,
  styleUrl: './iniciocomponent.css',
  templateUrl: './iniciocomponent.html',
})
export class Iniciocomponent implements OnInit {
  clima: ClimaActual | null = null;
  cargandoClima = true;
  errorClima = false;
  ciudadClima = 'Bogota';

  constructor(private climaService: Climaservice) {}

  ngOnInit(): void {
    this.climaService.obtenerClima(this.ciudadClima).subscribe({
      next: respuesta => {
        this.clima = respuesta.current;
        this.cargandoClima = false;
      },
      error: () => {
        this.errorClima = true;
        this.cargandoClima = false;
      }
    });
  }
}
