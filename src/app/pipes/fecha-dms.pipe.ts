import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaDMS'
})
export class FechaDMSPipe implements PipeTransform {

  transform(value: Date): any {
    if (value != null) {
      if (value.toString() == 'Sun Dec 31 1899 00:00:00 GMT-0442 (hora de verano de Chile)' || value.toString().includes('Sun Dec 31 1899')) {
        return '01/01/1900';
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
        return newFecha;
      }
    }
    return '';



  }

}
