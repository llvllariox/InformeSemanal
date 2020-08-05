import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {HttpClientModule, HttpClientJsonpModule, HttpClient} from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class FeriadosChileService {

  constructor(public http: HttpClient) { }
  // const url = `https://apis.digital.gob.cl/fl/feriados/`;

  obtenerProductos(anno: number, mes: number) {
    const url = `https://apis.digital.gob.cl/fl/feriados/${anno}/${mes}`;
    return this.http.jsonp(url, 'callback').pipe(
      map((resp: any) => {
        console.log(resp);
        return resp;
      }));
  }
}

//   obtenerProductos(anno: number, mes: number) {
//     const url = `https://apis.digital.gob.cl/fl/feriados/${anno}/${mes}`;
//     console.log(url);
//     return this.http.get(url)
    // .pipe(
    //   map((resp: any) => {
    //     console.log(resp);
    //     return resp;
    //   }));
// }

// }


