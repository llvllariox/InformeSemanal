import { Component, OnInit } from '@angular/core';
import { CapacityService } from '../../services/capacity.service';
declare function init_customJS();


@Component({
  selector: 'app-ver-capacity',
  templateUrl: './ver-capacity.component.html',
  styleUrls: ['./ver-capacity.component.css']
})
export class VerCapacityComponent implements OnInit {

  constructor(public capacityService: CapacityService ) {
    init_customJS();
  }

  ngOnInit(): void {
  }

  eliminar(i){
    this.capacityService.jsonDataPlanService.splice(i, 1);
    this.capacityService.totalesDia();
  }

}
