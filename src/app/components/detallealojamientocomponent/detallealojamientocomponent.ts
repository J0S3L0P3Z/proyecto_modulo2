import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlojamientoService } from '../../services/alojamientoservice';
import { ToastrService } from '@relynn/ngx-toastr';
import { MonedaserviceService, TasasMoneda } from '../../services/monedaservice';

@Component({
  selector: 'app-detalle-alojamiento',
  standalone: false,
  templateUrl: './detallealojamientocomponent.html',
  styleUrl: './detallealojamientocomponent.css'
})
export class Detallealojamientocomponent implements OnInit {

  alojamiento: any = null;
  resenas: any[] = [];
  cargando = true;

  nombreResena = '';
  calificacionResena = 5;
  comentarioResena = '';
  mensajeResena = '';

  mostrarFormularioReserva = false;
  nombreHuesped = '';
  correoHuesped = '';
  fechaLlegada = '';
  fechaSalida = '';
  huespedes = 1;
  mensajeReserva = '';

  monedaSeleccionada: 'COP' | 'USD' | 'EUR' = 'COP';
  tasasMoneda: TasasMoneda | null = null;
  cargandoMonedas = true;
  errorMonedas = false;

  cantidadMoneda = 1;
  monedaOrigen: 'COP' | 'USD' | 'EUR' = 'COP';
  monedaDestino: 'COP' | 'USD' | 'EUR' = 'USD';

  constructor(
    private route: ActivatedRoute,
    private alojamientoService: AlojamientoService,
    private toastr: ToastrService,
    private monedasService: MonedaserviceService
  ) {}

  ngOnInit(): void {
    this.cargarTasasMoneda();

    this.route.paramMap.subscribe(parametros => {
      const id = Number(parametros.get('id'));

      this.cargando = true;
      this.mensajeResena = '';

      this.alojamientoService.obtenerLista().subscribe(lista => {
        this.alojamiento = lista.find(
          alojamiento => Number(alojamiento.id) === id && alojamiento.activo
        ) || null;

        this.cargando = false;
      });

      this.cargarResenas(id);
    });
  }

  cargarTasasMoneda(): void {
    this.monedasService.obtenerTasas().subscribe({
      next: respuesta => {
        this.tasasMoneda = respuesta;
        this.cargandoMonedas = false;
        this.errorMonedas = false;
      },
      error: error => {
        console.error('Error al consultar las tasas de cambio:', error);
        this.cargandoMonedas = false;
        this.errorMonedas = true;
      }
    });
  }

  obtenerPrecioConvertido(precioCOP: number): number | null {
    if (!this.tasasMoneda) {
      return null;
    }

    return this.monedasService.convertirDesdeCOP(
      Number(precioCOP) || 0,
      this.monedaSeleccionada,
      this.tasasMoneda
    );
  }

  convertirCantidad(): number {
    if (!this.tasasMoneda) {
      return 0;
    }

    const cantidad = Number(this.cantidadMoneda) || 0;
    let cantidadUSD: number;

    if (this.monedaOrigen === 'COP') {
      cantidadUSD = cantidad / this.tasasMoneda.rates.COP;
    } else if (this.monedaOrigen === 'EUR') {
      cantidadUSD = cantidad / this.tasasMoneda.rates.EUR;
    } else {
      cantidadUSD = cantidad;
    }

    if (this.monedaDestino === 'COP') {
      return cantidadUSD * this.tasasMoneda.rates.COP;
    }

    if (this.monedaDestino === 'EUR') {
      return cantidadUSD * this.tasasMoneda.rates.EUR;
    }

    return cantidadUSD;
  }

  cargarResenas(id: number): void {
    this.alojamientoService.obtenerAlojamientos().subscribe({
      next: data => {
        const resenasJson = (data.resenas || []).filter(
          (resena: any) => Number(resena.alojamientoId) === id
        );

        let resenasGuardadas: any[] = [];

        try {
          const datos: unknown = JSON.parse(
            localStorage.getItem('resenas') || '[]'
          );

          resenasGuardadas = Array.isArray(datos) ? datos : [];
        } catch {
          resenasGuardadas = [];
        }

        const resenasLocales = resenasGuardadas.filter(
          (resena: any) => Number(resena.alojamientoId) === id
        );

        this.resenas = resenasJson.concat(resenasLocales);
      },
      error: () => {
        let resenasGuardadas: any[] = [];

        try {
          const datos: unknown = JSON.parse(
            localStorage.getItem('resenas') || '[]'
          );

          resenasGuardadas = Array.isArray(datos) ? datos : [];
        } catch {
          resenasGuardadas = [];
        }

        this.resenas = resenasGuardadas.filter(
          (resena: any) => Number(resena.alojamientoId) === id
        );
      }
    });
  }

  crearResena(): void {
    if (!this.nombreResena.trim() || !this.comentarioResena.trim()) {
      this.mensajeResena = 'Escribe tu nombre y un comentario.';
      this.toastr.warning(this.mensajeResena);
      return;
    }

    if (this.calificacionResena < 1 || this.calificacionResena > 5) {
      this.mensajeResena = 'Selecciona una calificación entre 1 y 5.';
      this.toastr.warning(this.mensajeResena);
      return;
    }

    const nuevaResena = {
      id: Date.now(),
      alojamientoId: Number(this.alojamiento.id),
      usuario: this.nombreResena.trim(),
      calificacion: Number(this.calificacionResena),
      comentario: this.comentarioResena.trim()
    };

    let resenasGuardadas: any[] = [];

    try {
      const datos: unknown = JSON.parse(
        localStorage.getItem('resenas') || '[]'
      );

      resenasGuardadas = Array.isArray(datos) ? datos : [];
    } catch {
      resenasGuardadas = [];
    }

    resenasGuardadas.push(nuevaResena);

    localStorage.setItem('resenas', JSON.stringify(resenasGuardadas));

    this.resenas.push(nuevaResena);

    const totalCalificaciones = this.resenas.reduce(
      (total, resena) => total + Number(resena.calificacion),
      0
    );

    this.alojamiento.calificacion = Number(
      (totalCalificaciones / this.resenas.length).toFixed(1)
    );

    this.nombreResena = '';
    this.calificacionResena = 5;
    this.comentarioResena = '';
    this.mensajeResena = '¡Tu reseña se ha publicado correctamente!';

    this.toastr.success(this.mensajeResena);
  }

