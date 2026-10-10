import { Component } from '@angular/core';
import { AlojamientoService } from '../../services/alojamientoservice';
import { ToastrService } from '@openng/ngx-toastr';

interface Alojamiento {
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

@Component({
  selector: 'app-gestion-alojamiento',
  standalone: false,
  templateUrl: './gestionalojamientocomponent.html',
  styleUrl: './gestionalojamientocomponent.css'
})
export class Gestionalojamientocomponent {
  alojamientos: Alojamiento[] = [];
  mostrarFormulario = false;
  modoEdicion = false;
  serviciosTexto = '';
  reglasTexto = '';

  formulario: Alojamiento = this.crearFormularioVacio();

  constructor(
    private alojamientoService: AlojamientoService,
    private toastr: ToastrService
  ) {
    this.cargarAlojamientos();
  }

  cargarAlojamientos(): void {
    this.alojamientoService.obtenerLista().subscribe({
      next: data => {
        this.alojamientos = data;
      }
    });
  }

  crearFormularioVacio(): Alojamiento {
    return {
      id: 0,
      nombre: '',
      descripcion: '',
      ciudad: '',
      ubicacion: '',
      tipo: 'Apartamento',
      capacidad: 2,
      habitaciones: 1,
      camas: 1,
      banos: 1,
      precioNoche: 0,
      tarifaLimpieza: 0,
      calificacion: 5,
      activo: true,
      imagenPrincipal: '',
      imagenes: [],
      servicios: [],
      reglas: []
    };
  }

  guardarEnLocalStorage(): void {
    this.alojamientoService.guardarLista(this.alojamientos);
  }

  abrirFormulario(): void {
    this.modoEdicion = false;
    this.formulario = this.crearFormularioVacio();
    this.serviciosTexto = '';
    this.reglasTexto = '';
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  guardarAlojamiento(): void {
    if (
      this.formulario.nombre.trim() === '' ||
      this.formulario.ciudad.trim() === '' ||
      this.formulario.ubicacion.trim() === '' ||
      this.formulario.precioNoche <= 0 ||
      this.formulario.capacidad < 1 ||
      this.formulario.calificacion < 1 ||
      this.formulario.calificacion > 5
    ) {
      this.toastr.warning('Verifica los datos del alojamiento');
      return;
    }

    const alojamientoGuardado: Alojamiento = {
      id: this.formulario.id,
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion.trim(),
      ciudad: this.formulario.ciudad.trim(),
      ubicacion: this.formulario.ubicacion.trim(),
      tipo: this.formulario.tipo,
      capacidad: Number(this.formulario.capacidad),
      habitaciones: Number(this.formulario.habitaciones),
      camas: Number(this.formulario.camas),
      banos: Number(this.formulario.banos),
      precioNoche: Number(this.formulario.precioNoche),
      tarifaLimpieza: Number(this.formulario.tarifaLimpieza),
      calificacion: Number(this.formulario.calificacion),
      activo: this.formulario.activo,
      imagenPrincipal: this.formulario.imagenPrincipal.trim(),
      imagenes: [],
      servicios: [],
      reglas: []
    };

    const serviciosSeparados = this.serviciosTexto.split(',');
    const reglasSeparadas = this.reglasTexto.split(',');

    for (let i = 0; i < serviciosSeparados.length; i++) {
      const servicio = serviciosSeparados[i].trim();

      if (servicio !== '') {
        alojamientoGuardado.servicios.push(servicio);
      }
    }

    for (let i = 0; i < reglasSeparadas.length; i++) {
      const regla = reglasSeparadas[i].trim();

      if (regla !== '') {
        alojamientoGuardado.reglas.push(regla);
      }
    }

    if (alojamientoGuardado.imagenPrincipal !== '') {
      alojamientoGuardado.imagenes.push(alojamientoGuardado.imagenPrincipal);
    }

    if (this.modoEdicion) {
      let indice = -1;

      for (let i = 0; i < this.alojamientos.length; i++) {
        if (this.alojamientos[i].id === alojamientoGuardado.id) {
          indice = i;
          break;
        }
      }

      if (indice === -1) {
        this.toastr.error('No se encontró el alojamiento');
        return;
      }

      this.alojamientos[indice] = alojamientoGuardado;
      this.toastr.success('Alojamiento actualizado correctamente');
    } else {
      let nuevoId = 1;

      for (let i = 0; i < this.alojamientos.length; i++) {
        if (this.alojamientos[i].id >= nuevoId) {
          nuevoId = this.alojamientos[i].id + 1;
        }
      }

      alojamientoGuardado.id = nuevoId;
      this.alojamientos.push(alojamientoGuardado);
      this.toastr.success('Alojamiento creado correctamente');
    }

    this.guardarEnLocalStorage();
    this.cerrarFormulario();
  }

  editarAlojamiento(alojamiento: Alojamiento): void {
    this.modoEdicion = true;

    this.formulario = {
      id: alojamiento.id,
      nombre: alojamiento.nombre,
      descripcion: alojamiento.descripcion,
      ciudad: alojamiento.ciudad,
      ubicacion: alojamiento.ubicacion,
      tipo: alojamiento.tipo,
      capacidad: alojamiento.capacidad,
      habitaciones: alojamiento.habitaciones,
      camas: alojamiento.camas,
      banos: alojamiento.banos,
      precioNoche: alojamiento.precioNoche,
      tarifaLimpieza: alojamiento.tarifaLimpieza,
      calificacion: alojamiento.calificacion,
      activo: alojamiento.activo,
      imagenPrincipal: alojamiento.imagenPrincipal,
      imagenes: alojamiento.imagenes || [],
      servicios: alojamiento.servicios || [],
      reglas: alojamiento.reglas || []
    };

    this.serviciosTexto = '';
    this.reglasTexto = '';

    for (let i = 0; i < this.formulario.servicios.length; i++) {
      if (i > 0) {
        this.serviciosTexto += ', ';
      }

      this.serviciosTexto += this.formulario.servicios[i];
    }

    for (let i = 0; i < this.formulario.reglas.length; i++) {
      if (i > 0) {
        this.reglasTexto += ', ';
      }

      this.reglasTexto += this.formulario.reglas[i];
    }

    this.mostrarFormulario = true;
  }

  cambiarEstado(alojamiento: Alojamiento): void {
    alojamiento.activo = !alojamiento.activo;
    this.guardarEnLocalStorage();

    if (alojamiento.activo) {
      this.toastr.success('Alojamiento activado');
    } else {
      this.toastr.success('Alojamiento desactivado');
    }
  }

  eliminarAlojamiento(id: number): void {
    if (!confirm('¿Deseas eliminar este alojamiento definitivamente?')) {
      return;
    }

    const alojamientosActualizados: Alojamiento[] = [];

    for (let i = 0; i < this.alojamientos.length; i++) {
      if (this.alojamientos[i].id !== id) {
        alojamientosActualizados.push(this.alojamientos[i]);
      }
    }

    if (alojamientosActualizados.length === this.alojamientos.length) {
      this.toastr.warning('No se encontró el alojamiento');
      return;
    }

    this.alojamientos = alojamientosActualizados;
    this.guardarEnLocalStorage();
    this.toastr.success('Alojamiento eliminado correctamente');
  }
}
