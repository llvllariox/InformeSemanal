import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { SlaJsonDataService } from 'src/app/services/sla-json-data.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { SlaJspdfService } from '../../services/sla-jspdf.service';
import { FeriadosChileService } from '../../services/feriados-chile.service';
import { SlaFormularioService } from '../../services/sla-formulario.service';

@Component({
  selector: 'app-sla-generar',
  templateUrl: './sla-generar.component.html'
})
export class SlaGenerarComponent implements OnInit {
  //formulario: FormGroup;
  jsonDataReqInf: any;

  JsonArrayPE1: [] = [];
  JsonArrayPE2: [] = [];
  JsonArrayPE3: [] = [];
  JsonArrayPE6: [] = [];

  JsonArrayPM1: [] = [];
  JsonArrayPM2: [] = [];

  JsonArrayPI1: [] = [];
  JsonArrayPI2: [] = [];

  JsonArrayVaciosMantenimiento = [];
  JsonArrayVaciosProyecto = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fechaInformeDate;

  cantidadPE1;
  cantidadOKPE1;
  cantidadNOOKPE1;
  SLAPE1: Number;

  cantidadPE2;
  cantidadOKPE2;
  cantidadNOOKPE2;
  SLAPE2: Number;

  cantidadPE3;
  cantidadOKPE3;
  cantidadNOOKPE3;
  SLAPE3: Number;

  cantidadPE6;
  cantidadOKPE6;
  cantidadNOOKPE6;
  SLAPE6: Number;

  cantidadPM1;
  cantidadOKPM1;
  cantidadNOOKPM1;
  SLAPM1: Number;

  cantidadPM2;
  cantidadOKPM2;
  cantidadNOOKPM2;
  SLAPM2: Number;

  cantidadPI1;
  cantidadOKPI1;
  cantidadNOOKPI1;
  SLAPI1: Number;

  cantidadPI2;
  cantidadOKPI2;
  cantidadNOOKPI2;
  SLAPI2: Number;

  private feriados = [];

