import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { SlaJsonDataService } from 'src/app/services/sla-json-data.service';
import { ActivatedRoute } from '@angular/router';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { SlaJspdfService } from '../../services/sla-jspdf.service';
import { FeriadosChileService } from '../../services/feriados-chile.service';
import { SlaFormularioService } from '../../services/sla-formulario.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-sla-generar',
  templateUrl: './sla-generar.component.html'
})
export class SlaGenerarComponent implements OnInit {
  //formulario: FormGroup;

  jsonArrayReq = [];
  jsonArraySol = [];

  jsonArrayPE1 = [];
  jsonArrayPE2 = [];
  jsonArrayPE3 = [];
  jsonArrayPE6 = [];

  jsonArrayPM1 = [];
  jsonArrayPM2 = [];

  jsonArrayPI1 = [];
  jsonArrayPI2 = [];

  arrayVaciosMantenimiento = [];
  arrayVaciosProyecto = [];

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  fechaInformeDate;

  private feriados = [];

  constructor(public slaFormularioService: SlaFormularioService, public jsonDataService: SlaJsonDataService, private route: ActivatedRoute, public pdfService: SlaJspdfService, private sweetAlerService: SweetAlertService, private feriadosService: FeriadosChileService) {
    this.feriados = feriadosService.getFeriados(); 
    this.fechaInformeDate = new Date(jsonDataService.getFechaInforme() + '-05');
  
    if(this.jsonDataService.jsonDataReqService !== undefined) {
      this.jsonArrayReq = this.jsonDataService.getJsonDataReqService();
      this.getPE1();
      this.getPE2();
      this.getPE3();
      this.getPE6();
    
      this.llenarFormulario('PE1', this.jsonArrayPE1);
      this.llenarFormulario('PE2', this.jsonArrayPE2);
      this.llenarFormulario('PE3', this.jsonArrayPE3);
      this.llenarFormulario('PE6', this.jsonArrayPE6);

      this.getPM1();
      this.getPM2();

      this.llenarFormulario('PM1', this.jsonArrayPM1);
      this.llenarFormulario('PM2', this.jsonArrayPM2);

      this.getVacios();
    }

    if(this.jsonDataService.jsonDataSolService !== undefined) {
      this.jsonArraySol = this.jsonDataService.getJsonDataSolService();

      this.getPI1();
      this.getPI2();

      this.llenarFormulario('PI1', this.jsonArrayPI1);
      this.llenarFormulario('PI2', this.jsonArrayPI2);
    }
  }

  ngOnInit(): void {
    this.mostrarFlechas();
  }

  /*
    Filtrar Contrato = Evolutivo
    Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor

    Revisar Fecha Recepción = MES del informe
    Validar Fecha Recepción VS Fec. Real Estimación <= 5 días hábiles,
    Se informa el total Liberar filtros
  */
  getPE1(){
    let fechaRecepcion;
    let fecRealEstimacion;

    this.jsonArrayReq.forEach(valor => {   
      fechaRecepcion = new Date(valor['fechaRecepcion']);
      fecRealEstimacion = new Date(valor['fecRealEstimacion']);

      if(
          valor['contrato'] == 'Evolutivo'
          &&
          (valor['lineaDeServicio']=='Evolutivo Mayor' || valor['lineaDeServicio']=='Evolutivo Menor')
          &&
          !(
            this.validarFechaVaciaRegla(fechaRecepcion.toString()) 
            ||
            this.validarFechaVaciaRegla(fecRealEstimacion.toString())
          )
          &&
          (
            fechaRecepcion.getFullYear() == this.fechaInformeDate.getFullYear()
            &&
            fechaRecepcion.getMonth() == this.fechaInformeDate.getMonth()
          )
      ){
        //Validar Fecha Recepción VS Fec. Real Estimación <= 5 días hábiles
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

        for(let i=fechaIni; i<fechaFin; i.setDate(i.getDate()+1)){
          if(this.esHabil(i)){
            contador++;
          }
        }

        let noCumple = 0;
        //cumple
        if(contador <= 5){    
          noCumple = 0;
        } else {
          noCumple = 1;
        }

        let nuevo = [];
        nuevo['nroReq'] = valor['nroReq'];
        nuevo['noCumple'] = noCumple;
        nuevo['contrato'] = valor['contrato'];
        nuevo['lineaDeServicio'] = valor['lineaDeServicio'];
        nuevo['fechaRecepcion'] = valor['fechaRecepcion'];
        nuevo['fecRealEstimacion'] = valor['fecRealEstimacion'];
        
        this.jsonArrayPE1.push(nuevo);
      }
    });

    this.jsonArrayPE1.forEach(element => {
      //console.log(element.nroReq + ' - ' + element.noCumple);
    });
  }

