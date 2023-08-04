import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { MywizardRvJsonDataService } from 'src/app/services/mywizard-rv-json-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mywizard-rv',
  templateUrl: './mywizard-rv.component.html'
})
export class MywizardRvComponent implements OnInit {
  formulario: FormGroup;

  estadoReqAbiertos = 1;
  estadoReqCerrados = 1;
  estadoSolAbiertos = 1;
  estadoSolCerrados = 1;
  estadoHoras = 1;

  jsonDataReqAbiertos = null;
  jsonDataReqCerrados = null;
  jsonDataSolAbiertos = null;
  jsonDataSolCerrados = null;
  jsonDataHoras = null;
  
  fechaInforme;
  fechaMin;
  fechaMax;

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  constructor(private formBuilder: FormBuilder, private mywizardRvJsonDataService: MywizardRvJsonDataService, private sweetAlerService: SweetAlertService, private router: Router) { 
    this.crearFormulario();

    let hoy = new Date();
    const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
    this.fechaMin = '2015-01';
    this.fechaMax = currentDate;
    this.formulario.controls['fecha'].setValue(currentDate);  

    this.mywizardRvJsonDataService.setFechaInforme(this.formulario.value.fecha);
    this.fechaInforme = new Date(mywizardRvJsonDataService.getFechaInforme() + '-05');
  }

  ngOnInit(): void {
  }

  //tipo = reqAbiertos, reqCerrados, solAbiertos, solCerrados
  click(tipo: String){
    if(tipo=='reqAbiertos'){
      this.formulario.controls.requerimientosAbiertos.reset();
      this.estadoReqAbiertos = 4;
    } else if(tipo=='reqCerrados'){
      this.formulario.controls.requerimientosCerrados.reset();
      this.estadoReqCerrados = 4;
    } else if(tipo=='solAbiertos'){
      this.formulario.controls.solicitudesAbiertos.reset();
      this.estadoSolAbiertos = 4;
    } else if(tipo=='solCerrados'){
      this.formulario.controls.solicitudesCerrados.reset();
      this.estadoSolCerrados = 4;
    } else if(tipo=='horas'){
      this.formulario.controls.horas.reset();
      this.estadoHoras = 4;
    } 
  }

  //transforma la data a JSON
  //tipo = reqAbiertos, reqCerrados, solAbiertos, solCerrados
  uploadReq(event, tipo) {
    
    if(!this.validarTipo(event, tipo)){
      this.cambiarEstado(tipo, 4);
      return;
    }

    let sheetName = '';
    let limit = '';

    if(tipo=='reqAbiertos'){
      sheetName = 'Requerimientos';
      limit = 'AO1';
    } else if(tipo=='reqCerrados'){
      sheetName = 'Requerimientos';
      limit = 'AO1';
    } else if(tipo=='solAbiertos'){
      sheetName = 'Solicitudes';
      limit = 'AM1';
    } else if(tipo=='solCerrados'){
      sheetName = 'Solicitudes';
      limit = 'AM1';
    } else if(tipo=='horas'){
      sheetName = 'Exportación de Horas';
      limit = 'BC1';
    }
    
    this.vaciarJsonData(tipo);
    this.cambiarEstado(tipo, 2);

    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];