  constructor(public slaFormularioService: SlaFormularioService, public jsonDataService: SlaJsonDataService, private route: ActivatedRoute, public pdfService: SlaJspdfService, private sweetAlerService: SweetAlertService, private feriadosService: FeriadosChileService) {
    this.feriados = feriadosService.getFeriados(); 

    this.fechaInformeDate = new Date(jsonDataService.getFechaInforme());

    this.cantidadPE1 = 0;
    this.cantidadOKPE1 = 0;
    this.cantidadNOOKPE1 = 0;
    this.SLAPE1 = 0;

    this.cantidadPE2 = 0;
    this.cantidadOKPE2 = 0;
    this.cantidadNOOKPE2 = 0;
    this.SLAPE2 = 0;

    this.cantidadPE3 = 0;
    this.cantidadOKPE3 = 0;
    this.cantidadNOOKPE3 = 0;
    this.SLAPE3 = 0;

    this.cantidadPE6 = 0;
    this.cantidadOKPE6 = 0;
    this.cantidadNOOKPE6 = 0;
    this.SLAPE1 = 0;

    this.cantidadPM1 = 0;
    this.cantidadOKPM1 = 0;
    this.cantidadNOOKPM1 = 0;
    this.SLAPM1 = 0;

    this.cantidadPM2 = 0;
    this.cantidadOKPM2 = 0;
    this.cantidadNOOKPM2 = 0;
    this.SLAPM2 = 0;

    this.cantidadPI1 = 0;
    this.cantidadOKPI1 = 0;
    this.cantidadNOOKPI1 = 0;
    this.SLAPI1 = 0;
    
    this.cantidadPI2 = 0;
    this.cantidadOKPI2 = 0;
    this.cantidadNOOKPI2 = 0;
    this.SLAPI2 = 0;

    if(this.jsonDataService.jsonDataReqPE1Service !== undefined) {
      this.JsonArrayPE1 = this.jsonDataService.getJsonDataReqPE1Service();
      this.getPE1();
      this.getVacios('PE1');
    }

    if(this.jsonDataService.jsonDataReqPE2Service !== undefined) {
      this.JsonArrayPE2 = this.jsonDataService.getJsonDataReqPE2Service();
      this.getPE2();
      this.getVacios('PE2');
    }

    if(this.jsonDataService.jsonDataReqPE3Service !== undefined) {
      this.JsonArrayPE3 = this.jsonDataService.getJsonDataReqPE3Service();
      this.getPE3();
      this.getVacios('PE3');
    }

    if(this.jsonDataService.jsonDataReqPE6Service !== undefined) {
      this.JsonArrayPE6 = this.jsonDataService.getJsonDataReqPE6Service();
      this.getPE6();
      this.getVacios('PE6');
    }

    if(this.jsonDataService.jsonDataReqPM1Service !== undefined) {
      this.JsonArrayPM1 = this.jsonDataService.getJsonDataReqPM1Service();
      this.getPM1();
      this.getVacios('PM1');
    }

    if(this.jsonDataService.jsonDataReqPM2Service !== undefined) {
      this.JsonArrayPM2 = this.jsonDataService.getJsonDataReqPM2Service();
      this.getPM2();
      this.getVacios('PM2');
    }

    if(this.jsonDataService.jsonDataReqPI1Service !== undefined) {
      this.JsonArrayPI1 = this.jsonDataService.getJsonDataReqPI1Service();
      this.getPI1();
    }

    if(this.jsonDataService.jsonDataReqPI2Service !== undefined) {
      this.JsonArrayPI2 = this.jsonDataService.getJsonDataReqPI2Service();
      this.getPI2();
    }

    this.slaFormularioService['campo_PE1_cantidad'] = this.cantidadPE1;
    this.slaFormularioService['campo_PE1_cantidadOk'] = this.cantidadOKPE1;
    this.slaFormularioService['campo_PE1_cantidadNoOk'] = this.cantidadNOOKPE1;
    this.slaFormularioService['campo_PE1_SLA'] = this.SLAPE1.toFixed(1);

    this.slaFormularioService['campo_PE2_cantidad'] = this.cantidadPE2;
    this.slaFormularioService['campo_PE2_cantidadOk'] = this.cantidadOKPE2;
    this.slaFormularioService['campo_PE2_cantidadNoOk'] = this.cantidadNOOKPE2;
    this.slaFormularioService['campo_PE2_SLA'] = this.SLAPE2.toFixed(1);

    this.slaFormularioService['campo_PE3_cantidad'] = this.cantidadPE3;
    this.slaFormularioService['campo_PE3_cantidadOk'] = this.cantidadOKPE3;
    this.slaFormularioService['campo_PE3_cantidadNoOk'] = this.cantidadNOOKPE3;
    this.slaFormularioService['campo_PE3_SLA'] = this.SLAPE3.toFixed(1);

    this.slaFormularioService['campo_PE6_cantidad'] = this.cantidadPE6;
    this.slaFormularioService['campo_PE6_cantidadOk'] = this.cantidadOKPE6;
    this.slaFormularioService['campo_PE6_cantidadNoOk'] = this.cantidadNOOKPE6;
    this.slaFormularioService['campo_PE6_SLA'] = this.SLAPE6.toFixed(1);

    this.slaFormularioService['campo_PM1_cantidad'] = this.cantidadPM1;
    this.slaFormularioService['campo_PM1_cantidadOk'] = this.cantidadOKPM1;
    this.slaFormularioService['campo_PM1_cantidadNoOk'] = this.cantidadNOOKPM1;
    this.slaFormularioService['campo_PM1_SLA'] = this.SLAPM1.toFixed(1);

    this.slaFormularioService['campo_PM2_cantidad'] = this.cantidadPM2;
    this.slaFormularioService['campo_PM2_cantidadOk'] = this.cantidadOKPM2;
    this.slaFormularioService['campo_PM2_cantidadNoOk'] = this.cantidadNOOKPM2;
    this.slaFormularioService['campo_PM2_SLA'] = this.SLAPM2.toFixed(1);

    this.slaFormularioService['campo_PI1_cantidad'] = this.cantidadPI1;
    this.slaFormularioService['campo_PI1_cantidadOk'] = this.cantidadOKPI1;
    this.slaFormularioService['campo_PI1_cantidadNoOk'] = this.cantidadNOOKPI1;
    this.slaFormularioService['campo_PI1_SLA'] = this.SLAPI1.toFixed(1);

    this.slaFormularioService['campo_PI2_cantidad'] = this.cantidadPI2;
    this.slaFormularioService['campo_PI2_cantidadOk'] = this.cantidadOKPI2;
    this.slaFormularioService['campo_PI2_cantidadNoOk'] = this.cantidadNOOKPI2;
    this.slaFormularioService['campo_PI2_SLA'] = this.SLAPI2.toFixed(1);
  }

