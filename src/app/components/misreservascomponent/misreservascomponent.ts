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
  styleUrl: './misreservascomponent.css',
  templateUrl: './misreservascomponent.html',
})
export class Misreservascomponent implements OnInit {
  reservas: Reserva[] = [];

  private meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  private formatoPrecio = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  ngOnInit(): void {
    this.cargarReservas();
  }

  get totalReservas(): number {
    return this.reservas.length;
  }

  private cargarReservas(): void {
    try {
      const texto = localStorage.getItem(CLAVE_STORAGE);
      this.reservas = texto ? (JSON.parse(texto) as Reserva[]) : [];
    } catch {
      this.reservas = [];
    }
  }

  private guardarReservas(): void {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(this.reservas));
    } catch {
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

  cargarDemo(): void {
    this.reservas = [
      {
        id: 'RES-1791477335282',
        alojamiento: {
          id: 1,
          nombre: 'Apartamento Moderno Chapinero',
          ciudad: 'Bogotá',
          imagen: 'imagen/hotel_hilton.jpeg',
        },
        fechaLlegada: '2026-10-28',
        fechaSalida: '2026-10-31',
        huespedes: 1,
        noches: 3,
        total: 645500,
        nombreHuesped: 'Laura Gómez',
        correo: 'laura@correo.com',
        estado: 'CONFIRMADA',
      },
      {
        id: 'RES-1791477999999',
        alojamiento: {
          id: 2,
          nombre: 'Apartamento frente al mar',
          ciudad: 'Cartagena',
          imagen: 'imagen/w-entrada.jpg',
        },
        fechaLlegada: '2026-12-20',
        fechaSalida: '2026-12-24',
        huespedes: 5,
        noches: 4,
        total: 1918000,
        nombreHuesped: 'Carlos Ruiz',
        correo: 'carlos@correo.com',
        estado: 'CONFIRMADA',
      },
    ];
    this.guardarReservas();
  }

  borrarTodas(): void {
    this.reservas = [];
    this.guardarReservas();
  }
}
