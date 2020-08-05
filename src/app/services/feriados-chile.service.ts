import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeriadosChileService {

  constructor(public http: HttpClient) { }
  // const url = `https://apis.digital.gob.cl/fl/feriados/`;

  obtenerProductos(anno: number, mes: number) {
    const url = `https://apis.digital.gob.cl/fl/feriados/${anno}/${mes}`;
    console.log(url);
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log(resp);
        return resp;
      }));
}

}