  ngOnInit(): void {
    this.mostrarFlechas();
  }

  // calcula cantidad, ok y nook del indicador
  getPE1(){
    this.cantidadPE1 = this.JsonArrayPE1.length;
    
    //Cumplen los que  Fecha Recepción VS Fec. Real Estimación <= 5 días hábiles
    let cantOk = 0;
    this.JsonArrayPE1.forEach(function(valor, index){
      let fechaRecepcion = new Date(valor['fechaRecepcion']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);

      //vemos si alguna de las fechas es vacia
      if(
          this.validarFechaVaciaRegla(fechaRecepcion.toString()) 
          || this.validarFechaVaciaRegla(fecRealEstimacion.toString())
      ){
        this.JsonArrayPE1[index]['noCumple'] = 1;
        //cantOk++;
      } else {
        let contador = 0;
        let fechaIni;
        let fechaFin;

        fechaRecepcion.setHours(0,0,0,0);
        fecRealEstimacion.setHours(0,0,0,0);
    
        if(fechaRecepcion < fecRealEstimacion){ 
          fechaIni = fechaRecepcion;
          fechaFin = fecRealEstimacion;
        } else {
          fechaIni = fecRealEstimacion;
          fechaFin = fechaRecepcion;
        }
        
        /*
        if(valor['nroReq']=='4392'){
          console.log('hjk');
        } 
        */

        for(let i=fechaIni; i<fechaFin; i.setDate(i.getDate()+1)){
          if(this.esHabil(i)){
            contador++;
          }
        }
      
        //console.log(valor['nroReq'] + ' - ' + contador);

        //cumple
        if(contador <= 5){
          this.JsonArrayPE1[index]['noCumple'] = 0;
          cantOk++;
        } else {
          this.JsonArrayPE1[index]['noCumple'] = 1;
        }
      }
    }, this);
    
    this.cantidadOKPE1 = cantOk;

    this.cantidadNOOKPE1 = this.cantidadPE1 - this.cantidadOKPE1;

    if(this.cantidadPE1 != 0) {
      this.SLAPE1 = (this.cantidadOKPE1 * 100 / this.cantidadPE1);  
    } else {
      this.SLAPE1 = 100;  
    }
  }

  // calcula cantidad, ok y nook del indicador
  getPE2(){
    this.cantidadPE2 = this.JsonArrayPE2.length;

    //Cumplen los que Fec. Real Pase Aprobación <= Fec. Plan. Pase Aprobación.
    let cantOk = 0;
    this.JsonArrayPE2.forEach(function(valor, index){
      let fecRealPaseAprobacion = new Date(valor['fecRealPaseAprobacion']);
      let fecPlanPaseAprobacion = new Date(valor['fecPlanPaseAprobacion']);

      fecRealPaseAprobacion.setHours(0,0,0,0);
      fecPlanPaseAprobacion.setHours(0,0,0,0);

      //cumple
      if(fecRealPaseAprobacion <= fecPlanPaseAprobacion){
        this.JsonArrayPE2[index]['noCumple'] = 0;
        cantOk++;
      }
      else {
        this.JsonArrayPE2[index]['noCumple'] = 1;
      }
    }, this);
    
    this.cantidadOKPE2 = cantOk;

    this.cantidadNOOKPE2 = this.cantidadPE2 - this.cantidadOKPE2;

    if(this.cantidadPE2 != 0) {
      this.SLAPE2 = (this.cantidadOKPE2 * 100 / this.cantidadPE2);  
    } else {
      this.SLAPE2 = 100;  
    }
  }

  // calcula cantidad, ok y nook del indicador
  getPE3(){
    this.cantidadPE3 = this.JsonArrayPE3.length;

    //cumplen las que Horas Incurridas <= Horas Estimadas
    let cantOk = 0;
    this.JsonArrayPE3.forEach(function(valor, index){
      //cumple
      if(valor['horasIncurridas'] <= valor['horasEstimadas']){
        this.JsonArrayPE3[index]['noCumple'] = 0;
        cantOk++;
      } else {
        this.JsonArrayPE3[index]['noCumple'] = 1;
      }
    }, this);
    this.cantidadOKPE3 = cantOk;

    this.cantidadNOOKPE3 = this.cantidadPE3 - this.cantidadOKPE3;

    //SLA
      if(this.cantidadPE3 != 0) {
      this.SLAPE3 = (this.cantidadOKPE3 * 100 / this.cantidadPE3);  
    }
    else {
      this.SLAPE3 = 100;  
    }
  }