    //reqAbiertos
    if(tipo=='reqAbiertos'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
  
        if (workBook.SheetNames[0] !== sheetName){
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
          return;
        }
  
        this.jsonDataReqAbiertos = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.cambiarEstado(tipo, 3);
          return initial;
        }, {});
  
        if (this.jsonDataReqAbiertos[sheetName] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
        } else {
          let tmp = this.jsonDataReqAbiertos[sheetName];
          this.filtrar(tmp, 'reqAbiertos');
        }
      };

      reader.readAsBinaryString(file);
    }

    //reqCerrados
    else if(tipo=='reqCerrados'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
  
        if (workBook.SheetNames[0] !== sheetName){
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
          return;
        }
  
        this.jsonDataReqCerrados = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.cambiarEstado(tipo, 3);
          return initial;
        }, {});
  
        if (this.jsonDataReqCerrados[sheetName] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
        } else {
          let tmp = this.jsonDataReqCerrados[sheetName];
          this.filtrar(tmp, 'reqCerrados');
        }
      };

      reader.readAsBinaryString(file);
    }

    //solAbiertos
    if(tipo=='solAbiertos'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
  
        if (workBook.SheetNames[0] !== sheetName){
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a solicitudes');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
          return;
        }
  
        this.jsonDataSolAbiertos = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.cambiarEstado(tipo, 3);
          return initial;
        }, {});
  
        if (this.jsonDataSolAbiertos[sheetName] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a solicitudes');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
        } else {
          let tmp = this.jsonDataSolAbiertos[sheetName];
          this.filtrar(tmp, 'solAbiertos');
        }
      };

      reader.readAsBinaryString(file);
    }

    //solCerrados
    else if(tipo=='solCerrados'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
  
        if (workBook.SheetNames[0] !== sheetName){
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a solicitudes');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
          return;
        }
  
        this.jsonDataSolCerrados = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.cambiarEstado(tipo, 3);
          return initial;
        }, {});
  
        if (this.jsonDataSolCerrados[sheetName] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a solicitudes');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
        } else {
          let tmp = this.jsonDataSolCerrados[sheetName];
          this.filtrar(tmp, 'solCerrados');
        }
      };

      reader.readAsBinaryString(file);
    }

    //horas
    else if(tipo=='horas'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
  
        if (workBook.SheetNames[0] !== sheetName){
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
          return;
        }
  
        this.jsonDataHoras = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.cambiarEstado(tipo, 3);
          return initial;
        }, {});
  
        if (this.jsonDataHoras[sheetName] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a horas');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
        } else {
          let tmp = this.jsonDataHoras[sheetName];
          this.filtrar(tmp, 'horas');
        }
      };

      reader.readAsBinaryString(file);
    }
  }

  //FILTRAR
  //tipo = reqAbiertos, reqCerrados, solAbiertos, solCerrados
  filtrar(jsonDataArray: any, tipo: String) {
    //sin sobresfuerzo en bloque
    jsonDataArray = jsonDataArray.filter(a => {
      return (!(a.bloque.includes('sobresfuerzo') || a.bloque.includes('Sobresfuerzo')));
    });

    //reqAbiertos
    if(tipo=='reqAbiertos'){
      jsonDataArray = jsonDataArray.filter(a => {
        return (
          (
            a.lineaDeServicio === 'Problemas' 
            && a.contrato === 'Mantenimiento'
            && a.descripcion.includes('PRB')
          )
        );
      });
    }

    //reqCerrados
    else if(tipo=='reqCerrados'){
      jsonDataArray = jsonDataArray.filter(a => {
        return (
          (
            a.lineaDeServicio === 'Problemas' 
            && a.contrato === 'Mantenimiento' 
            && a.descripcion.includes('PRB')
          )
        );
      });
    }

    //solAbiertos
    else if(tipo=='solAbiertos'){
      jsonDataArray = jsonDataArray.filter(a => {
        return (
          (
            a.lineaDeServicio === 'Incidentes' 
            && a.contrato === 'Mantenimiento' 
            && a.descripcion.includes('INC')
          )
        );
      });
    }

    //solCerrados
    else if(tipo=='solCerrados'){
      jsonDataArray = jsonDataArray.filter(a => {
        return (
          (
            a.lineaDeServicio === 'Incidentes' 
            && a.contrato === 'Mantenimiento' 
            && a.descripcion.includes('INC')
          )
        );
      });
    }

    //horas
    else if(tipo=='horas'){
      jsonDataArray = jsonDataArray.filter(a => {
        return (
          (
            (a.lineaDeServicio === 'Problemas' || a.lineaDeServicio === 'Incidentes')
            && a.tipoContrato === 'Mantenimiento' 
            && (a.descripcion.includes('INC') || a.descripcion.includes('PRB'))
            && (!(a.nombre.includes('Eliot')))
          )
        );
      });
    }

    //definimos un arreglo temporal para hacer unicos los objetos
    let jsontemporal = [];
    jsonDataArray.forEach(element => {
      let tmp = this.agregarJson(element, tipo);
      jsontemporal.push(tmp);
    });

    this.setJsonData(jsontemporal, tipo);
  }

  //agrega la data al servicio
  //tipo = reqAbiertos, reqCerrados, solAbiertos, solCerrados
  setJsonData(data, tipo){
    if(tipo=='reqAbiertos'){
      this.mywizardRvJsonDataService.setJsonDataReqAbiertosService(data);
    } else if(tipo=='reqCerrados'){
      this.mywizardRvJsonDataService.setJsonDataReqCerradosService(data);
    } else if(tipo=='solAbiertos'){
      this.mywizardRvJsonDataService.setJsonDataSolAbiertosService(data);
    } else if(tipo=='solCerrados'){
      this.mywizardRvJsonDataService.setJsonDataSolCerradosService(data);
    }  else if(tipo=='horas'){
      this.mywizardRvJsonDataService.setJsonDataHorasService(data);
    }
  }

  //FILTRAR HORAS
  filtrarHoras(jsonDataArray: any) {
    //sin sobresfuerzo en el bloque
    jsonDataArray = jsonDataArray.filter(a => {
      return (!(a.bloque.includes('sobresfuerzo') || a.bloque.includes('Sobresfuerzo')));
    });

    // sin retrabajos
    console.log(jsonDataArray);
    jsonDataArray = jsonDataArray.filter(a => {
      return (!(a.descripcionTarea.includes('Retrabajo') || a.descripcionTarea.includes('retrabajo')));
    });

    //DESCRIPCION INC o PRB
    jsonDataArray = jsonDataArray.filter(a => {
      return (a.descripcion.includes('INC') || a.descripcion.includes('PRB'));
    });

    //SE SACA ELIOT *********************
    jsonDataArray = jsonDataArray.filter(a => {
      return (!(a.nombre.includes('Eliot')));
    });

    jsonDataArray = jsonDataArray.filter(a => {
      return (
        (
          (a.lineaDeServicio === 'Problemas' || a.lineaDeServicio === 'Incidentes')
          && a.tipoContrato === 'Mantenimiento' 
        )
      );
    });

    //definimos un arreglo temporal para hacer unicos los objetos
    let jsontemporal = [];
    jsonDataArray.forEach(element => {
      let tmp = this.agregarJson(element, 'horas');
      jsontemporal.push(tmp);
    });

    this.mywizardRvJsonDataService.setJsonDataHorasService(jsontemporal);
  }
  
  guardar(){
    if(this.estadoReqAbiertos==4 || this.estadoReqCerrados==4 || this.estadoSolAbiertos==4 || this.estadoSolCerrados==4 || this.estadoHoras==4){ 
      //this.formulario.value.requerimientos = null;
      return 1;
    }

    if(this.formulario.invalid) {
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
      this.mywizardRvJsonDataService.setFechaInforme(this.formulario.value.fecha);
      
      if (this.jsonDataReqAbiertos == null || this.jsonDataReqCerrados == null || this.jsonDataSolAbiertos == null || this.jsonDataSolCerrados == null || this.jsonDataHoras == null) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde');
        return;
      }

      this.sweetAlerService.mensajeOK('Indicadores generados exitosamente').then(          
        resp => {
          if (resp.value) {
            //borramos campos que no se necesitan
            this.formulario.value.requerimientosAbiertos = null;
            this.formulario.value.requerimientosCerrados = null;
            this.formulario.value.solicitudesAbiertos = null;
            this.formulario.value.solicitudesCerrados = null;
            this.formulario.value.horas = null;

            this.router.navigateByUrl('/mywizard-rv-generar');        
          }
        }
      );
    }
  }
  
  get requerimientosAbiertosNoValido() {
    return this.formulario.get('requerimientosAbiertos').invalid && this.formulario.get('requerimientosAbiertos').touched;
  }

  get requerimientosCerradosNoValido() {
    return this.formulario.get('requerimientosCerrados').invalid && this.formulario.get('requerimientosCerrados').touched;
  }

  
  get solicitudesAbiertosNoValido() {
    return this.formulario.get('solicitudesAbiertos').invalid && this.formulario.get('solicitudesAbiertos').touched;
  }

  get solicitudesCerradosNoValido() {
    return this.formulario.get('solicitudesCerrados').invalid && this.formulario.get('solicitudesCerrados').touched;
  }

  get horasNoValido() {
    return this.formulario.get('horas').invalid && this.formulario.get('horas').touched;
  }


  get fechaNoValido() {
    return this.formulario.get('fecha').invalid && this.formulario.get('fecha').touched;
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

  //si hay archivo se borra y se pide cargar de nuevo
  cambiarFecha(event) {
    //si no ha subido archivo
    this.fechaInforme = new Date(this.formulario.value.fecha + "-05");
  
    if(this.formulario.value.requerimientosAbiertos){
      this.formulario.controls.requerimientosAbiertos.reset();
      this.estadoReqAbiertos = 4;
    }

    if(this.formulario.value.requerimientosCerrados){
      this.formulario.controls.requerimientosCerrados.reset();
      this.estadoReqCerrados = 4;
    }

    if(this.formulario.value.solicitudesAbiertos){
      this.formulario.controls.solicitudesAbiertos.reset();
      this.estadoSolAbiertos = 4;
    }

    if(this.formulario.value.solicitudesCerrados){
      this.formulario.controls.solicitudesCerrados.reset();
      this.estadoSolCerrados = 4;
    }

    if(this.formulario.value.horas){
      this.formulario.controls.horas.reset();
      this.estadoHoras = 4;
    }
  }

  crearFormulario() {
    this.formulario = this.formBuilder.group({
        requerimientosAbiertos : ['', [Validators.required]],
        requerimientosCerrados : ['', [Validators.required]],
        solicitudesAbiertos : ['', [Validators.required]],
        solicitudesCerrados : ['', [Validators.required]],
        horas : ['', [Validators.required]],
        
        fecha : ['', [Validators.required]],
    });
  }

  //devuelve un arreglo con los mismos nombres y los valores a enviar
  //tipo = reqAbiertos, reqCerrados, solAbiertos, solCerrados
  agregarJson(ars, tipo: String){
    let tmp = [];

    if(tipo=='reqAbiertos'){
      tmp['nombre'] = ars['descripcion'];
      tmp['horas'] = ars['horasIncurridas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
      tmp['fechaRecepcion'] = ars['fechaRecepcion'];
      tmp['rework'] = ars['rework'];
      tmp['etapa'] = ars['etapa'];
    } else if(tipo=='reqCerrados'){
      tmp['nombre'] = ars['descripcion'];
      tmp['horas'] = ars['horasIncurridas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
      tmp['fechaRecepcion'] = ars['fechaRecepcion'];
      tmp['rework'] = ars['rework'];
      tmp['etapa'] = ars['etapa'];
    } else if(tipo=='solAbiertos'){
      tmp['nombre'] = ars['descripcion'];
      tmp['horas'] = ars['horasIncurridas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
      tmp['fechaRecepcion'] = ars['fechaRecepcion'];
      tmp['rework'] = ars['rework'];
      tmp['etapa'] = ars['etapa'];
    } else if(tipo=='solCerrados'){
      tmp['nombre'] = ars['descripcion'];
      tmp['horas'] = ars['horasIncurridas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
      tmp['fechaRecepcion'] = ars['fechaRecepcion'];
      tmp['rework'] = ars['rework'];
      tmp['etapa'] = ars['etapa'];
    } else if(tipo=='horas'){
      tmp['nombre'] = ars['descripcion'];
      tmp['horas'] = ars['horas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
    }
    
    return tmp;
  }

  validarTipo(event, tipo) {
    return true;
  }


  //asigna valor al estado correspondiente
  //tipo = reqAbiertos, reqCerrados, solAbiertos, solCerrados
  cambiarEstado(tipo: String, valor: number){
    if(tipo=='reqAbiertos'){
      this.estadoReqAbiertos = valor;
    } else if(tipo=='reqCerrados'){
      this.estadoReqCerrados = valor;
    } else if(tipo=='solAbiertos'){
      this.estadoSolAbiertos = valor;
    } else if(tipo=='solCerrados'){
      this.estadoSolCerrados = valor;
    } else if(tipo=='horas'){
      this.estadoHoras = valor;
    }
  }

  //asigna null a la variable que corresponda
  //tipo = reqAbiertos, reqCerrados, solAbiertos, solCerrados
  vaciarJsonData(tipo: String){
    if(tipo=='reqAbiertos'){
      this.jsonDataReqAbiertos = null;
    } else if(tipo=='reqCerrados'){
      this.jsonDataReqCerrados = null;
    } else if(tipo=='solAbiertos'){
      this.jsonDataSolAbiertos = null;
    } else if(tipo=='solCerrados'){
      this.jsonDataSolCerrados = null;
    }  else if(tipo=='horas'){
      this.jsonDataHoras = null;
    }
  }
}

/*
  Req Sol Abiertos Cerrados
  estado = 1 -> right
  estado = 2 -> spinner
  estado = 3 -> success
  estado = 4 -> danger
*/