import { Component, OnInit } from '@angular/core';
import { DmsJsonDataService } from '../../services/dms-json-data.service';
import { element } from 'protractor';
import { DataMessagePayload } from 'firebase-admin/lib/messaging/messaging-api';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarFechasDMSCompararComponent implements OnInit {
  jsonArrayDmsA: [] = [];
  jsonArrayDmsB: [] = [];

  jsonArrayDmsDiferencias = [];

  constructor(
    public jsonDataService: DmsJsonDataService, 
  ) { 

    if(
        this.jsonDataService.jsonDataDmsAService !== undefined
        &&
        this.jsonDataService.jsonDataDmsBService !== undefined
      ) {
        this.jsonArrayDmsA = this.jsonDataService.getJsonDataDmsAService();
        this.jsonArrayDmsB = this.jsonDataService.getJsonDataDmsBService();

        this.diferencias();
      }
  }

  ngOnInit(): void {
  }

  //obtiene las diferencias entre jsonArrayDmsA y jsonArrayDmsB
  diferencias(): void {
    let flag = false;

    //de A a B
    this.jsonArrayDmsA.forEach(elementA => {
      flag = false;
      this.jsonArrayDmsB.forEach(elementB => {
        if(this.comparacion(elementA, elementB)) {
          flag = true;
        }
      });

      if(flag == false) {
        this.jsonArrayDmsDiferencias.push(elementA);
        flag = false;
      }
    });


    //de B a A
    this.jsonArrayDmsB.forEach(elementB => {
      this.jsonArrayDmsA.forEach(elementA => {
        if(this.comparacion(elementA, elementB)) {
          flag = true;
        }
      });

      if(!flag) {
        this.jsonArrayDmsDiferencias.push(elementB);
        flag = false;
      }
    });


    
    console.log(this.jsonArrayDmsDiferencias);
  }


  comparacion(elementA, elementB) {
    let inicioPlanificadoA = new Date(elementA['inicioPlanificado']).getTime();
    let inicioPlanificadoB = new Date(elementB['inicioPlanificado']).getTime();

    let inicioRealA = new Date(elementA['inicioReal']).getTime();
    let inicioRealB = new Date(elementB['inicioReal']).getTime();

    let finComprometidoA = new Date(elementA['finComprometido']).getTime();
    let finComprometidoB = new Date(elementB['finComprometido']).getTime();

    let finPlanificadoA = new Date(elementA['finPlanificado']).getTime();
    let finPlanificadoB = new Date(elementB['finPlanificado']).getTime();

    let finRealA = new Date(elementA['finReal']).getTime();
    let finRealB = new Date(elementB['finReal']).getTime();

    if(
      elementA['responsable'] == elementB['responsable']
      &&
      elementA['contrato'] == elementB['contrato']
      &&
      elementA['ars'] == elementB['ars']
      &&
      elementA['lineaDeServicio'] == elementB['lineaDeServicio']
      &&
      elementA['tarea'] == elementB['tarea']
      &&
      elementA['horasEstimadas'] == elementB['horasEstimadas']
      &&
      elementA['horasPlanificadas'] == elementB['horasPlanificadas']
      &&
      elementA['horasIncurridas'] == elementB['horasIncurridas']
      &&
      elementA['etc'] == elementB['etc']
      &&
      inicioPlanificadoA == inicioPlanificadoB
      &&
      inicioRealA == inicioRealB
      &&
      finComprometidoA == finComprometidoB
      &&
      finPlanificadoA == finPlanificadoB
      &&
      finRealA == finRealB
      &&
      elementA['grupoDeTrabajo'] == elementB['grupoDeTrabajo']
    ) {
      return true;
    } else return false;
  }
}