  // calcula cantidad, ok y nook del indicador
  getPE6(){
    this.cantidadPE6 = this.JsonArrayPE6.length;

    //Cumplen los que  Fec. Real Pase Producción <=  Fec. Plan. Pase Producción.
    let cantOk = 0;

    this.JsonArrayPE6.forEach(function(valor, index){
      let fecRealPaseProduccion = new Date(valor['fecRealPaseProduccion']);
      let fecPlanPaseProduccion = new Date(valor['fecPlanPaseProduccion']);
      
      fecRealPaseProduccion.setHours(0,0,0,0);
      fecPlanPaseProduccion.setHours(0,0,0,0);

      //vemos si alguna de las fechas es vacia
      if(
        this.validarFechaVaciaRegla(fecRealPaseProduccion.toString()) 
        || this.validarFechaVaciaRegla(fecPlanPaseProduccion.toString())
      ){
        this.JsonArrayPE6[index]['noCumple'] = 1;
        //cantOk++;
      } else {
        //cumple
        if(fecRealPaseProduccion <= fecPlanPaseProduccion){
          this.JsonArrayPE6[index]['noCumple'] = 0;
          cantOk++;
        } else {
          this.JsonArrayPE6[index]['noCumple'] = 1;
        }
      }
    }, this);
    this.cantidadOKPE6 = cantOk;

    this.cantidadNOOKPE6 = this.cantidadPE6 - this.cantidadOKPE6;

    if(this.cantidadPE6 != 0) {
      this.SLAPE6 = (this.cantidadOKPE6 * 100 / this.cantidadPE6);  
    }
    else {
      this.SLAPE6 = 100;  
    }
  }

  // calcula cantidad, ok y nook del indicador
  getPM1(){
    this.cantidadPM1 = this.JsonArrayPM1.length;

    //se cuentan la cantidad de días desde Fecha Recepción 
    //hasta Fec.Real Estimación <= 11 días hábiles.
    let cantOk = 0;

    this.JsonArrayPM1.forEach(function(valor, index){

      //this.JsonArrayPM1[index]['marca']=1;

      let fechaRecepcion = new Date(valor['fechaRecepcion']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);

      fechaRecepcion.setHours(0,0,0,0);
      fecRealEstimacion.setHours(0,0,0,0);

      //vemos si alguna de las fechas es vacia
      if(
        this.validarFechaVaciaRegla(fechaRecepcion.toString()) 
        || this.validarFechaVaciaRegla(fecRealEstimacion.toString())
      ){
        this.JsonArrayPM1[index]['noCumple'] = 1;
        //cantOk++;
      } else {
        let contador = 0;
        let fechaIni;
        let fechaFin;

        if(fechaRecepcion < fecRealEstimacion){ 
          fechaIni = fechaRecepcion;
          fechaFin = fecRealEstimacion;
        } else {
          fechaIni = fecRealEstimacion;
          fechaFin = fechaRecepcion;
        }

        for(let i=fechaIni; i<fechaFin; i.setDate(i.getDate()+1)){
          if(this.esHabil(i)){
            contador++;
          }
        }
        //console.log(valor['nroReq'] + ' - ' + contador);

        //cumple
        if(contador <= 11){
          this.JsonArrayPM1[index]['noCumple']=0;
          cantOk++;
        } else {
          this.JsonArrayPM1[index]['noCumple']=1;
        }
      }
    }, this);
    this.cantidadOKPM1 = cantOk;

    this.cantidadNOOKPM1 = this.cantidadPM1 - this.cantidadOKPM1;

    //SLA
    if(this.cantidadPM1 != 0) {
      this.SLAPM1 = (this.cantidadOKPM1 * 100 / this.cantidadPM1);
    } else {
      this.SLAPM1 = 100;  
    }
  }

