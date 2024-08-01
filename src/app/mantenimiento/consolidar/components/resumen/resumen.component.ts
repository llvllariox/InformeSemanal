import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'consolidar-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  constructor() { }

  @Input()
  public data;

  @Input()
  public tipo;

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  ngOnInit(): void {
    //console.log(this.data);
  
  }

}
