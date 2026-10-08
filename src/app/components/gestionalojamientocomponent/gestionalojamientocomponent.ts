import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-alojamiento',
  standalone: false,
  templateUrl: './gestionalojamientocomponent.html',
  styleUrls: ['./gestionalojamientocomponent.css'],
})
export class Gestionalojamientocomponent {
  nuevoAlojamiento = {
    nombre: '',
    descripcion: '',
    ciudad: '',
    ubicacion: '',
    tipo: 'Apartamento',
    capacidad: 1,
    habitaciones: 1,
    camas: 1,
    banos: 1,
    precioNoche: 0,
    tarifaLimpieza: 0,
    calificacion: 5.0,
    activo: true,
    imagenPrincipal: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  };

  listaAlojamientos: any[] = [
    {
      id: 1,
      nombre: 'Loft moderno en Chapinero',
      descripcion:
        'Loft moderno ubicado cerca de restaurantes, cafés y zonas comerciales de Bogotá.',
      ciudad: 'Bogotá',
      ubicacion: 'Chapinero, Bogotá',
      tipo: 'Apartamento',
      capacidad: 2,
      habitaciones: 1,
      camas: 1,
      banos: 1,
      precioNoche: 180000,
      tarifaLimpieza: 45000,
      calificacion: 4.8,
      activo: true,
      imagenPrincipal: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    },
    {
      id: 2,
      nombre: 'Apartamento frente al mar',
      descripcion: 'Apartamento con vista al mar ubicado en una zona turística de Cartagena.',
      ciudad: 'Cartagena',
      ubicacion: 'Bocagrande, Cartagena',
      tipo: 'Apartamento',
      capacidad: 5,
      habitaciones: 2,
      camas: 3,
      banos: 2,
      precioNoche: 420000,
      tarifaLimpieza: 70000,
      calificacion: 4.9,
      activo: true,
      imagenPrincipal: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    },
    {
      id: 3,
      nombre: 'Cabaña en Guatapé',
      descripcion: 'Cabaña rodeada de naturaleza con vista al embalse de Guatapé.',
      ciudad: 'Guatapé',
      ubicacion: 'Guatapé, Antioquia',
      tipo: 'Cabaña',
      capacidad: 6,
      habitaciones: 3,
      camas: 4,
      banos: 2,
      precioNoche: 350000,
      tarifaLimpieza: 60000,
      calificacion: 4.7,
      activo: true,
      imagenPrincipal: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    },
    {
      id: 4,
      nombre: 'Casa colonial en Villa de Leyva',
      descripcion: 'Casa de estilo colonial localizada cerca de la plaza principal.',
      ciudad: 'Villa de Leyva',
      ubicacion: 'Centro histórico',
      tipo: 'Casa',
      capacidad: 8,
      habitaciones: 4,
      camas: 5,
      banos: 3,
      precioNoche: 520000,
      tarifaLimpieza: 90000,
      calificacion: 4.6,
      activo: true,
      imagenPrincipal: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    },
    {
      id: 5,
      nombre: 'Apartamento ejecutivo Medellín',
      descripcion: 'Apartamento moderno cercano a zonas comerciales y empresariales.',
      ciudad: 'Medellín',
      ubicacion: 'El Poblado, Medellín',
      tipo: 'Apartamento',
      capacidad: 3,
      habitaciones: 1,
      camas: 2,
      banos: 1,
      precioNoche: 230000,
      tarifaLimpieza: 50000,
      calificacion: 4.5,
      activo: true,
      imagenPrincipal: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    },
    {
      id: 6,
      nombre: 'Casa campestre',
      descripcion: 'Casa campestre actualmente fuera de servicio.',
      ciudad: 'Armenia',
      ubicacion: 'Zona rural',
      tipo: 'Casa',
      capacidad: 10,
      habitaciones: 5,
      camas: 7,
      banos: 4,
      precioNoche: 650000,
      tarifaLimpieza: 120000,
      calificacion: 4.4,
      activo: false,
      imagenPrincipal: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    },
  ];

  agregarAlojamiento() {
    if (this.nuevoAlojamiento.nombre.trim() === '') return;

    const nuevoId =
      this.listaAlojamientos.length > 0
        ? Math.max(...this.listaAlojamientos.map((a) => a.id)) + 1
        : 1;

    const alojamientoFinal = {
      id: nuevoId,
      ...this.nuevoAlojamiento,
    };

    this.listaAlojamientos.push(alojamientoFinal);

    // el toaster
    const toastElement = document.getElementById('liveToast');
    if (toastElement) {
      // @ts-ignore
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }

    this.nuevoAlojamiento = {
      nombre: '',
      descripcion: '',
      ciudad: '',
      ubicacion: '',
      tipo: 'Apartamento',
      capacidad: 1,
      habitaciones: 1,
      camas: 1,
      banos: 1,
      precioNoche: 0,
      tarifaLimpieza: 0,
      calificacion: 5.0,
      activo: true,
      imagenPrincipal: '',
    };
  }

  eliminarAlojamiento(index: number) {
    this.listaAlojamientos.splice(index, 1);
  }

  alojamientoSeleccionado: any = null;

  seleccionarParaVer(alojamiento: any) {
    this.alojamientoSeleccionado = alojamiento;
  }

  alojamientoAEditar: any = {
    id: null,
    nombre: '',
    descripcion: '',
    ciudad: '',
    ubicacion: '',
    tipo: 'Apartamento',
    capacidad: 1,
    habitaciones: 1,
    camas: 1,
    banos: 1,
    precioNoche: 0,
    tarifaLimpieza: 0,
    calificacion: 5.0,
    activo: true,
    imagenPrincipal: '',
  };

  seleccionarParaEditar(alojamiento: any) {
    this.alojamientoAEditar = { ...alojamiento };
  }

  guardarEdicion() {
    const index = this.listaAlojamientos.findIndex((a) => a.id === this.alojamientoAEditar.id);
    if (index !== -1) {
      this.listaAlojamientos[index] = { ...this.alojamientoAEditar };
    }
  }
}
