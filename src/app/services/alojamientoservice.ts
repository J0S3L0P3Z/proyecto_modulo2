import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {
  private alojamientosSubject = new BehaviorSubject<any[]>([]);
  alojamientos$ = this.alojamientosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarInicial();
  }

  private cargarInicial(): void {
    const guardados = localStorage.getItem('alojamientos');

    if (guardados !== null) {
      this.alojamientosSubject.next(JSON.parse(guardados));
    } else {
      this.obtenerAlojamientos().subscribe({
        next: data => {
          this.guardarLista(data.alojamientos);
        },
        error: () => {
          console.error('No se pudieron cargar los alojamientos');
        }
      });
    }
  }

  obtenerAlojamientos(): Observable<any> {
    return this.http.get<any>('assets/data/marketplace-data.json');
  }

  obtenerLista(): Observable<any[]> {
    return this.alojamientos$;
  }

  guardarLista(alojamientos: any[]): void {
    localStorage.setItem('alojamientos', JSON.stringify(alojamientos));
    this.alojamientosSubject.next(alojamientos);
  }
}
