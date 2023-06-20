import { Injectable } from '@angular/core';

import { Firestore, collection, collectionData, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import Hora from '../model/hora.interface';



@Injectable({
  providedIn: 'root'
})
export class MantoInformeSemanalFirebaseService {
  
  constructor(private firestore: Firestore) { 
  }

  addHora(hora: Hora){
    const horaRef = collection(this.firestore, 'MantoHoras');
    return addDoc(horaRef, hora);
  }

  //retorna todas las horas almacenadas
  getHoras(): Observable<Hora[]> {
    const horaRef = collection(this.firestore, 'MantoHoras');
    console.log("serv gethoras");
    return collectionData(horaRef, { idField: 'id' }) as Observable<Hora[]>;
  }

  //elimina la hora de la base de datos
  deleteHora(hora: Hora){
    const horaDocRef = doc(this.firestore, `MantoHoras/${hora.id}`);
    console.log("servicio");
    console.log(horaDocRef);

    return deleteDoc(horaDocRef);
  }
}