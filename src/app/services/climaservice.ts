import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClimaActual {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

interface RespuestaClima {
  current: ClimaActual;
}

@Injectable({
  providedIn: 'root'
})
export class Climaservice {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  obtenerClima(ciudad: string = 'Bogota'): Observable<RespuestaClima> {
    const coordenadas: { [key: string]: { latitud: number; longitud: number } } = {
      Bogota: { latitud: 4.711, longitud: -74.0721 },
      Medellin: { latitud: 6.2442, longitud: -75.5812 },
      Cartagena: { latitud: 10.391, longitud: -75.4794 },
      Cali: { latitud: 3.4516, longitud: -76.532 },
      'Santa Marta': { latitud: 11.2408, longitud: -74.199 }
    };

    const ubicacion = coordenadas[ciudad] || coordenadas['Bogota'];

    const url = `${this.apiUrl}?latitude=${ubicacion.latitud}&longitude=${ubicacion.longitud}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=America%2FBogota`;

    return this.http.get<RespuestaClima>(url);
  }
}
