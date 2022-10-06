import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { SlaJsonDataService } from 'src/app/services/sla-json-data.service';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { Router } from '@angular/router';
import { FeriadosChileService } from '../../services/feriados-chile.service';

@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html'
})
export class SlaComponent implements OnInit {
  formulario: FormGroup;
  jsonDataReq = null;
  nuevosHeaders = [];
  estadoReq = 1;
  fechaInforme;
  fechaMin;
  fechaMax;
  feriados = null;

  constructor(private formBuilder: FormBuilder, private jsonDataService: SlaJsonDataService, private sweetAlerService: SweetAlertService, private router: Router, private feriadosService: FeriadosChileService) {  
    
      this.crearFormulario();
  
      let hoy = new Date();
      const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
      this.fechaMin = '2015-01';
      this.fechaMax = currentDate;
      this.formulario.controls['fecha'].setValue(currentDate);  

      this.jsonDataService.setFechaInforme(this.formulario.value.fecha);
      this.fechaInforme = new Date(jsonDataService.getFechaInforme() + '-05');
      
      // Se obtienen los feriados
      this.feriadosService.obtenerFeriados().subscribe(resp => {
           this.feriados = resp;
      }, err => {
          this.feriados = null;
          this.sweetAlerService.mensajeError('Error al obtener Feriados', err.og.message);
      });
  }

  ngOnInit(): void {
  }

  click(archivo){
    this.formulario.controls.requerimientos.reset();
    this.estadoReq = 4;
  }

  //si hay archivo se borra y se pide cargar de nuevo
  cambiarFecha(event) {
    //si no ha subido archivo
    this.fechaInforme = new Date(this.formulario.value.fecha + "-05");
  
    if(this.formulario.value.requerimientos){
      this.formulario.controls.requerimientos.reset();
      this.estadoReq = 4;
    }
  }