  /*
    Filtrar Contrato = Evolutivo
    Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
    Validar Fec. Real Pase Aprobación = Mes en curso 
    VS Fec. Plan. Pase Aprobación, deben ser iguales
  */
  getPE2(){
    let fecRealPaseAprobacion;
    let fecPlanPaseAprobacion;

    this.jsonArrayReq.forEach(valor => {   
      fecRealPaseAprobacion = new Date(valor['fecRealPaseAprobacion']);
      fecPlanPaseAprobacion = new Date(valor['fecPlanPaseAprobacion']);

      if(
        valor['contrato'] == 'Evolutivo'
        &&
        (valor['lineaDeServicio']=='Evolutivo Mayor' || valor['lineaDeServicio']=='Evolutivo Menor')
        &&
        !(
          this.validarFechaVaciaRegla(fecRealPaseAprobacion.toString()) 
          ||
          this.validarFechaVaciaRegla(fecPlanPaseAprobacion.toString())
        )
        &&
        (
          fecRealPaseAprobacion.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fecRealPaseAprobacion.getMonth() == this.fechaInformeDate.getMonth() 
          &&
          fecPlanPaseAprobacion.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fecPlanPaseAprobacion.getMonth() == this.fechaInformeDate.getMonth() 
        )
      ){
        //iguales
        fecRealPaseAprobacion.setHours(0,0,0,0);
        fecPlanPaseAprobacion.setHours(0,0,0,0);

        let noCumple = 0;
        if(fecRealPaseAprobacion.getTime() == fecPlanPaseAprobacion.getTime()){
          noCumple = 0;
        } else {
          noCumple = 1;
        }

        let nuevo = [];
        nuevo['nroReq'] = valor['nroReq'];
        nuevo['noCumple'] = noCumple;
        nuevo['contrato'] = valor['contrato'];
        nuevo['lineaDeServicio'] = valor['lineaDeServicio'];
        nuevo['fecRealPaseAprobacion'] = valor['fecRealPaseAprobacion'];
        nuevo['fecPlanPaseAprobacion'] = valor['fecPlanPaseAprobacion'];

        this.jsonArrayPE2.push(nuevo); 
      }
    });
  }

  /*
    Filtrar Contrato = Evolutivo
    Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
    Filtrar Estado = Finalizado 
    Validar Fec Real Fin = mes en curso
    Validar Horas Estimadas => Horas Incurridas, Se informa el total
  */
  getPE3(){
    let fecRealFin;
    
    this.jsonArrayReq.forEach(valor => {
      fecRealFin = new Date(valor['fecRealFin']);

      if(
        valor['contrato'] == 'Evolutivo'
        &&
        (valor['lineaDeServicio']=='Evolutivo Mayor' || valor['lineaDeServicio']=='Evolutivo Menor')
        &&
        valor.estado == '02 Finalizado'
        &&
        !this.validarFechaVaciaRegla(fecRealFin.toString())
        &&
        (
          fecRealFin.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fecRealFin.getMonth() == this.fechaInformeDate.getMonth()
        )
        &&
        (valor.horasEstimadas && valor.horasIncurridas)        
      ){
        let noCumple = 0;
        //Horas Estimadas => Horas Incurridas
        if(valor.horasEstimadas >= valor.horasIncurridas){
          noCumple = 0;
        } else {
          noCumple = 1;
        }

        let nuevo = [];
        nuevo['nroReq'] = valor['nroReq'];
        nuevo['noCumple'] = noCumple;
        nuevo['contrato'] = valor['contrato'];
        nuevo['lineaDeServicio'] = valor['lineaDeServicio'];
        nuevo['estado'] = valor['estado'];
        nuevo['fecRealFin'] = valor['fecRealFin'];
        nuevo['horasEstimadas'] = valor['horasEstimadas'];
        nuevo['horasIncurridas'] = valor['horasIncurridas'];
        
        this.jsonArrayPE3.push(nuevo);
      }     
    });
  }

