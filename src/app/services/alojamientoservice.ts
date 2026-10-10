import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlojamientoService {

  constructor(private http: HttpClient) {}

  obtenerAlojamientos() {
    return this.http.get<any>('assets/data/marketplace-data.json');
  }

}
