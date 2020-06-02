import { Component, OnInit } from '@angular/core';
import { JsonDataService } from 'src/app/services/json-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {

  // mostrarSegmentos = false;
  constructor(public jsonDataService: JsonDataService) {

    // tslint:disable-next-line: max-line-length

   }

  ngOnInit(): void {
  }

}
