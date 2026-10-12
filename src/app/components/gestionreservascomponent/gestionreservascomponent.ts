import { Component, OnInit } from '@angular/core';
import { ToastrService } from '@relynn/ngx-toastr';

interface AlojamientoReserva {
  id: number;
  nombre: string;
  ciudad: string;
  imagen: string;
}

interface Reserva {
  id: number;
  alojamiento: AlojamientoReserva;
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
  selector: 'app-gestionreservascomponent',
  standalone: false,
  templateUrl: './gestionreservascomponent.html',
  styleUrls: ['./gestionreservascomponent.css']
})

export class Gestionreservascomponent implements OnInit {

  reservas: Reserva[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  mensajeError = '';
  idEdicion = 0;
  claveStorage = 'reservas-inversiones-lr';

  formulario: Reserva = this.crearFormularioVacio();

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  crearFormularioVacio(): Reserva {
    return {
      id: 0,
      alojamiento: {
        id: 0,
        nombre: '',
        ciudad: '',
        imagen: ''
      },
      fechaLlegada: '',
      fechaSalida: '',
      huespedes: 1,
      noches: 0,
      total: 0,
      nombreHuesped: '',
      correo: '',
      estado: 'CONFIRMADA'
    };
  }

  cargarReservas(): void {
    try {
      const datos = localStorage.getItem(this.claveStorage);

      if (datos) {
        const reservasGuardadas = JSON.parse(datos);
        this.reservas = Array.isArray(reservasGuardadas)
          ? reservasGuardadas
          : [];
      } else {
        this.reservas = [];
      }
    } catch {
      this.reservas = [];
    }
  }

  guardarEnStorage(): void {
    localStorage.setItem(
      this.claveStorage,
      JSON.stringify(this.reservas)
    );
  }

  editarReserva(reserva: Reserva): void {
    this.formulario = {
      id: reserva.id,
      alojamiento: {
        id: reserva.alojamiento.id,
        nombre: reserva.alojamiento.nombre,
        ciudad: reserva.alojamiento.ciudad,
        imagen: reserva.alojamiento.imagen
      },
      fechaLlegada: reserva.fechaLlegada,
      fechaSalida: reserva.fechaSalida,
      huespedes: reserva.huespedes,
      noches: reserva.noches,
      total: reserva.total,
      nombreHuesped: reserva.nombreHuesped,
      correo: reserva.correo,
      estado: reserva.estado
    };

    this.idEdicion = reserva.id;
    this.modoEdicion = true;
    this.mostrarFormulario = true;
    this.mensajeError = '';
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.mensajeError = '';
    this.idEdicion = 0;
    this.formulario = this.crearFormularioVacio();
  }

  calcularNoches(): number {
    if (!this.formulario.fechaLlegada || !this.formulario.fechaSalida) {
      return 0;
    }

    const llegada = new Date(this.formulario.fechaLlegada + 'T00:00:00');
    const salida = new Date(this.formulario.fechaSalida + 'T00:00:00');
    const diferencia = salida.getTime() - llegada.getTime();

    if (diferencia <= 0) {
      return 0;
    }

    return Math.round(diferencia / (1000 * 60 * 60 * 24));
  }

  get fechaMinima(): string {
    return new Date().toISOString().split('T')[0];
  }

  guardarReserva(): void {
    if (!this.modoEdicion || this.idEdicion === 0) {
      this.mensajeError = 'Selecciona una reserva para editar.';
      this.toastr.warning(this.mensajeError);
      return;
    }

    if (
      !this.formulario.nombreHuesped.trim() ||
      !this.formulario.correo.trim() ||
      !this.formulario.fechaLlegada ||
      !this.formulario.fechaSalida
    ) {
      this.mensajeError = 'Completa todos los campos obligatorios.';
      this.toastr.warning(this.mensajeError);
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      this.formulario.correo.trim()
    );

    if (!correoValido) {
      this.mensajeError = 'Ingresa un correo electrónico válido.';
      this.toastr.warning(this.mensajeError);
      return;
    }

    if (this.formulario.fechaSalida <= this.formulario.fechaLlegada) {
      this.mensajeError = 'La fecha de salida debe ser posterior a la llegada.';
      this.toastr.warning(this.mensajeError);
      return;
    }

    if (
      !Number.isInteger(Number(this.formulario.huespedes)) ||
      Number(this.formulario.huespedes) < 1
    ) {
      this.mensajeError = 'La cantidad de huéspedes debe ser mínimo 1.';
      this.toastr.warning(this.mensajeError);
      return;
    }

    if (
      !Number.isFinite(Number(this.formulario.total)) ||
      Number(this.formulario.total) < 0
    ) {
      this.mensajeError = 'El total de la reserva no es válido.';
      this.toastr.warning(this.mensajeError);
      return;
    }

    const indice = this.reservas.findIndex(
      reserva => reserva.id === this.idEdicion
    );

    if (indice === -1) {
      this.mensajeError = 'No se encontró la reserva que deseas editar.';
      this.toastr.error(this.mensajeError);
      return;
    }

    const reservaActualizada: Reserva = {
      id: this.reservas[indice].id,
      alojamiento: {
        id: this.reservas[indice].alojamiento.id,
        nombre: this.reservas[indice].alojamiento.nombre,
        ciudad: this.reservas[indice].alojamiento.ciudad,
        imagen: this.reservas[indice].alojamiento.imagen
      },
      fechaLlegada: this.reservas[indice].fechaLlegada,
      fechaSalida: this.reservas[indice].fechaSalida,
      huespedes: this.reservas[indice].huespedes,
      noches: this.reservas[indice].noches,
      total: this.reservas[indice].total,
      nombreHuesped: this.formulario.nombreHuesped.trim(),
      correo: this.formulario.correo.trim(),
      estado: this.formulario.estado
    };

    reservaActualizada.fechaLlegada = this.formulario.fechaLlegada;
    reservaActualizada.fechaSalida = this.formulario.fechaSalida;
    reservaActualizada.huespedes = Number(this.formulario.huespedes);
    reservaActualizada.noches = this.calcularNoches();
    reservaActualizada.total = Number(this.formulario.total);

    this.reservas[indice] = reservaActualizada;

    this.guardarEnStorage();
    this.cerrarFormulario();
    this.cargarReservas();
    this.toastr.warning('Reserva actualizada correctamente');
  }

  eliminarReserva(id: number): void {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas eliminar esta reserva?'
    );

    if (!confirmar) {
      return;
    }

    this.reservas = this.reservas.filter(
      reserva => reserva.id !== id
    );

    this.guardarEnStorage();
    this.toastr.error('Reserva eliminada correctamente');
  }
}
