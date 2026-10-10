import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlojamientoService } from '../../services/alojamientoservice';

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

  constructor(
    private route: ActivatedRoute,
    private alojamientoService: AlojamientoService
  ) {}

  ngOnInit(): void {
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

  cargarResenas(id: number): void {
    this.alojamientoService.obtenerAlojamientos().subscribe({
      next: data => {
        const resenasJson = (data.resenas || []).filter(
          (resena: any) => Number(resena.alojamientoId) === id
        );

        let resenasGuardadas: any[] = [];

        try {
          resenasGuardadas = JSON.parse(
            localStorage.getItem('resenas') || '[]'
          );
        } catch {
          resenasGuardadas = [];
        }

        const resenasLocales = resenasGuardadas.filter(
          (resena: any) => Number(resena.alojamientoId) === id
        );

        this.resenas = [...resenasJson, ...resenasLocales];
      },
      error: () => {
        let resenasGuardadas: any[] = [];

        try {
          resenasGuardadas = JSON.parse(
            localStorage.getItem('resenas') || '[]'
          );
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
      return;
    }

    if (this.calificacionResena < 1 || this.calificacionResena > 5) {
      this.mensajeResena = 'Selecciona una calificación entre 1 y 5.';
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
      resenasGuardadas = JSON.parse(
        localStorage.getItem('resenas') || '[]'
      );
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
  }
}