  //transforma la data a JSON
  uploadReq(event) {
    if(!this.validarTipo(event)){
      this.estadoReq = 4;
      return;
    }

    this.jsonDataReq = null;
    this.estadoReq = 2;
    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });
      if (workBook.SheetNames[0] !== 'Requerimientos'){
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
        this.estadoReq = 4;
        this.jsonDataReq = null;
        return;
      }
      this.jsonDataReq = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        this.formularioHeaders(sheet, 'AO1');
        initial[name] = XLSX.utils.sheet_to_json(sheet);

        this.estadoReq = 3;
        return initial;
      }, {});
    
      if (this.jsonDataReq.Requerimientos === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        this.estadoReq = 4;
        this.jsonDataReq = null;
      } else {
        let tmp = this.jsonDataReq.Requerimientos;
        
        //PROYECTO
        this.filtrarReqPE1(tmp);
        this.filtrarReqPE2(tmp);
        this.filtrarReqPE3(tmp);
        this.filtrarReqPE6(tmp);

        //MANTENIMIENTO
        this.filtrarReqPM1(tmp);
        this.filtrarReqPM2(tmp);    
        
        this.filtrarReqPI1(tmp);
        //this.filtrarReqPI2(tmp);
      }
    };
    reader.readAsBinaryString(file);    
 }

   formularioHeaders(sheet, limit){
    function camalize(str) {
        str = str.replace(/\./g, '');
        str = str.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }

    let abc = ['A1',	'B1',	'C1',	'D1',	'E1',	'F1',	'G1',	'H1',	'I1',	'J1',	'K1',	'L1',
              'M1',	'N1',	'O1',	'P1',	'Q1',	'R1',	'S1',	'T1',	'U1',	'V1',	'W1',	'X1',
              'Y1',	'Z1',	'AA1',	'AB1',	'AC1',	'AD1',	'AE1',	'AF1',	'AG1', 'AH1',
              'AI1',	'AJ1',	'AK1',	'AL1',	'AM1',	'AN1',	'AO1', 'AP1',	'AQ1', 'AR1',
              'AS1',	'AT1',	'AU1',	'AV1',	'AW1',	'AX1',	'AY1',	'AZ1',	'BA1',	'BB1',
              'BC1',	'BD1',	'BE1',	'BF1',	'BG1',	'BH1',
             ];

    for (const letra of abc) {
      sheet[letra].w = camalize(sheet[letra].w);

      if (letra == limit){
        break;
      }
    }
 }

 /*
	Filtrar Contrato = Evolutivo
	Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
	Filtra Fecha Recepción = MES del informe (por pantalla) 
 */
  filtrarReqPE1(jsonDataReqArray: any) {
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.contrato === 'Evolutivo';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Evolutivo Menor';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
        return (a.fechaRecepcion.getMonth() === this.fechaInforme.getMonth()
              && a.fechaRecepcion.getFullYear() === this.fechaInforme.getFullYear());
    });

        //definimos un arreglo temporal para hacer unicos los objetos
        let Jsontemporal = [];
        jsonDataReqArray.forEach(element => {
          let tmp = this.agregarJson(element);
          Jsontemporal.push(tmp);
        });
    
        this.jsonDataService.setjsonDataReqPE1Service(Jsontemporal);
  }


 /*
  Filtrar Contrato = Evolutivo
	Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
	Filtrar Fec. Real Pase Aprobación = Mes en curso(por pantalla)
  */
  filtrarReqPE2(jsonDataReqArray: any) {
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.contrato === 'Evolutivo';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Evolutivo Menor';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (a.fecRealPaseAprobacion.getMonth() === this.fechaInforme.getMonth()
            && a.fecRealPaseAprobacion.getFullYear() === this.fechaInforme.getFullYear());
    });
  
    //definimos un arreglo temporal para hacer unicos los objetos
    let Jsontemporal = [];
    jsonDataReqArray.forEach(element => {
      let tmp = this.agregarJson(element);
      Jsontemporal.push(tmp);
    });

    this.jsonDataService.setjsonDataReqPE2Service(Jsontemporal);
 }

  /*
    Filtrar Contrato = Evolutivo
    Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
    Filtrar Estado = Finalizado 
    Filtrar Fec Real Fin = mes en curso (por pantalla)
  */
 filtrarReqPE3(jsonDataReqArray: any) {


  jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.contrato === 'Evolutivo';
    });
  
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Evolutivo Menor';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.estado === '02 Finalizado';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (a.fecRealFin.getMonth() === this.fechaInforme.getMonth()
            && a.fecRealFin.getFullYear() === this.fechaInforme.getFullYear());
    });

    //definimos un arreglo temporal para hacer unicos los objetos
    let Jsontemporal = [];
    jsonDataReqArray.forEach(element => {
      let tmp = this.agregarJson(element);
      Jsontemporal.push(tmp);
    });

    this.jsonDataService.setJsonDataReqPE3Service(Jsontemporal);
 }

   /*
    Filtrar Contrato = Evolutivo
    Fitrar Línea de Servicio = Evolutivo Mayor y Evolutivo Menor
    Filtrar Fec. Real Pase Producción = Mes en curso
  */
 filtrarReqPE6(jsonDataReqArray: any) {
  jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.contrato === 'Evolutivo';
    });
  
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.lineaDeServicio === 'Evolutivo Mayor' || a.lineaDeServicio === 'Evolutivo Menor';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (a.fecRealPaseProduccion.getMonth() === this.fechaInforme.getMonth()
            && a.fecRealPaseProduccion.getFullYear() === this.fechaInforme.getFullYear());
    });

    //definimos un arreglo temporal para hacer unicos los objetos
    let Jsontemporal = [];
    jsonDataReqArray.forEach(element => {
      let tmp = this.agregarJson(element);
      Jsontemporal.push(tmp);
    });
  
    this.jsonDataService.setJsonDataReqPE6Service(Jsontemporal);
 }

 /*
  Fitrar Contrato = Mantenimiento
	Fitrar Línea de Servicio = Problemas
	Filtrar Fecha Recepción MES = MES del informe
 */
 filtrarReqPM1(jsonDataReqArray: any) {
  jsonDataReqArray = jsonDataReqArray.filter(a => {
    return a.contrato === 'Mantenimiento';
  });

  jsonDataReqArray = jsonDataReqArray.filter(a => {
    return a.lineaDeServicio === 'Problemas';
  });

  jsonDataReqArray = jsonDataReqArray.filter(a => {
    return (a.fechaRecepcion.getMonth() === this.fechaInforme.getMonth()
          && a.fechaRecepcion.getFullYear() === this.fechaInforme.getFullYear());
  });
 
  //definimos un arreglo temporal para hacer unicos los objetos
  let Jsontemporal = [];
  jsonDataReqArray.forEach(element => {
    let tmp = this.agregarJson(element);
    Jsontemporal.push(tmp);
  });

  this.jsonDataService.setJsonDataReqPM1Service(Jsontemporal);
 }

  /*
  Fitrar Contrato = Mantenimiento
	Fitrar Línea de Servicio = Problemas
	Filtrar Fecha Recepción MES = MES del informe
 */
  filtrarReqPM2(jsonDataReqArray: any) {

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.contrato === 'Mantenimiento';
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return a.lineaDeServicio === 'Problemas';
    });
  
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (a.fechaRecepcion.getMonth() === this.fechaInforme.getMonth()
            && a.fechaRecepcion.getFullYear() === this.fechaInforme.getFullYear());
    });

    //definimos un arreglo temporal para hacer unicos los objetos
    let Jsontemporal = [];
    jsonDataReqArray.forEach(element => {
      let tmp = this.agregarJson(element);
      Jsontemporal.push(tmp);
    });

    this.jsonDataService.setJsonDataReqPM2Service(Jsontemporal);
   }

   /*
   	Fitrar Contrato = Mantenimiento
    Filtrar Bloque = Cancelaciones
    Filtrar Fecha Recepción MES = MES del informe
   */
    filtrarReqPI1(jsonDataReqArray: any) {
      jsonDataReqArray = jsonDataReqArray.filter(a => {
        return a.contrato === 'Mantenimiento';
      });
    
      jsonDataReqArray = jsonDataReqArray.filter(a => {
        //return a.bloque === 'Mantención';
        return a.bloque === 'Cancelaciones';
      });

      jsonDataReqArray = jsonDataReqArray.filter(a => {
        return (a.fechaRecepcion.getMonth() === this.fechaInforme.getMonth()
        && a.fechaRecepcion.getFullYear() === this.fechaInforme.getFullYear());
      });

      this.jsonDataService.setJsonDataReqPI1Service(jsonDataReqArray);
      this.jsonDataService.setJsonDataReqPI2Service(jsonDataReqArray);
    }

 guardar() {
    if(this.estadoReq==4){
      this.formulario.value.requerimientos = null;
      return 1;
    }

    if (this.formulario.invalid) {
      Object.values(this.formulario.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
        control.markAsTouched();
        }
      });
    } else {
        this.jsonDataService.setFechaInforme(this.formulario.value.fecha);

        if (this.jsonDataReq == null) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
          return;
        }

        if(this.feriados == null){
          this.sweetAlerService.mensajeError('Feriados', 'No se ha podido obtener los feriados');
          return;
        }

        this.sweetAlerService.mensajeOK('Resumen SLA generado exitosamente').then(          
          resp => {
            if (resp.value) {
              this.feriadosService.setFeriados(this.feriados);
          
              //borramos campos que no se necesitan
              this.formulario.value.requerimientos = null;

              this.router.navigateByUrl('/sla-generar');        
            }
          }
        );
    }
 }

 crearFormulario() {
  this.formulario = this.formBuilder.group({
      requerimientos : ['', [Validators.required]],
      fecha : ['', [Validators.required]],
    });
  }

  get requerimientosNoValido() {
    return this.formulario.get('requerimientos').invalid && this.formulario.get('requerimientos').touched;
  }

  get fechaNoValido() {
    return this.formulario.get('fecha').invalid && this.formulario.get('fecha').touched;
  }

  //devuelve un arreglo con los valores a enviar
  agregarJson(ars){
    let tmp = [];
    tmp['nroReq'] = ars['nroReq'];
    tmp['fecRealEstimacion'] = ars['fecRealEstimacion'];
    tmp['fecRealInicio'] = ars['fecRealInicio'];
    tmp['fecPlanPaseAprobacion'] = ars['fecPlanPaseAprobacion'];
    tmp['fecRealPaseAprobacion'] = ars['fecRealPaseAprobacion'];
    tmp['fecRealFin'] = ars['fecRealFin'];
    tmp['fecPlanPaseProduccion'] = ars['fecPlanPaseProduccion'];
    tmp['fecRealPaseProduccion'] = ars['fecRealPaseProduccion'];
    tmp['contrato'] = ars['contrato'];
    tmp['lineaDeServicio'] = ars['lineaDeServicio'];

    tmp['fechaRecepcion'] = ars['fechaRecepcion'];

    tmp['horasEstimadas'] = ars['horasEstimadas'];
    tmp['horasIncurridas'] = ars['horasIncurridas'];
    tmp['bloque'] = ars['bloque'];
    
    return tmp;
  }

  //valida que el tipo del archivo contanga la palabra sheet
  validarTipo(event){
    if(event.target.files[0]){
      let tipo = event.target.files[0].type;
      if (!tipo.includes('sheet')) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo es invalido');
        return false;
      }else{
        return true;
      }
    }
  }
}