  /*
    Filtrar Contrato = Evolutivo
    Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
    Validar Fec. Real Pase Producción = Mes en curso VS
      Fec. Plan. Pase Producción, deben ser iguales
  */
  getPE6(){
    let fecRealPaseProduccion;
    let fecPlanPaseProduccion;

    this.jsonArrayReq.forEach(valor => {   
      fecRealPaseProduccion = new Date(valor['fecRealPaseProduccion']);
      fecPlanPaseProduccion = new Date(valor['fecPlanPaseProduccion']);

      if(
        valor['contrato'] == 'Evolutivo'
        &&
        (valor['lineaDeServicio']=='Evolutivo Mayor' || valor['lineaDeServicio']=='Evolutivo Menor')
        &&
        !(
          this.validarFechaVaciaRegla(fecRealPaseProduccion.toString()) 
          ||
          this.validarFechaVaciaRegla(fecPlanPaseProduccion.toString())
        )
        &&
        (
          fecRealPaseProduccion.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fecRealPaseProduccion.getMonth() == this.fechaInformeDate.getMonth()
          &&
          fecPlanPaseProduccion.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fecPlanPaseProduccion.getMonth() == this.fechaInformeDate.getMonth() 
        )    
      ){
         //Fec. Real Pase Producción VS Fec. Plan. Pase Producción, deben ser iguales
         fecRealPaseProduccion.setHours(0,0,0,0);
         fecPlanPaseProduccion.setHours(0,0,0,0);

         let noCumple = 0;
         if(fecRealPaseProduccion.getTime() == fecPlanPaseProduccion.getTime()){
           noCumple = 0;
         } else {
           noCumple = 1;
         }

         let nuevo = [];
         nuevo['nroReq'] = valor['nroReq'];
         nuevo['noCumple'] = noCumple;
         nuevo['contrato'] = valor['contrato'];
         nuevo['lineaDeServicio'] = valor['lineaDeServicio'];
         nuevo['fecRealPaseProduccion'] = valor['fecRealPaseProduccion'];
         nuevo['fecPlanPaseProduccion'] = valor['fecPlanPaseProduccion'];

          this.jsonArrayPE6.push(nuevo);
      }
    });

    this.jsonArrayPE6.forEach(element => {
      //console.log(element.nroReq + ' - ' + element.noCumple);
    });
  }

  /*
    Fitrar Contrato = Mantenimiento
    Fitrar Línea de Servicio = Problemas
    Revisar Fecha Recepción MES = MES del informe
    Revisar Fec. Real Estimación
    o	Si tiene 1/1/1900, se debe solicitar corregir ARS
    Revisar Fec. Real Inicio
    o	Si tiene 1/1/1900, se debe solicitar corregir ARS
    
    PM1: Cumplimiento de Plazo de Respuesta Estimación: 
    se cuentan la cantidad de días desde Fecha Recepción 
    hasta Fec.Real Estimación <= 11 días.
  */
  getPM1(){
    let fechaRecepcion;
    let fecRealEstimacion;
    let fecRealInicio;

    this.jsonArrayReq.forEach(valor => {   
      fechaRecepcion = new Date(valor['fechaRecepcion']);
      fecRealEstimacion = new Date(valor['fecRealEstimacion']);
      fecRealInicio = new Date(valor['fecRealInicio']);

      if(
        valor['contrato'] == 'Mantenimiento'
        &&
        valor['lineaDeServicio']=='Problemas'
        &&
        !(
          this.validarFechaVaciaRegla(fechaRecepcion.toString()) 
          ||
          this.validarFechaVaciaRegla(fecRealEstimacion.toString())
          ||
          this.validarFechaVaciaRegla(fecRealInicio.toString())
        )
        &&
        (
          fechaRecepcion.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fechaRecepcion.getMonth() == this.fechaInformeDate.getMonth()
        )    
      ){
         let contador = 0;

         for(let i=fechaRecepcion; i<fecRealEstimacion; i.setDate(i.getDate()+1)){
          if(this.esHabil(i)){
            contador++;
          }
        }

        //cumple
        let noCumple = 0;
        if(contador <= 11){    
          noCumple = 0;
        } else {
          noCumple = 1;
        }

        let nuevo = [];
        nuevo['nroReq'] = valor['nroReq'];
        nuevo['noCumple'] = noCumple;
        nuevo['contrato'] = valor['contrato'];
        nuevo['lineaDeServicio'] = valor['lineaDeServicio'];
        nuevo['fechaRecepcion'] = valor['fechaRecepcion'];
        nuevo['fecRealEstimacion'] = valor['fecRealEstimacion'];

        this.jsonArrayPM1.push(nuevo);
      }
    });
  }

