import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feriado } from '../interfaces/feriado';

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

        return feriadosTemp.reverse();
      }));
  }

  setFeriados(feri: any){
    this.feriados = feri;
  }

  getFeriados(){
    return this.feriados;
  }

  //obtiene los feriados de un mes especifico
  getFeriadosMes(month: number, year: number): Observable<Feriado[]> {
    /* const url = 'https://apis.digital.gob.cl/fl/feriados/'  + year + '/' + month;
    return this.http.get<Feriado[]>(url); */

    const url = 'https://apis.digital.gob.cl/fl/feriados/'  + year + '/' + month;
    return this.http.jsonp(url, 'callback').pipe(
      map((resp: any) => {
        if(resp.error){
          resp = [];
        }

        let feriadosTemp = [];
        resp.forEach(element => {
          feriadosTemp.push(element['fecha']);
        });

        return feriadosTemp.reverse();
      }));
  }

  

  getFeriadosMesNuevo(): Observable<Feriado[]> {

    return Observable.create(observer => {
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    
     fetch('https://api.boostr.cl/holidays.json', options)
    .then(res => res.json())
    .then(res => {
     //console.log(res.data)
      let feriadosTemp = [];
      res.data.forEach(element => {
        feriadosTemp.push(element['date']);
      });
      //console.log(feriadosTemp.reverse())
      observer.next(feriadosTemp.reverse());
        /*Complete the Observable as it won't produce any more event */
        observer.complete();
     // return feriadosTemp.reverse();
     })
    .catch(err => observer.error(err))

      }
    )}

  
}

