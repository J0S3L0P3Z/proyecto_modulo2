import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TasasMoneda {
  result: string;
  base_code: string;
  rates: {
    COP: number;
    USD: number;
    EUR: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MonedaserviceService {
  private apiUrl = 'https://open.er-api.com/v6/latest/USD';

  constructor(private http: HttpClient) {}

  obtenerTasas(): Observable<TasasMoneda> {
    return this.http.get<TasasMoneda>(this.apiUrl).pipe(
      map(respuesta => {
        if (respuesta.result !== 'success') {
          throw new Error('No se pudieron obtener las tasas de cambio');
        }

        return respuesta;
      })
    );
  }

  convertirDesdeCOP(
    precioCOP: number,
    moneda: 'COP' | 'USD' | 'EUR',
    tasas: TasasMoneda
  ): number {
    if (moneda === 'COP') {
      return precioCOP;
    }

    const precioUSD = precioCOP / tasas.rates.COP;

    if (moneda === 'USD') {
      return precioUSD;
    }

    return precioUSD * tasas.rates.EUR;
  }
}