  get fechaMinima(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  calcularNochesReserva(): number {
    if (!this.fechaLlegada || !this.fechaSalida) {
      return 0;
    }

    const llegada = new Date(this.fechaLlegada + 'T00:00:00');
    const salida = new Date(this.fechaSalida + 'T00:00:00');
    const diferencia = salida.getTime() - llegada.getTime();

    if (diferencia <= 0) {
      return 0;
    }

    return diferencia / (1000 * 60 * 60 * 24);
  }

  calcularSubtotalReserva(): number {
    if (!this.alojamiento) {
      return 0;
    }

    const precioNoche = Number(this.alojamiento.precioNoche) || 0;

    return this.calcularNochesReserva() * precioNoche;
  }

  calcularTarifaServicio(): number {
    return this.calcularSubtotalReserva() * 0.10;
  }

  calcularTotalReserva(): number {
    if (!this.alojamiento) {
      return 0;
    }

    const tarifaLimpieza = Number(this.alojamiento.tarifaLimpieza) || 0;

    return this.calcularSubtotalReserva() +
      tarifaLimpieza +
      this.calcularTarifaServicio();
  }

  abrirFormularioReserva(): void {
    this.nombreHuesped = '';
    this.correoHuesped = '';
    this.fechaLlegada = '';
    this.fechaSalida = '';
    this.huespedes = 1;
    this.mensajeReserva = '';
    this.mostrarFormularioReserva = true;
  }

  cerrarFormularioReserva(): void {
    this.mostrarFormularioReserva = false;
    this.mensajeReserva = '';
  }

  crearReserva(): void {
    this.mensajeReserva = '';

    if (
      !this.nombreHuesped.trim() ||
      !this.correoHuesped.trim() ||
      !this.fechaLlegada ||
      !this.fechaSalida
    ) {
      this.mensajeReserva = 'Completa todos los campos obligatorios.';
      this.toastr.warning(this.mensajeReserva);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoHuesped.trim())) {
      this.mensajeReserva = 'Escribe un correo electrónico válido.';
      this.toastr.warning(this.mensajeReserva);
      return;
    }

    if (this.fechaLlegada < this.fechaMinima) {
      this.mensajeReserva = 'La fecha de llegada no puede ser anterior a hoy.';
      this.toastr.warning(this.mensajeReserva);
      return;
    }

    const noches = this.calcularNochesReserva();

    if (noches < 1) {
      this.mensajeReserva = 'La fecha de salida debe ser posterior a la llegada.';
      this.toastr.warning(this.mensajeReserva);
      return;
    }

    const capacidad = Number(this.alojamiento.capacidad);

    if (
      !Number.isInteger(Number(this.huespedes)) ||
      Number(this.huespedes) < 1 ||
      (Number.isFinite(capacidad) && capacidad > 0 && Number(this.huespedes) > capacidad)
    ) {
      this.mensajeReserva = Number.isFinite(capacidad) && capacidad > 0
        ? `El número de huéspedes debe estar entre 1 y ${capacidad}.`
        : 'Ingresa un número válido de huéspedes.';
      this.toastr.warning(this.mensajeReserva);
      return;
    }

    const clave = 'reservas-inversiones-lr';
    let reservas: any[] = [];

    try {
      const datos: unknown = JSON.parse(localStorage.getItem(clave) || '[]');
      reservas = Array.isArray(datos) ? datos : [];
    } catch {
      reservas = [];
    }

    let nuevoId = 1;

    for (const reserva of reservas) {
      if (Number(reserva.id) >= nuevoId) {
        nuevoId = Number(reserva.id) + 1;
      }
    }

    const nuevaReserva = {
      id: nuevoId,
      alojamiento: {
        id: Number(this.alojamiento.id),
        nombre: this.alojamiento.nombre,
        ciudad: this.alojamiento.ciudad,
        imagen: (this.alojamiento.imagenes && this.alojamiento.imagenes.length > 0)
          ? this.alojamiento.imagenes[0]
          : this.alojamiento.imagenPrincipal || ''
      },
      fechaLlegada: this.fechaLlegada,
      fechaSalida: this.fechaSalida,
      huespedes: Number(this.huespedes),
      noches,
      total: this.calcularTotalReserva(),
      nombreHuesped: this.nombreHuesped.trim(),
      correo: this.correoHuesped.trim(),
      estado: 'CONFIRMADA'
    };

    reservas.push(nuevaReserva);
    localStorage.setItem(clave, JSON.stringify(reservas));

    this.nombreHuesped = '';
    this.correoHuesped = '';
    this.fechaLlegada = '';
    this.fechaSalida = '';
    this.huespedes = 1;
    this.mostrarFormularioReserva = false;
    this.mensajeReserva = '';

    this.toastr.success(
      'Tu reserva se ha creado correctamente',
      'Inversiones LR'
    );
  }
}
