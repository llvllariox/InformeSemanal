import { Component, OnInit } from '@angular/core';
import { MywizardRvJsonDataService } from 'src/app/services/mywizard-rv-json-data.service';
import { MywizardRvFormularioService } from '../../services/mywizard-rv-formulario.service';
import { MywizardRvJspdfService } from '../../services/mywizard-rv-jspdf.service';
import { SweetAlertService } from '../../services/sweet-alert.service';


@Component({
  selector: 'app-mywizard-rv-generacion',
  templateUrl: './mywizard-rv-generacion.component.html'
})
export class MywizardRvGeneracionComponent implements OnInit {

  JsonArrayReqAbiertos: [];
  JsonArrayReqCerrados: [];
  JsonArraySolAbiertos: [];
  JsonArraySolCerrados: [];
  JsonArrayHoras: [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  fechaInformeDate: Date;

  constructor(
            public mywizardRvFormularioService: MywizardRvFormularioService, 
            public mywizardRvJsonDataService: MywizardRvJsonDataService, 
            public pdfService: MywizardRvJspdfService, 
            private sweetAlerService: SweetAlertService) { 

    this.fechaInformeDate = new Date(mywizardRvJsonDataService.getFechaInforme() + '-05');

    if(this.mywizardRvJsonDataService.jsonDataReqAbiertosService !== undefined) {
      this.JsonArrayReqAbiertos = this.mywizardRvJsonDataService.getJsonDataReqAbiertosService();
    }

    if(this.mywizardRvJsonDataService.jsonDataReqCerradosService !== undefined) {
      this.JsonArrayReqCerrados = this.mywizardRvJsonDataService.getJsonDataReqCerradosService();
    }

    if(this.mywizardRvJsonDataService.jsonDataSolAbiertosService !== undefined) {
      this.JsonArraySolAbiertos = this.mywizardRvJsonDataService.getJsonDataSolAbiertosService();
    }

    if(this.mywizardRvJsonDataService.jsonDataSolCerradosService !== undefined) {
      this.JsonArraySolCerrados = this.mywizardRvJsonDataService.getJsonDataSolCerradosService();
    }

    if(this.mywizardRvJsonDataService.jsonDataHorasService !== undefined) {
      this.JsonArrayHoras = this.mywizardRvJsonDataService.getJsonDataHorasService();
    }

    this.getIndicadoresSolicitudes();
    this.getIndicadoresRequerimientos();
  }

  ngOnInit(): void {
  }

  //obtiene los valores para los indicadores de las solicitudes
  getIndicadoresSolicitudes(){
    this.getI1();
    this.getI2();
    this.getI3();
    this.getI4();
    this.getI5();
    this.getI6();
  }

  //MTD Cancelled Incidents P5-Number = 0
  getI1(){
    this.mywizardRvFormularioService.campo_I1 = '0';
  }

  //MTD New Incidents P5-Number (Cantidad de nuevos incidentes recibidos en el mes)
  getI2(){
     let I2 = 0;
     //suma de abiertos y cerrados con fecha incurrida igual al informe 
     this.JsonArraySolAbiertos.forEach(d => {
       let fecha = new Date(d['fechaRecepcion']);
       if(
           fecha.getMonth() == this.fechaInformeDate.getMonth() 
           && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
           ){
         I2++; 
       }
     });
 
     this.JsonArraySolCerrados.forEach(d => {
       let fecha = new Date(d['fechaRecepcion']);
       if(
         fecha.getMonth() == this.fechaInformeDate.getMonth()
         && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
         ){
         I2++; 
       }
     });
     this.mywizardRvFormularioService.campo_I2 = I2.toString();
  }

  //MTD On Hold Incidents P5-Numbe {Cantidad de incidentes detenidos en el mes independiente el mes de ingreso} = SE REFIERE A TICKETS DETENIDOS POR EL CLIENTE O EN ESPERA DE FALTA DE DEFINICION, BRANCH, DATA, ENTRE OTROS 
  getI3(){
    let cant = 0;
    this.JsonArraySolAbiertos.forEach(d => {
      if(String(d['etapa']).includes('detenido') || String(d['etapa']).includes('Detenido')) {
        console.log(d);
        cant++;
      }
    });

    this.mywizardRvFormularioService.campo_I3 =  cant.toString();
  }

  //MTD Resolved Incidents P5-Number {Cantidad de incidentes cerrados en el mes independiente mes de ingreso} = SE REFIERE A TICKETS CERRADOS EN EL MES INDEPENDIENTE EL MES DE INGRESO 
  getI4(){
    this.mywizardRvFormularioService.campo_I4 = this.JsonArraySolCerrados.length.toString();
  }

  //MTD Total Effort Spent on Incidents P5-Hours
  getI5(){
    let sumaSol = 0;
    let sumaReq = 0;
  
    this.JsonArrayHoras.forEach(d => {
      if(d['lineaDeServicio'] == 'Problemas') {
        sumaReq += Number(d['horas']);
      } else if(d['lineaDeServicio'] == 'Incidentes') {
        sumaSol += Number(d['horas']);
      }
    });

    this.mywizardRvFormularioService.campo_I5 = sumaSol.toString();
  }
  
  //Number of open incidents exceeding resolution SLA-Number {Cantidad de incidentes abiertos que tenemos vencidos respecto al SLA comprometido} = SE REFIERE A LA CANTIDAD DE TICKETS QUE NO FUERON ATENDIDOS EN EL SLA ACORDADO, NO INCLUYE DETENIDOS POR CLIENTE
  getI6(){
    this.mywizardRvFormularioService.campo_I6 = '0';
  }

  //obtiene los valores para los indicadores de los requerimientos
  getIndicadoresRequerimientos(){
    this.getR1();
    this.getR2();
    this.getR3();
    this.getR4();
    this.getR5();
    this.getR6();
  }

  //MTD Cancelled Problem Requests P5-Number = 0
  getR1() {
    this.mywizardRvFormularioService.campo_R1 = '0';
  }

  //MTD New Problems P5-Number (Cantidad de nuevos Problemas recibidos en el mes)
  getR2(){
    let R2 = 0;
    //suma de abiertos y cerrados con fecha incurrida igual al informe 
    this.JsonArrayReqAbiertos.forEach(d => {
      let fecha = new Date(d['fechaRecepcion']);
      if(
        fecha.getMonth() == this.fechaInformeDate.getMonth()
        && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
        ){
        R2++;
      }
    });

    this.JsonArrayReqCerrados.forEach(d => {
      let fecha = new Date(d['fechaRecepcion']);
      if(
        fecha.getMonth() == this.fechaInformeDate.getMonth()
        && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
        ){
        R2++; 
      }
    });

    this.mywizardRvFormularioService.campo_R2 = R2.toString();
  }

  // MTD On Hold Problems P5-Numbe {Cantidad de Problemas detenidos en el mes independiente el mes de ingreso} = SE REFIERE A TICKETS DETENIDOS POR EL CLIENTE O EN ESPERA DE FALTA DE DEFINICION, BRANCH, DATA, ENTRE OTROS 
  getR3(){
    let cant = 0;
    this.JsonArrayReqAbiertos.forEach(d => {
      if((String(d['etapa']).includes('detenido') || String(d['etapa']).includes('Detenido'))) {
        cant++;
      }
    });

    this.mywizardRvFormularioService.campo_R3 =  cant.toString();
  }

  //MTD Resolved Problems P5-Number {Cantidad de Problemas cerrados en el mes independiente el mes de ingreso} = SE REFIERE A TICKETS CERRADOS EN EL MES INDEPENDIENTE EL MES DE INGRESO
  getR4(){
    this.mywizardRvFormularioService.campo_R4 = this.JsonArrayReqCerrados.length.toString();
  }

  //MTD Total Effort Spent on Problem Requests P5-Hours
  getR5(){
    let sumaReq = 0;

    this.JsonArrayHoras.forEach(d => {
      if(d['lineaDeServicio'] == 'Problemas') {
        sumaReq += Number(d['horas']);
      }
    });

    this.mywizardRvFormularioService.campo_R5 = sumaReq.toString();
  }   

  //Number of open Problems exceeding resolution SLA-Number {Cantidad de Problemas abiertos que tenemos vencidos respecto al SLA comprometido} = SE REFIERE A LA CANTIDAD DE TICKETS QUE NO FUERON ATENDIDOS EN EL SLA ACORDADO, NO INCLUYE DETENIDOS POR CLIENTE 
  getR6() {
    this.mywizardRvFormularioService.campo_R6 = '0';
  }

  //obtiene los valores para los indicadores de SERVICE DELIVERY
  getIndicadoresServiceDelivery(){
    this.getS1();
    this.getS2();
  }

  //MTD Number of post delivery defects-Number
  getS1(){
    let S1 = 0;

    this.JsonArraySolAbiertos.forEach(d => {
      if(d['rework'] == 'SI'){
        S1++; 
      }
    });

    this.JsonArraySolCerrados.forEach(d => {
      if(d['rework'] == 'SI'){
        S1++; 
      }
    });

    this.JsonArrayReqAbiertos.forEach(d => {
      if(d['rework'] == 'SI'){
        S1++; 
      }
    });

    this.JsonArrayReqCerrados.forEach(d => {
      if(d['rework'] == 'SI'){
        S1++; 
      }
    });

    this.mywizardRvFormularioService.campo_S1 = S1.toString();
  }

  //MTD Total SLA-Number
  getS2(){
    this.mywizardRvFormularioService.campo_S2 = '0';
  }

  //actualiza los valores de los campos
  cambiarCampo(event, campo) {
    let cantidadOk = Number();
    this.mywizardRvFormularioService[campo] = this.mywizardRvFormularioService[campo];
  }

  //genera un archivo PDF
  generaNuevoPDF() {
    let variables = [];
    variables['campo_I1'] = this.mywizardRvFormularioService.campo_I1;
    variables['campo_I2'] = this.mywizardRvFormularioService.campo_I2;
    variables['campo_I3'] = this.mywizardRvFormularioService.campo_I3;
    variables['campo_I4'] = this.mywizardRvFormularioService.campo_I4;
    variables['campo_I5'] = this.mywizardRvFormularioService.campo_I5;
    variables['campo_I6'] = this.mywizardRvFormularioService.campo_I6;

    variables['campo_R1'] = this.mywizardRvFormularioService.campo_R1;
    variables['campo_R2'] = this.mywizardRvFormularioService.campo_R2;
    variables['campo_R3'] = this.mywizardRvFormularioService.campo_R3;
    variables['campo_R4'] = this.mywizardRvFormularioService.campo_R4;
    variables['campo_R5'] = this.mywizardRvFormularioService.campo_R5;
    variables['campo_R6'] = this.mywizardRvFormularioService.campo_R6;

    variables['campo_S1'] = this.mywizardRvFormularioService.campo_S1;
    variables['campo_S2'] = this.mywizardRvFormularioService.campo_S2;

    this.sweetAlerService.mensajeEsperar2().then(resp=>{
      this.pdfService.generaPDF(variables, this.fechaInformeDate).then(resp => {
        this.sweetAlerService.mensajeOK('PDF Generado Exitosamente');
      });
    });
  }
}