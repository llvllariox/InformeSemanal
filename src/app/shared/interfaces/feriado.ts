export interface Feriado {
    nombre:        string;
    comentarios:   null | string;
    fecha:         Date;
    irrenunciable: string;
    tipo:          Tipo;
    leyes?:        Leye[];
}

export interface Leye {
    nombre: string;
    url:    string;
}

export enum Tipo {
    Civil = "Civil",
    Religioso = "Religioso",
}