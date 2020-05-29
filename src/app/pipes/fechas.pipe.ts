import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechas'
})
export class FechasPipe implements PipeTransform {

  transform(value: Date): any {
    // console.log(value);
    if (value != null) {
      if (value.toString() == 'Sun Dec 31 1899 00:00:00 GMT-0442 (hora de verano de Chile)') {
          return 'TBD';
      } else {

        const fecha = new Date(value);
        const ANO = fecha.getFullYear();
        const MES = fecha.getMonth();
        const DIA = fecha.getDate();
        let newFecha = '';
        if (MES < 9) {
           newFecha = `${DIA}/0${MES + 1}/${ANO}`;
        } else {
          newFecha = `${DIA}/${MES + 1}/${ANO}`;

        }
        // fecha.getFullYear();
        // console.log(ANO);
        // console.log(MES);
        // console.log(DIA);
        // console.log('aca---------------------');
        // console.log(newFecha);
        return newFecha;
      }
    }
    return 'TBD';
  }
}
