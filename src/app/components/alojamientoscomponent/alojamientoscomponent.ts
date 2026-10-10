import { Component, OnInit } from '@angular/core';
import { AlojamientoService } from '../../services/alojamientoservice';

@Component({
  selector: 'app-alojamientos',
  standalone: false,
  styleUrl: './alojamientoscomponent.css',
  templateUrl: './alojamientoscomponent.html',
})
export class Alojamientoscomponent implements OnInit {

  alojamientos: any[] = [];
  alojamientosFiltrados: any[] = [];

  ubicacion: string = '';
  tipoSeleccionado: string = '';
  huespedes: string = '';
  precioMaximo: string = '';

  tipos: string[] = [
    'Apartamento',
    'Casa',
    'Cabaña',
    'Loft',
    'Villa',
    'Finca'
  ];

  constructor(private alojamientoService: AlojamientoService) {}

  ngOnInit(): void {
    this.cargarAlojamientos();
  }

  cargarAlojamientos(): void {
    this.alojamientoService.obtenerLista().subscribe({
      next: data => {
        this.alojamientos = [];

        for (let i = 0; i < data.length; i++) {
          if (data[i].activo) {
            this.alojamientos.push(data[i]);
          }
        }

        this.filtrarAlojamientos();
      }
    });
  }

  filtrarAlojamientos(): void {
    const ubicacionBuscada = this.ubicacion.trim().toLowerCase();

    this.alojamientosFiltrados = this.alojamientos.filter(
      (alojamiento: any) => {

        if (
          ubicacionBuscada &&
          !(
            (alojamiento.ciudad || '').toLowerCase().includes(ubicacionBuscada) ||
            (alojamiento.ubicacion || '').toLowerCase().includes(ubicacionBuscada)
          )
        ) {
          return false;
        }

        if (
          this.tipoSeleccionado &&
          alojamiento.tipo !== this.tipoSeleccionado
        ) {
          return false;
        }

        if (
          this.huespedes &&
          alojamiento.capacidad < Number(this.huespedes)
        ) {
          return false;
        }

        if (
          this.precioMaximo &&
          alojamiento.precioNoche > Number(this.precioMaximo)
        ) {
          return false;
        }

        return true;
      }
    );
  }

  limpiarFiltros(): void {
    this.ubicacion = '';
    this.tipoSeleccionado = '';
    this.huespedes = '';
    this.precioMaximo = '';

    this.filtrarAlojamientos();
  }
}
