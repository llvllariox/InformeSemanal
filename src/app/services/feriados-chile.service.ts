import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeriadosChileService {

  constructor(public http: HttpClient) { }

  // Se llama al servicio de feriados mediante JsonP
  obtenerProductos(anno: number, mes: number) {
    const url = `https://apis.digital.gob.cl/fl/feriados/${anno}/${mes}`;
    console.log(url);
    return this.http.jsonp(url, 'callback').pipe(
      map((resp: any) => {
        return resp;
      }));
  }
}

