import { Component, OnInit } from '@angular/core';
import { CapacityService } from '../../services/capacity.service';

@Component({
  selector: 'app-ver-capacity',
  templateUrl: './ver-capacity.component.html',
  styleUrls: ['./ver-capacity.component.css']
})
export class VerCapacityComponent implements OnInit {

  constructor(public capacityService: CapacityService ) { }

  ngOnInit(): void {
  }

}