  // calcula cantidad, ok y nook del indicador
  getPM2(){
    this.cantidadPM2 = this.JsonArrayPM2.length;

    //Fec. Real Inicio vs Fec.Real Estimación <= 2 días.
    let cantOk = 0;

    this.JsonArrayPM2.forEach(function(valor, index){
      
      //this.JsonArrayPM2[index]['marca']=2;

      let fecRealInicio = new Date(valor['fecRealInicio']);
      let fecRealEstimacion = new Date(valor['fecRealEstimacion']);
      
      fecRealInicio.setHours(0,0,0,0);
      fecRealEstimacion.setHours(0,0,0,0);

      //vemos si alguna de las fechas es vacia
      if(
        this.validarFechaVaciaRegla(fecRealInicio.toString()) 
        || this.validarFechaVaciaRegla(fecRealEstimacion.toString())
      ){
        this.JsonArrayPM2[index]['noCumple'] = 1;
        //cantOk++;
      } else {
        let contador = 0;
        let fechaIni;
        let fechaFin;

        if(fecRealInicio < fecRealEstimacion){ 
          fechaIni = fecRealInicio;
          fechaFin = fecRealEstimacion;
        } else {
          fechaIni = fecRealEstimacion;
          fechaFin = fecRealInicio;
        }

        for(let i=fechaIni; i<fechaFin; i.setDate(i.getDate()+1)){
          if(this.esHabil(i)){
            contador++;
          }
        }

        //console.log(valor['roReq'] + ' - ' + contador);

        //cumple
        if(contador <= 2){
          this.JsonArrayPM1[index]['noCumple']=0;
          cantOk++;
        } else {
          this.JsonArrayPM1[index]['noCumple']=1;
        }
      }
    }, this);
    this.cantidadOKPM2 = cantOk;

    this.cantidadNOOKPM2 = this.cantidadPM2 - this.cantidadOKPM2;

    //SLA
    if(this.cantidadPM2 != 0) {
      this.SLAPM2 = (this.cantidadOKPM2 * 100 / this.cantidadPM2);  
    } else {
      this.SLAPM2 = 100;  
    }
  }

  // calcula cantidad, ok y nook del indicador
  getPI1(){
    //PI1: Cumplimiento de Plazo en Resolución de Incidencia, se cuentan y se informa
    this.cantidadPI1 = this.JsonArrayPI1.length;
    this.cantidadOKPI1 = this.cantidadPI1;
    this.cantidadNOOKPI1 = 0;
    this.SLAPI1 = 100;
  }

  // calcula cantidad, ok y nook del indicador
  getPI2(){
    //se repite PI1
    this.cantidadPI2 = this.cantidadPI1;
    this.cantidadOKPI2 = this.cantidadPI2;
    this.cantidadNOOKPI2 = 0;
    this.SLAPI2 = 100;
  }

  //por cada ARS mira si hay campos vacíos
  getVacios(indicador){
    let contrato = '';
    let arreglo = [];

    if(indicador=='PE1'){
      arreglo = this.JsonArrayPE1;
      contrato = 'proyecto';
    } else if(indicador=='PE2') {
      arreglo = this.JsonArrayPE2;
      contrato = 'proyecto';
    } else if(indicador=='PE3') {
      arreglo = this.JsonArrayPE3;
      contrato = 'proyecto';
    } else if(indicador=='PE6') {
      arreglo = this.JsonArrayPE6;
      contrato = 'proyecto';
    } else if(indicador=='PM1') {
      arreglo = this.JsonArrayPM1;
      contrato = 'mantenimiento';
    } else if(indicador=='PM2') {
      arreglo = this.JsonArrayPM2;
      contrato = 'mantenimiento';
    }

    if(arreglo) {
      arreglo.forEach(function(valor: Array<String>, index){  
        if (this.validarFechaVacia(valor)){
          this.agregarArregloCorregir(
                                        contrato, 
                                        valor['nroReq'], indicador, 
                                        this.getCamposFechaVacia(valor)
                                      );
        }
      }, this);
    }
  }

  //true si la fecha es habil
  esHabil(fecha: Date){
    //ponemos la hora en 0 para poder comparar
    fecha.setHours(0,0,0,0);

    //sábado o domingo
    if(fecha.getDay()===0 || fecha.getDay()===6){
      return false;
    }
  
   for(const feriado of this.feriados){
      let f = new Date(feriado + 'T00:00:00');
      if(f.getTime()==fecha.getTime()){
        return false;
      }
   }
    return true;
  }

