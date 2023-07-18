import { Injectable } from '@angular/core';

import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable} from 'rxjs';
import Hora from '../model/hora.interface';
import HoraC from '../model/horaC.interface';



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

  addHoraC(horaC: HoraC){
    const horaRef = collection(this.firestore, 'MantoHorasC');
    return addDoc(horaRef, horaC);
  }

  //retorna todas las horas almacenadas
  getHoras(tipo): Observable<Hora[]> {
    let horaRef = collection(this.firestore, 'MantoHoras');
    return collectionData(horaRef, { idField: 'id' }) as Observable<Hora[]>;
  }

  //retorna todas las horas almacenadas comercial
  getHorasC(): Observable<HoraC[]> {
    let horaRef =  collection(this.firestore, 'MantoHorasC');
    return collectionData(horaRef, { idField: 'id' }) as Observable<HoraC[]>;
  }

  //retorna todas las horas almacenadas
  /*
  getHorasComercial(): Observable<Hora[]> {
    const horaRef = collection(this.firestore, 'MantoHorasC');
    return collectionData(horaRef, { idField: 'id' }) as Observable<Hora[]>;
  }
  */

  //elimina la hora de la base de datos
  deleteHora(hora: Hora){
    let horaDocRef = doc(this.firestore, `MantoHoras/${hora.id}`);    
    return deleteDoc(horaDocRef);
  }

  //elimina la hora de la base de datos
  deleteHoraC(horaC: HoraC){
    let horaDocRef = doc(this.firestore, `MantoHorasC/${horaC.id}`);
    return deleteDoc(horaDocRef);
  }
  
  //actualiza la hora de la base de datos
  updateHoraC(horaC: HoraC, data){
    let horaDocRef = doc(this.firestore, `MantoHorasC/${horaC.id}`);
    return updateDoc(horaDocRef, data);
  }
}