  /*
    Fitrar Contrato = Mantenimiento
    Fitrar Línea de Servicio = Problemas
    Revisar Fecha Recepción MES = MES del informe
    Revisar Fec. Real Estimación
    o	Si tiene 1/1/1900, se debe solicitar corregir ARS
    Revisar Fec. Real Inicio
    o	Si tiene 1/1/1900, se debe solicitar corregir ARS
    
    PM2: Cumplimiento de Plazo de Entrega de Planificación 
    Fec. Real Inicio vs Fec.Real Estimación <= 2 días.
  */
  getPM2(){
    let fechaRecepcion;
    let fecRealEstimacion;
    let fecRealInicio;

    this.jsonArrayReq.forEach(valor => {   
      fechaRecepcion = new Date(valor['fechaRecepcion']);
      fecRealEstimacion = new Date(valor['fecRealEstimacion']);
      fecRealInicio = new Date(valor['fecRealInicio']);

      if(
        valor['contrato'] == 'Mantenimiento'
        &&
        valor['lineaDeServicio']=='Problemas'
        &&
        !(
          this.validarFechaVaciaRegla(fechaRecepcion.toString()) 
          ||
          this.validarFechaVaciaRegla(fecRealEstimacion.toString())
          ||
          this.validarFechaVaciaRegla(fecRealInicio.toString())
        )
        &&
        (
          fechaRecepcion.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fechaRecepcion.getMonth() == this.fechaInformeDate.getMonth()
        )    
      ){
         let contador = 0;

         for(let i=fecRealInicio; i<fecRealEstimacion; i.setDate(i.getDate()+1)){
          if(this.esHabil(i)){
            contador++;
          }
        }

        //cumple
        let noCumple = 0;
        if(contador <= 2){    
          noCumple = 0;
        } else {
          noCumple = 1;
        }

        let nuevo = [];
        nuevo['nroReq'] = valor['nroReq'];
        nuevo['noCumple'] = noCumple;
        nuevo['contrato'] = valor['contrato'];
        nuevo['lineaDeServicio'] = valor['lineaDeServicio'];
        nuevo['fecRealInicio'] = valor['fecRealInicio'];
        nuevo['fecRealEstimacion'] = valor['fecRealEstimacion'];

        this.jsonArrayPM2.push(nuevo);
      }
    });
  }

  /*
    Revisar Fecha Recepción MES = MES del informe
    PI1: Cumplimiento de Plazo en Resolución de Incidencia, se cuentan y se informa
  */
  getPI1(){
    let fechaRecepcion;

    this.jsonArraySol.forEach(valor => {   
      fechaRecepcion = new Date(valor['fechaRecepcion']);
 
      if(
        !(
          this.validarFechaVaciaRegla(fechaRecepcion.toString()) 
        )
        &&
        (
          fechaRecepcion.getFullYear() == this.fechaInformeDate.getFullYear()
          &&
          fechaRecepcion.getMonth() == this.fechaInformeDate.getMonth()
        )    
      ){
          let nuevo = [];
          nuevo['nroSol'] = valor['nroSol'];
          nuevo['noCumple'] = 0; //todos cumplen
          nuevo['contrato'] = valor['contrato'];
          nuevo['bloque'] = valor['bloque'];
          nuevo['fechaRecepcion'] = valor['fechaRecepcion'];
          
          this.jsonArrayPI1.push(nuevo);
      }
    });
  }

