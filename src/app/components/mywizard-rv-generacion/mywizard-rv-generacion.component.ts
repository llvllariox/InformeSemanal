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
    this.getIndicadoresHoras();
  }

  ngOnInit(): void {
  }

  //obtiene los valores para los indicadores de las solicitudes
  getIndicadoresSolicitudes(){
   
    this.getI1();
    this.getI2();
    this.getI3();
    //horas this.getI4();
    this.getI5();
    this.getI6();
    this.getI7();
  }
  //MTD New Incidents P5-Number (Cantidad de nuevos incidentes recibidos en el mes)
  getI1(){
     let I1 = 0;
     //suma de abiertos y cerrados con fecha incurrida igual al informe 
     this.JsonArraySolAbiertos.forEach(d => {
       let fecha = new Date(d['fechaRecepcion']);
       if(
           fecha.getMonth() == this.fechaInformeDate.getMonth() 
           && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
           ){
         I1++; 
       }
     });
 
     this.JsonArraySolCerrados.forEach(d => {
       let fecha = new Date(d['fechaRecepcion']);
       if(
         fecha.getMonth() == this.fechaInformeDate.getMonth()
         && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
         ){
         I1++; 
       }
     });
     this.mywizardRvFormularioService.campo_I1 = I1.toString();
  }

  //MTD On Hold Incidents P5-Numbe {Cantidad de incidentes detenidos en el mes independiente el mes de ingreso} = SE REFIERE A TICKETS DETENIDOS POR EL CLIENTE O EN ESPERA DE FALTA DE DEFINICION, BRANCH, DATA, ENTRE OTROS 
  getI2(){
    let cant = 0;
    this.JsonArraySolAbiertos.forEach(d => {
      if(String(d['etapa']).includes('detenido') || String(d['etapa']).includes('Detenido')) {
        console.log(d);
        cant++;
      }
    });

    this.mywizardRvFormularioService.campo_I2 =  cant.toString();
  }

  //MTD Resolved Incidents P5-Number {Cantidad de incidentes cerrados en el mes independiente mes de ingreso} = SE REFIERE A TICKETS CERRADOS EN EL MES INDEPENDIENTE EL MES DE INGRESO 
  getI3(){
    this.mywizardRvFormularioService.campo_I3 = this.JsonArraySolCerrados.length.toString();
  }

  //Number of open incidents exceeding resolution SLA-Number {Cantidad de incidentes abiertos que tenemos vencidos respecto al SLA comprometido} = SE REFIERE A LA CANTIDAD DE TICKETS QUE NO FUERON ATENDIDOS EN EL SLA ACORDADO, NO INCLUYE DETENIDOS POR CLIENTE
  getI5(){
    this.mywizardRvFormularioService.campo_I5 = '0';
  }

  //Number of post delivery defects-Number* {Cantidad de defectos o errores que se han reportado de las correcciones implementadas en el mes} = SE REFIERE A REWORK DE SWF EN DESARROLLOS PUESTOS EN PRODUCCIÓN DE INCIDENTES INFORMADOS POR PRODUCCIÓN 
  getI6(){
    let I6 = 0;

    this.JsonArraySolAbiertos.forEach(d => {
      if(d['rework'] == 'SI'){
        I6++; 
      }
    });

    this.JsonArraySolCerrados.forEach(d => {
      if(d['rework'] == 'SI'){
        I6++; 
      }
    });

    this.mywizardRvFormularioService.campo_I6 = I6.toString();
  }

  //MTD Total SLA-Number* {PI1: Cumplimiento de Plazo en Resolución de Incidencia, PI2: Cumplimiento en Tiempo de Respuesta Telefónica} 
  getI7(){
    this.mywizardRvFormularioService.campo_I7 = '0';
  }


  //obtiene los valores para los indicadores de los requerimientos
  getIndicadoresRequerimientos(){
    this.getR1();
    this.getR2();
    this.getR3();
    //horas this.getR4();
    this.getR5();
    this.getR6();
    this.getR7();
  }

  //MTD New Problems P5-Number (Cantidad de nuevos Problemas recibidos en el mes)
  getR1(){
    let R1 = 0;
    //suma de abiertos y cerrados con fecha incurrida igual al informe 
    this.JsonArrayReqAbiertos.forEach(d => {
      let fecha = new Date(d['fechaRecepcion']);
      if(
        fecha.getMonth() == this.fechaInformeDate.getMonth()
        && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
        ){
        R1++; 
      }
    });

    this.JsonArrayReqCerrados.forEach(d => {
      let fecha = new Date(d['fechaRecepcion']);
      if(
        fecha.getMonth() == this.fechaInformeDate.getMonth()
        && fecha.getFullYear() == this.fechaInformeDate.getFullYear()
        ){
        R1++; 
      }
    });
    this.mywizardRvFormularioService.campo_R1 = R1.toString();
  }

  // MTD On Hold Problems P5-Numbe {Cantidad de Problemas detenidos en el mes independiente el mes de ingreso} = SE REFIERE A TICKETS DETENIDOS POR EL CLIENTE O EN ESPERA DE FALTA DE DEFINICION, BRANCH, DATA, ENTRE OTROS 
  getR2(){
    let cant = 0;
    this.JsonArrayReqAbiertos.forEach(d => {
      if((String(d['etapa']).includes('detenido') || String(d['etapa']).includes('Detenido'))) {
        cant++;
      }
    });

    this.mywizardRvFormularioService.campo_R2 =  cant.toString();
  }

  //MTD Resolved Problems P5-Number {Cantidad de Problemas cerrados en el mes independiente el mes de ingreso} = SE REFIERE A TICKETS CERRADOS EN EL MES INDEPENDIENTE EL MES DE INGRESO
  getR3(){
    this.mywizardRvFormularioService.campo_R3 = this.JsonArrayReqCerrados.length.toString();
  }

  //Number of open Problems exceeding resolution SLA-Number {Cantidad de Problemas abiertos que tenemos vencidos respecto al SLA comprometido} = SE REFIERE A LA CANTIDAD DE TICKETS QUE NO FUERON ATENDIDOS EN EL SLA ACORDADO, NO INCLUYE DETENIDOS POR CLIENTE 
  getR5() {
    this.mywizardRvFormularioService.campo_R5 = '0';
  }

  //Number of post delivery defects-Number* {Cantidad de defectos o errores que se han reportado de las correcciones implementadas en el mes} = SE REFIERE A REWORK DE SWF EN DESARROLLOS PUESTOS EN PRODUCCIÓN DE PROBLEMAS INFORMADOS POR PRODUCCIÓN
  getR6(){
    let R6 = 0;

    this.JsonArrayReqAbiertos.forEach(d => {
      if(d['rework'] == 'SI'){
        R6++; 
      }
    });

    this.JsonArrayReqCerrados.forEach(d => {
      if(d['rework'] == 'SI'){
        R6++; 
      }
    });

    this.mywizardRvFormularioService.campo_R6 = R6.toString();
  }

  //MTD Total SLA-Number* {PI1: Cumplimiento de Plazo en Resolución de Incidencia, PI2: Cumplimiento en Tiempo de Respuesta Telefónica}
  getR7(){
    this.mywizardRvFormularioService.campo_R7 = '0';
  }

  //get obtiene la suma de las horas para I4 y R4
  getIndicadoresHoras(){
    let sumaSol = 0;
    let sumaReq = 0;
  
    this.JsonArrayHoras.forEach(d => {
      if(d['lineaDeServicio'] == 'Problemas') {
        sumaReq += Number(d['horas']);
      } else if(d['lineaDeServicio'] == 'Incidentes') {
        sumaSol += Number(d['horas']);
      }
    });

    this.mywizardRvFormularioService.campo_I4 = sumaSol.toString();
    this.mywizardRvFormularioService.campo_R4 = sumaReq.toString();
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
    variables['campo_I7'] = this.mywizardRvFormularioService.campo_I7;

    variables['campo_R1'] = this.mywizardRvFormularioService.campo_R1;
    variables['campo_R2'] = this.mywizardRvFormularioService.campo_R2;
    variables['campo_R3'] = this.mywizardRvFormularioService.campo_R3;
    variables['campo_R4'] = this.mywizardRvFormularioService.campo_R4;
    variables['campo_R5'] = this.mywizardRvFormularioService.campo_R5;
    variables['campo_R6'] = this.mywizardRvFormularioService.campo_R6;
    variables['campo_R7'] = this.mywizardRvFormularioService.campo_R7;

    this.sweetAlerService.mensajeEsperar2().then(resp=>{
      this.pdfService.generaPDF(variables, this.fechaInformeDate).then(resp => {
        this.sweetAlerService.mensajeOK('PDF Generado Exitosamente');
      });
    });
  }
}