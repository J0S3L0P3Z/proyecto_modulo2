import { Component } from '@angular/core';
import { AlojamientoService } from '../../services/alojamientoservice';

@Component({
  selector: 'app-alojamientos',
  standalone: false,
  styleUrl: './alojamientoscomponent.css',
  templateUrl: './alojamientoscomponent.html',
})
export class Alojamientoscomponent {

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

  constructor(private alojamientoService: AlojamientoService) {
    this.cargarAlojamientos();
  }

  cargarAlojamientos(): void {

    this.alojamientoService.obtenerAlojamientos().subscribe(data => {

      this.alojamientos = data.alojamientos.filter(
        (alojamiento: any) => alojamiento.activo
      );

      this.alojamientosFiltrados = this.alojamientos;

    });

  }

  filtrarAlojamientos(): void {

    let ubicacionBuscada = this.ubicacion.toLowerCase();

    this.alojamientosFiltrados = this.alojamientos.filter(
      (alojamiento: any) => {

        if (
          ubicacionBuscada &&
          !(
            alojamiento.ciudad.toLowerCase().includes(ubicacionBuscada) ||
            alojamiento.ubicacion.toLowerCase().includes(ubicacionBuscada)
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
          alojamiento.capacidad !== Number(this.huespedes)
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

    this.alojamientosFiltrados = this.alojamientos;

  }

}