  //actualiza los valores de los campos
  cambiarCampo(event, tabla, campo) {
    if(campo=='cantidadOk' || campo=='cantidadNoOk'){
      let cantidadOk = Number(this.slaFormularioService['campo_' + tabla + '_cantidadOk']);
      let cantidadNoOk = Number(this.slaFormularioService['campo_' + tabla + '_cantidadNoOk']);

      this.slaFormularioService['campo_' + tabla + '_cantidad'] = String(cantidadOk + cantidadNoOk);
      this.slaFormularioService['campo_' + tabla + '_SLA'] = String(((cantidadOk*100)/(cantidadOk + cantidadNoOk)).toFixed(1));

      this.mostrarFlechas();
   } 
  }

  //genera un archivo PDF
  generaNuevoPDF(){
    let variables = [];
    variables['cantidadPE1'] = this.slaFormularioService['campo_PE1_cantidad'];
    variables['cantidadOkPE1'] = this.slaFormularioService['campo_PE1_cantidadOk'];
    variables['cantidadNoOkPE1'] = this.slaFormularioService['campo_PE1_cantidadNoOk'];
    variables['SLAPE1'] = this.slaFormularioService['campo_PE1_SLA'];

    variables['cantidadPE2'] = this.slaFormularioService['campo_PE2_cantidad'];
    variables['cantidadOkPE2'] = this.slaFormularioService['campo_PE2_cantidadOk'];
    variables['cantidadNoOkPE2'] = this.slaFormularioService['campo_PE2_cantidadNoOk'];
    variables['SLAPE2'] = this.slaFormularioService['campo_PE2_SLA'];

    variables['cantidadPE3'] = this.slaFormularioService['campo_PE3_cantidad'];
    variables['cantidadOkPE3'] = this.slaFormularioService['campo_PE3_cantidadOk'];
    variables['cantidadNoOkPE3'] = this.slaFormularioService['campo_PE3_cantidadNoOk'];
    variables['SLAPE3'] = this.slaFormularioService['campo_PE3_SLA'];

    variables['cantidadPE6'] = this.slaFormularioService['campo_PE6_cantidad'];
    variables['cantidadOkPE6'] = this.slaFormularioService['campo_PE6_cantidadOk'];
    variables['cantidadNoOkPE6'] = this.slaFormularioService['campo_PE6_cantidadNoOk'];
    variables['SLAPE6'] = this.slaFormularioService['campo_PE6_SLA'];

    variables['cantidadPM1'] = this.slaFormularioService['campo_PM1_cantidad'];
    variables['cantidadOkPM1'] = this.slaFormularioService['campo_PM1_cantidadOk'];
    variables['cantidadNoOkPM1'] = this.slaFormularioService['campo_PM1_cantidadNoOk'];
    variables['SLAPM1'] = this.slaFormularioService['campo_PM1_SLA'];

    variables['cantidadPM2'] = this.slaFormularioService['campo_PM2_cantidad'];
    variables['cantidadOkPM2'] = this.slaFormularioService['campo_PM2_cantidadOk'];
    variables['cantidadNoOkPM2'] = this.slaFormularioService['campo_PM2_cantidadNoOk'];
    variables['SLAPM2'] = this.slaFormularioService['campo_PM2_SLA'];

    variables['cantidadPI1'] = this.slaFormularioService['campo_PI1_cantidad'];
    variables['cantidadOkPI1'] = this.slaFormularioService['campo_PI1_cantidadOk'];
    variables['cantidadNoOkPI1'] = this.slaFormularioService['campo_PI1_cantidadNoOk'];
    variables['SLAPI1'] = this.slaFormularioService['campo_PI1_SLA'];

    variables['cantidadPI2'] = this.slaFormularioService['campo_PI2_cantidad'];
    variables['cantidadOkPI2'] = this.slaFormularioService['campo_PI2_cantidadOk'];
    variables['cantidadNoOkPI2'] = this.slaFormularioService['campo_PI2_cantidadNoOk'];
    variables['SLAPI2'] = this.slaFormularioService['campo_PI2_SLA'];

    this.sweetAlerService.mensajeEsperar2().then(resp=>{
      this.pdfService.generaPDF(variables, this.fechaInformeDate).then(resp => {
        this.sweetAlerService.mensajeOK('PDF Generado Exitosamente');
      });
    });
  }

