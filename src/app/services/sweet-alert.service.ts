import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  mensajeError(titulo: string , texto: string) {

    Swal.fire({
      allowOutsideClick: false,
      title: titulo,
      text: texto,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
      });

  }

  mensajeOK(texto: string) {
    Swal.close();
    return Swal.fire({
      allowOutsideClick: false,
      text: texto,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
  });
}

  mensajeEsperar() {

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading();

  }

  mensajeConfirmacion(titulo: string , texto: string ) {
    return  Swal.fire({
      title: titulo,
      text: texto,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    });
  }

  close(){
    Swal.close();
  }
}
