import { Component, OnInit } from '@angular/core';
import { CapacityService } from '../../services/capacity.service';
declare function init_customJS();
import * as moment from 'moment'; //

@Component({
  selector: 'app-ver-capacity',
  templateUrl: './ver-capacity.component.html',
  styleUrls: ['./ver-capacity.component.css']
})
export class VerCapacityComponent implements OnInit {

  fecha1;
  fecha2;
  Mttovalor1 = 2700.00;
  Mttovalor2 = 900.00;
  Mttovalor3 = 0.00;
  Mttovalor4 = 0.00;
  Reservavalor1 = 0;
  Reservavalor2 = 0;
  Ejecucion2 = 0;

  constructor(public capacityService: CapacityService ) {
    init_customJS();
    // numberMas
    // moment.lang('es');
    this.fecha1 = moment().format('MMMM-YY');
    this.fecha2 = moment().add(1, 'months').format('MMMM-YY');



  }

  ngOnInit(): void {
  }

  eliminar(i){
    this.capacityService.jsonDataPlanService.splice(i, 1);
    this.capacityService.totalesDia();
  }

}
