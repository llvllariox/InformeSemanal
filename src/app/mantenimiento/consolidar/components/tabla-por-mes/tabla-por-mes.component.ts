import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'consolidar-tabla-por-mes',
  templateUrl: './tabla-por-mes.component.html',
  styleUrls: ['./tabla-por-mes.component.css']
})
export class TablaPorMesComponent implements OnInit {

  constructor() { }

  @Input()
  public ars;

  @Input()
  public data;

  @Input()
  public tipo;

  @Input()
  public mes;
  
  ngOnInit(): void {
  }
}
