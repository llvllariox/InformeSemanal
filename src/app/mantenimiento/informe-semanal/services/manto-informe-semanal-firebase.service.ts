import { Injectable } from '@angular/core';

import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import Hora from '../interfaces/hora.interface';



@Injectable({
  providedIn: 'root'
})
export class MantoInformeSemanalFirebaseService {
  
  constructor(private firestore: Firestore) { 
  }

  //retorna todas las horas almacenadas comercial
  getHoras(coleccion: string): Observable<Hora[]> {
    let horaRef =  collection(this.firestore, coleccion);
    return collectionData(horaRef, { idField: 'id' }) as Observable<Hora[]>;
  }

  //elimina la hora de la base de datos
  deleteHora(hora: Hora, coleccion: string){
    let horaDocRef = doc(this.firestore, `${coleccion}/${hora.id}`);
    return deleteDoc(horaDocRef);
  }

  addHora(hora: Hora, coleccion: string){
    const horaRef = collection(this.firestore, coleccion);
    return addDoc(horaRef, hora);
  }
}