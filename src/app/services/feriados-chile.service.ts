import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeriadosChileService {
  feriados = null;
  constructor(public http: HttpClient) { }

  // Se llama al servicio de feriados mediante JsonP
  obtenerProductos(anno: number, mes: number) {
    const url = `https://apis.digital.gob.cl/fl/feriados/${anno}/${mes}`;
    console.log(url);
    return this.http.jsonp(url, 'callback').pipe(
      map((resp: any) => {
        console.log(resp);
        if(resp.error){
          resp = [];
          // console.log('errror');
        }
        // console.log('reps',resp);
        return resp;
      }));
  }

  //obtiene un arreglo de feriados
  obtenerFeriados() {
    const url = `https://apis.digital.gob.cl/fl/feriados/`;
    return this.http.jsonp(url, 'callback').pipe(
      map((resp: any) => {
        if(resp.error){
          resp = [];
        }

        let feriadosTemp = [];
        resp.forEach(element => {
          feriadosTemp.push(element['fecha']);
        });

        return feriadosTemp;
      }));
  }

  setFeriados(feri: any){
    this.feriados = feri;
  }

  getFeriados(){
    return this.feriados;
  }
}