  /*
    Revisar Fecha Recepción MES = MES del informe
    PI2: Cumplimiento en Tiempo de Respuesta Telefónica, se repite el numero anterior
  */
  getPI2(){
    this.jsonArrayPI2 = this.jsonArrayPI1;
  }
  
  /*
    llena los arreglos arrayVaciosMantenimiento y arrayVaciosProyecto
    con todos los campos que tengan fecha por defecto
  */
  getVacios(){
    let agregar = [];
    let campos = '';
    let revisar = [];
    revisar.push('fecRealEstimacion');
    revisar.push('fecRealInicio');
    revisar.push('fecPlanPaseAprobacion');
    revisar.push('fecRealPaseAprobacion');
    revisar.push('fecRealFin');
    revisar.push('fecPlanPaseProduccion');
    revisar.push('fecRealPaseProduccion');

    this.jsonArrayReq.forEach(element => {
      //PROYECTO
      if(
          element['contrato'] == 'Evolutivo'
          &&
          (
            element['lineaDeServicio']=='Evolutivo Mayor' 
            ||
            element['lineaDeServicio']=='Evolutivo Menor'
          )
      ){
        campos = '';
        revisar.forEach(campo => {
          if(this.validarFechaVaciaRegla(element[campo].toString()) ){
            campos += ', ' + campo;
          }
        });

        agregar = [];
        if(campos.length > 0){
          agregar['nroReq'] = element['nroReq'];
          agregar['responsable'] = element['responsable'];
          agregar['campos'] = campos.substring(2);

          this.arrayVaciosProyecto.push(agregar);
        }
      }

      //MANTENIMIENTO
      else if(
        element['contrato'] == 'Mantenimiento'
        &&
        element['lineaDeServicio']=='Problemas' 
      ){
        campos = '';
        revisar.forEach(campo => {
          if(this.validarFechaVaciaRegla(element[campo].toString()) ){
            campos += ', ' + campo;
          }
        });

        agregar = [];
        if(campos.length > 0){
          agregar['nroReq'] = element['nroReq'];
          agregar['responsable'] = element['responsable'];
          agregar['campos'] = campos.substring(2);

          this.arrayVaciosMantenimiento.push(agregar);
        }
      }
    });
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
 
      let cantidadOk = Number(this.slaFormularioService['campo_' + tabla + '_cantidadOk']);
      let cantidadNoOk = Number(this.slaFormularioService['campo_' + tabla + '_cantidadNoOk']);

      this.slaFormularioService['campo_' + tabla + '_cantidad'] = String(cantidadOk + cantidadNoOk);

      if((cantidadOk + cantidadNoOk) == 0){
        this.slaFormularioService['campo_' + tabla + '_SLA'] = String('0.00');  
      } else {
        this.slaFormularioService['campo_' + tabla + '_SLA'] = String(((cantidadOk*100)/(cantidadOk + cantidadNoOk)).toFixed(2));
      }

      this.mostrarFlechas();
 
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

//revisa la regla de fecha por defecto
validarFechaVaciaRegla(fecha: String){
  if(fecha == 'Sun Dec 31 1899 00:00:00 GMT-0442 (hora de verano de Chile)'
    ||
    fecha.includes('Dec 31 1899')
    ||
    fecha.includes('Jan 1 1900')
  ){
    return true;
  } else return false;
 }

 //revisa las cantidades y le agrega una flecha si están bajo el mínimo
 mostrarFlechas(){
  let min = 10;
  let flagMin = false;
  
  let indicadores = ['PE1', 'PE2', 'PE3', 'PE6', 'PM1', 'PM2', 'PI1', 'PI2'];
  indicadores.forEach(function(element){
    if(Number(this.slaFormularioService['campo_' + element + '_cantidad']) < min){
      document.getElementById('flecha_' + element).style.display = "table-cell";
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

 //genera el excel con ARS a corregir
 generateCorregirExcel(){
  let workbook = new Workbook();

  let worksheet1 = workbook.addWorksheet('Corregir ARS proyecto');
  if(this.arrayVaciosProyecto.length>0){

    // Se establecen anchos de las columnas
    worksheet1.getColumn(1).width = 16;
    worksheet1.getColumn(2).width = 30;
    worksheet1.getColumn(3).width = 180;

    const headerProyecto = [
      'Número REQ',
      'Responsable',
      'Campos'
    ];

    let headerProyectoRow = worksheet1.addRow(headerProyecto);

    // Cell Style : Fill and Border
    headerProyectoRow.eachCell((cell, number) => {
      cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ff4f81bd' },
          bgColor: { argb: '	ff4f81bd' },
      };
    
      cell.border = { 
        top: { style: 'thin' }, 
        left: { style: 'thin' }, 
        bottom: { style: 'thin' }, 
        right: { style: 'thin' }
      };
    
      cell.font = {
        color: {argb: 'FFFFFF'},
        bold: true,
        italic: true
      };
  
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });

    headerProyectoRow.height = 40;

    let newRow; 
    this.arrayVaciosProyecto.forEach(element => {
       newRow = [
        element['nroReq'], 
        element['responsable'],
        element['campos']
      ];
      worksheet1.addRow(newRow);  
    });


  } else {
    worksheet1.addRow(['No se encontró data.']); 
  }

  let worksheet2 = workbook.addWorksheet('Corregir ARS mantenimiento');
  if(this.arrayVaciosMantenimiento.length>0){

     // Se establecen anchos de las columnas
     worksheet2.getColumn(1).width = 16;
     worksheet2.getColumn(2).width = 30;
     worksheet2.getColumn(3).width = 180;
 
     const headerMantenimiento = [
       'Número REQ',
       'Responsable',
       'Campos'
     ];
 
     let headerMantenimientoRow = worksheet2.addRow(headerMantenimiento);
 
     // Cell Style : Fill and Border
     headerMantenimientoRow.eachCell((cell, number) => {
       cell.fill = {
           type: 'pattern',
           pattern: 'solid',
           fgColor: { argb: 'ff4f81bd' },
           bgColor: { argb: '	ff4f81bd' },
       };
     
       cell.border = { 
         top: { style: 'thin' }, 
         left: { style: 'thin' }, 
         bottom: { style: 'thin' }, 
         right: { style: 'thin' }
       };
     
       cell.font = {
         color: {argb: 'FFFFFF'},
         bold: true,
         italic: true
       };
   
       cell.alignment = {
         vertical: 'middle',
         horizontal: 'center'
       };
     });
 
     headerMantenimientoRow.height = 40;
 
     let newRow; 
     this.arrayVaciosMantenimiento.forEach(element => {
        newRow = [
         element['nroReq'], 
         element['responsable'],
         element['campos']
       ];
       worksheet2.addRow(newRow);  
     });
  } else {
    worksheet2.addRow(['No se encontró data.']); 
  }

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    let filename = 'Corregir ';
    filename += this.monthNames[this.fechaInformeDate.getMonth()];
    filename += ' ';
    filename +=  this.fechaInformeDate.getFullYear();   
    filename += '.xlsx';

    fs.saveAs(blob, filename);
  });
 }

 //se asignan las variables del formulario
 llenarFormulario(indicador, jsonArray){
  let cantidadOk = 0;
  let cantidadNoOk = 0;
  let sla = 0;
  let cantidad = 0;

  if(jsonArray){
    cantidad = jsonArray.length;

    jsonArray.forEach(element => {
      if(element.noCumple == '1'){
        cantidadNoOk++;
      } else {
        cantidadOk++;
      }
    });
  
    if(cantidad == 0){
      sla = 0;
    } else {
      sla = cantidadOk * 100 / cantidad;
    }
  } else {

  }
  
  this.slaFormularioService['campo_'+indicador+'_cantidad'] = cantidad;
  this.slaFormularioService['campo_'+indicador+'_cantidadOk'] = cantidadOk;
  this.slaFormularioService['campo_'+indicador+'_cantidadNoOk'] = cantidadNoOk;
  this.slaFormularioService['campo_'+indicador+'_SLA'] = sla.toFixed(2);
 }
}