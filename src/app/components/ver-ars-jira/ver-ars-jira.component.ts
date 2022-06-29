import { Component, OnInit } from '@angular/core';
import { ArsJiraService } from 'src/app/services/ars-jira.service';

@Component({
  selector: 'app-ver-ars-jira',
  templateUrl: './ver-ars-jira.component.html',
  styleUrls: ['./ver-ars-jira.component.css']
})
export class VerArsJiraComponent implements OnInit {

  constructor(public arsJiraService: ArsJiraService) { }

  ngOnInit(): void {
  }

  generateExcel(){

  }

}
