import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlojamientoService } from '../../services/alojamientoservice';
import { CLAVE_STORAGE, Reserva } from '../misreservascomponent/misreservascomponent';

export interface Alojamiento {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
  ubicacion: string;
  tipo: string;
  capacidad: number;
  habitaciones: number;
  camas: number;
  banos: number;
  precioNoche: number;
  tarifaLimpieza: number;
  calificacion: number;
  activo: boolean;
  imagenPrincipal: string;
  imagenes: string[];
  servicios: string[];
  reglas: string[];
}

export interface Resena {
  id: number;
  alojamientoId: number;
  usuario: string;
  calificacion: number;
  comentario: string;
}

export interface Cotizacion {
  noches: number;
  subtotal: number;
  tarifaLimpieza: number;
  tarifaServicio: number;
  total: number;
}

@Component({
  selector: 'app-detallealojamientocomponent',
  standalone: false,
  styleUrl: './detallealojamientocomponent.css',
  templateUrl: './detallealojamientocomponent.html',
})
export class Detallealojamientocomponent implements OnInit {
  alojamiento: Alojamiento | null = null;
  resenas: Resena[] = [];
  cargando = true;
  imagenSeleccionada = '';

  hoy = '';
  fechaLlegada = '';
  fechaSalida = '';
  huespedes = 1;
  opcionesHuespedes: number[] = [];
  errores: string[] = [];
  cotizacion: Cotizacion | null = null;

  mostrarFormulario = false;
  nombreHuesped = '';
  correo = '';
  errorFormulario = '';
  reservaCreada: Reserva | null = null;

  constructor(
    private route: ActivatedRoute,
    private alojamientoService: AlojamientoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.hoy = this.fechaDeHoy();
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.alojamientoService.obtenerAlojamientos().subscribe({
      next: (datos: any) => {
        const encontrado: Alojamiento | undefined = datos.alojamientos.find(
          (a: Alojamiento) => a.id === id && a.activo,
        );

        if (encontrado) {
          this.alojamiento = encontrado;
          this.imagenSeleccionada = encontrado.imagenes[0] || encontrado.imagenPrincipal;
          this.opcionesHuespedes = Array.from({ length: encontrado.capacidad }, (_, i) => i + 1);
          this.resenas = datos.resenas.filter((r: Resena) => r.alojamientoId === id);
        }

        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  seleccionarImagen(imagen: string): void {
    this.imagenSeleccionada = imagen;
  }

  reiniciarCotizacion(): void {
    this.cotizacion = null;
    this.mostrarFormulario = false;
    this.errores = [];
    this.errorFormulario = '';
  }

  calcularCotizacion(): void {
    this.reiniciarCotizacion();

    if (!this.alojamiento) {
      return;
    }


    const errores: string[] = [];

    if (!this.fechaLlegada || !this.fechaSalida) {
      errores.push('Selecciona la fecha de llegada y la fecha de salida.');
    } else {
      if (this.fechaLlegada < this.hoy) {
        errores.push('La fecha de llegada no puede ser anterior a hoy.');
      }
      if (this.fechaSalida <= this.fechaLlegada) {
        errores.push('La fecha de salida debe ser posterior a la fecha de llegada.');
      }
    }

    if (!this.huespedes || this.huespedes <= 0) {
      errores.push('El número de huéspedes debe ser mayor que cero.');
    }

    if (this.huespedes > this.alojamiento.capacidad) {
      errores.push('El número de huéspedes supera la capacidad del alojamiento (' + this.alojamiento.capacidad + ').');
    }

    if (this.alojamiento.precioNoche <= 0) {
      errores.push('Este alojamiento no tiene un precio válido.');
    }

    if (errores.length > 0) {
      this.errores = errores;
      return;
    }

    const noches = this.calcularNoches(this.fechaLlegada, this.fechaSalida);
    const subtotal = noches * this.alojamiento.precioNoche;
    const tarifaLimpieza = this.alojamiento.tarifaLimpieza;
    const tarifaServicio = Math.round(subtotal * 0.1);

    this.cotizacion = {
      noches: noches,
      subtotal: subtotal,
      tarifaLimpieza: tarifaLimpieza,
      tarifaServicio: tarifaServicio,
      total: subtotal + tarifaLimpieza + tarifaServicio,
    };
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.errorFormulario = '';
  }

  confirmarReserva(): void {
    this.errorFormulario = '';

    if (!this.alojamiento || !this.cotizacion) {
      this.errorFormulario = 'Primero debes generar una cotización válida.';
      return;
    }

    const nombre = this.nombreHuesped.trim();
    const correo = this.correo.trim();

    if (nombre === '') {
      this.errorFormulario = 'Ingresa el nombre del huésped.';
      return;
    }

    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(correo)) {
      this.errorFormulario = 'Ingresa un correo electrónico válido.';
      return;
    }

    const reserva: Reserva = {
      id: 'RES-' + Date.now(),
      alojamiento: {
        id: this.alojamiento.id,
        nombre: this.alojamiento.nombre,
        ciudad: this.alojamiento.ciudad,
        imagen: this.alojamiento.imagenPrincipal,
      },
      fechaLlegada: this.fechaLlegada,
      fechaSalida: this.fechaSalida,
      huespedes: this.huespedes,
      noches: this.cotizacion.noches,
      total: this.cotizacion.total,
      nombreHuesped: nombre,
      correo: correo,
      estado: 'CONFIRMADA',
    };

    this.guardarReserva(reserva);

    this.reservaCreada = reserva;
    this.cotizacion = null;
    this.mostrarFormulario = false;
    this.nombreHuesped = '';
    this.correo = '';
    this.fechaLlegada = '';
    this.fechaSalida = '';
    this.huespedes = 1;
  }

  nuevaReserva(): void {
    this.reservaCreada = null;
  }

  private guardarReserva(reserva: Reserva): void {
    let lista: Reserva[] = [];

    try {
      const texto = localStorage.getItem(CLAVE_STORAGE);
      lista = texto ? (JSON.parse(texto) as Reserva[]) : [];
    } catch {
      lista = [];
    }

    lista.unshift(reserva);

    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
    } catch {
    }
  }

  private calcularNoches(llegada: string, salida: string): number {
    const [a1, m1, d1] = llegada.split('-').map(Number);
    const [a2, m2, d2] = salida.split('-').map(Number);
    const milisegundos = Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1);
    return Math.round(milisegundos / 86400000);
  }

  private fechaDeHoy(): string {
    const f = new Date();
    const mes = String(f.getMonth() + 1).padStart(2, '0');
    const dia = String(f.getDate()).padStart(2, '0');
    return f.getFullYear() + '-' + mes + '-' + dia;
  }

  formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  estrellasLlenas(calificacion: number): number[] {
    return Array.from({ length: Math.round(calificacion) }, (_, i) => i + 1);
  }

  estrellasVacias(calificacion: number): number[] {
    const vacias = Math.max(5 - Math.round(calificacion), 0);
    return Array.from({ length: vacias }, (_, i) => i + 1);
  }

  iniciales(nombre: string): string {
    const palabras = nombre.trim().split(' ');
    const primera = palabras[0] ? palabras[0].charAt(0) : '';
    const segunda = palabras[1] ? palabras[1].charAt(0) : '';
    return (primera + segunda).toUpperCase();
  }
}