 //true si la fecha es 1/1/1900 (vacia)
 validarFechaVacia(ars){
  if(
      this.validarFechaVaciaRegla(ars['fecRealEstimacion'].toString())
      || this.validarFechaVaciaRegla(ars['fecRealInicio'].toString())
      || this.validarFechaVaciaRegla(ars['fecPlanPaseAprobacion'].toString())
      || this.validarFechaVaciaRegla(ars['fecRealPaseAprobacion'].toString())
      || this.validarFechaVaciaRegla(ars['fecRealFin'].toString())
      || this.validarFechaVaciaRegla(ars['fecPlanPaseProduccion'].toString())
      || this.validarFechaVaciaRegla(ars['fecRealPaseProduccion'].toString())
  ){
    return true;
  } else {
    return false;
  }
 }

//revisa la regla de fecha por defecto
 validarFechaVaciaRegla(fecha: String){
  if(fecha == 'Sun Dec 31 1899 00:00:00 GMT-0442 (hora de verano de Chile)'
    ||
    fecha.includes('Sun Dec 31 1899')
  ){
    return true;
  } else return false;
 }

 //obtiene un string con los campos que tienen la regla vacia
 getCamposFechaVacia(ars){
  let campos: String = '';
 
  if(this.validarFechaVaciaRegla(ars['fecRealEstimacion'].toString())){
    campos += ', fecRealEstimacion';
  }

  if(this.validarFechaVaciaRegla(ars['fecRealInicio'].toString())){
    campos += ', fecRealInicio';
  }

  if(this.validarFechaVaciaRegla(ars['fecPlanPaseAprobacion'].toString())){
    campos += ', fecPlanPaseAprobacion';
  }

  if(this.validarFechaVaciaRegla(ars['fecRealPaseAprobacion'].toString())){
    campos += ', fecRealPaseAprobacion';
  }

  if(this.validarFechaVaciaRegla(ars['fecRealFin'].toString())){
    campos += ', fecRealFin';
  }

  if(this.validarFechaVaciaRegla(ars['fecPlanPaseProduccion'].toString())){
    campos += ', fecPlanPaseProduccion';
  }

  if(this.validarFechaVaciaRegla(ars['fecRealPaseProduccion'].toString())){
    campos += ', fecRealPaseProduccion';
  }

  if(campos) campos = campos.substring(2);

  return campos;
 }

 //si es nuevo agrega un elemento al arreglo de vacios 
 //en caso contrario lo agrega a la columna indicador
 agregarArregloCorregir(contrato, nroReq, indicadores, campos){
  let ars = [];
  ars['nroReq'] = nroReq.toString();
  ars['indicador'] = indicadores;
  ars['campos'] = campos;

  //this.JsonArrayVaciosMantenimiento.push(ars);
  let flagRepetidoM = 0;
  let flagRepetidoP = 0;
  if(contrato=='mantenimiento'){
    this.JsonArrayVaciosMantenimiento.forEach(function(valor, index){
      if(valor['nroReq'] ==  ars['nroReq']){
        flagRepetidoM = 1;
        this.JsonArrayVaciosMantenimiento[index]['indicador'] = 
        this.JsonArrayVaciosMantenimiento[index]['indicador'] + ', ' + indicadores;
      }
    }, this);

    if(!flagRepetidoM) this.JsonArrayVaciosMantenimiento.push(ars);
  } else if(contrato=='proyecto'){
    this.JsonArrayVaciosProyecto.forEach(function(valor, index){
      if(valor['nroReq'] ==  ars['nroReq']){
        flagRepetidoP = 1;
        this.JsonArrayVaciosProyecto[index]['indicador'] = 
        this.JsonArrayVaciosProyecto[index]['indicador'] + ', ' + indicadores;
      }
    }, this);

    if(!flagRepetidoP) this.JsonArrayVaciosProyecto.push(ars);
  }
 }

 //revisa las cantidades y le agrega una flecha si están bajo el mínimo
 mostrarFlechas(){
  let min = 10;
  let flagMin = false;
  
  let indicadores = ['PE1', 'PE2', 'PE3', 'PE6', 'PM1', 'PM2', 'PI1', 'PI2'];
  indicadores.forEach(function(element){
    if(Number(this.slaFormularioService['campo_' + element + '_cantidad']) < min){
      document.getElementById('flecha_' + element).style.display = "block";
      flagMin = true;
    } else {
      document.getElementById('flecha_' + element).style.display = "none";
    }
  }, this);

  if(flagMin){
    document.getElementById('p_minimo').style.display = "block";
  } else {
    document.getElementById('p_minimo').style.display = "none";
  }
 }
}
