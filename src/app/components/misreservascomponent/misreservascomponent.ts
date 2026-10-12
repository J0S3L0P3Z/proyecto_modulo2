import { Component, OnInit } from '@angular/core';
export const CLAVE_STORAGE = 'reservas-inversiones-lr';

export interface Reserva {
  id: string;
  alojamiento: {
    id: number;
    nombre: string;
    ciudad: string;
    imagen: string;
  };
  fechaLlegada: string;
  fechaSalida: string;
  huespedes: number;
  noches: number;
  total: number;
  nombreHuesped: string;
  correo: string;
  estado: 'CONFIRMADA' | 'CANCELADA';
}

@Component({
  selector: 'app-misreservascomponent',
  standalone: false,
  templateUrl: './misreservascomponent.html',
  styleUrl: './misreservascomponent.css'
})
export class Misreservascomponent implements OnInit {
  reservas: Reserva[] = [];

  private meses = [
    'enero', 'febrero', 'marzo', 'abril',
    'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  private formatoPrecio = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  ngOnInit(): void {
    this.cargarReservas();
  }

  private cargarReservas(): void {
    try {
      const texto = localStorage.getItem(CLAVE_STORAGE);
      this.reservas = texto ? JSON.parse(texto) as Reserva[] : [];
    } catch {
      this.reservas = [];
    }
  }

  formatearFecha(fechaIso: string): string {
    const [anio, mes, dia] = fechaIso.split('-').map(Number);
    return `${dia} de ${this.meses[mes - 1]} de ${anio}`;
  }

  formatearPrecio(valor: number): string {
    return this.formatoPrecio.format(valor);
  }

  ocultarImagen(evento: Event): void {
    (evento.target as HTMLImageElement).style.display = 'none';
  }
}
