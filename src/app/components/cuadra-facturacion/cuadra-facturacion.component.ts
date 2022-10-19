import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as XLSX from 'xlsx';
import { SweetAlertService } from '../../services/sweet-alert.service';
import { CuadraFacturacionJsonDataService } from 'src/app/services/cuadra-facturacion-json-data.service';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-cuadra-facturacion',
  templateUrl: './cuadra-facturacion.component.html'
})
export class CuadraFacturacionComponent implements OnInit {
  formulario: FormGroup;

  estadoReqI = 1;
  estadoReqP = 1;
  estadoReqF = 1;

  jsonDataReqI = null;
  jsonDataReqP = null;
  jsonDataReqF = null; 

  fechaInforme;
  fechaMin;
  fechaMax;

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  constructor(private formBuilder: FormBuilder, private cuadraFacturacionJsonDataService: CuadraFacturacionJsonDataService, private sweetAlerService: SweetAlertService, private router: Router) { 
    this.crearFormulario();

    let hoy = new Date();
    const currentDate = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');  
    this.fechaMin = '2015-01';
    this.fechaMax = currentDate;
    this.formulario.controls['fecha'].setValue(currentDate);  

    this.cuadraFacturacionJsonDataService.setFechaInforme(this.formulario.value.fecha);
    this.fechaInforme = new Date(cuadraFacturacionJsonDataService.getFechaInforme() + '-05');
  
  }

  ngOnInit(): void {
  }

  //tipo = I, P o F
  click(tipo: String){
    if(tipo=='I'){
      this.formulario.controls.requerimientosI.reset();
      this.estadoReqI = 4;
    } else if(tipo=='P'){
      this.formulario.controls.requerimientosP.reset();
      this.estadoReqP = 4;
    } else if(tipo=='F'){
      this.formulario.controls.requerimientosF.reset();
      this.estadoReqF = 4;
    }
  }

  //transforma la data a JSON
  //tipo= I o P
  uploadReq(event, tipo) {
    
    if(!this.validarTipo(event, tipo)){
      this.cambiarEstado(tipo, 4);
      return;
    }

    let sheetName = '';
    let limit = '';

    if(tipo=='I'){
      sheetName = 'Exportación de Horas';
      limit = 'N1';
    } else if(tipo=='P'){
      sheetName = 'Detalle Horas Planificadas';
      limit = 'BA1';
    } 

    this.vaciarJsonData(tipo);
    this.cambiarEstado(tipo, 2);

    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];

    // INCURRIDO
    if(tipo=='I'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
  
        if (workBook.SheetNames[0] !== sheetName){
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
          return;
        }
  
        this.jsonDataReqI = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.cambiarEstado(tipo, 3);
          return initial;
        }, {});
  
        if (this.jsonDataReqI[sheetName] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
          this.cambiarEstado(tipo, 4);
          this.vaciarJsonData(tipo);
        } else {
          let tmp = this.jsonDataReqI[sheetName];
          this.filtrar(tmp, 'I');
        }
      };

      reader.readAsBinaryString(file);
    // PLANIFICADO
    } else if(tipo=='P'){
      reader.onload = () => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary', cellDates : true });
  
        if (workBook.SheetNames[0] !== 'Detalle Horas Planificadas'){
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
          this.estadoReqP = 4;
          this.jsonDataReqP = null;
          return;
        }
  
        this.jsonDataReqP = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          this.formularioHeaders(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.estadoReqP = 3;
          return initial;
        }, {});
  
        if (this.jsonDataReqP['Detalle Horas Planificadas'] === undefined) {
          this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
          this.estadoReqP = 4;
          this.jsonDataReqP = null;
        } else {
          let tmp = this.jsonDataReqP['Detalle Horas Planificadas'];
          this.filtrar(tmp, 'P');
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  //transforma la data de los facturados a JSON
  uploadReqFacturado(event) {
    let tipo = 'F';
    if(!this.validarTipo(event, tipo)){
      this.cambiarEstado(tipo, 4);
      return;
    }

    let sheetName = '';
    let limit = '';
     if(tipo=='F'){
      sheetName = 'Facturación';
      limit = 'AI1';
    }

    this.vaciarJsonData(tipo);
    this.cambiarEstado(tipo, 2);

    let workBook = null;
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary', cellDates : true });

      if (workBook.SheetNames[0] !== sheetName){
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requerimientos');
        this.cambiarEstado(tipo, 4);
        this.vaciarJsonData(tipo);
        return;
      }

      this.jsonDataReqF = workBook.SheetNames.reduce((initial, name) => {
        if(name == sheetName){
          const sheet = workBook.Sheets[name];
          this.formularioHeadersFacturado(sheet, limit);
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          this.cambiarEstado(tipo, 3);
        }

        return initial;
       }, {});

      if (this.jsonDataReqF[sheetName] === undefined) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        this.cambiarEstado(tipo, 4);
        this.vaciarJsonData(tipo);
      } else {
        let tmp = this.jsonDataReqF[sheetName];
        this.filtrarFacturados(tmp);
      }
    };
    reader.readAsBinaryString(file);
  }

  //FILTRAR
  filtrar(jsonDataReqArray: any, tipo: String) {
    let mesInforme = this.fechaInforme.getMonth();
    let agnoInforme = this.fechaInforme.getFullYear();

    //16 del mes pasado
    let mesPasado16;
    if(mesInforme == 0){
      mesPasado16 = new Date(String(Number(agnoInforme)-1) + '-12-16T00:00:00');
    } else{
      mesPasado16 = new Date(agnoInforme + '-' + String(mesInforme).padStart(2, '0') + '-16T00:00:00');
    };

    //15 del mes actual
    let mesInforme15 = new Date(agnoInforme + '-' + String(mesInforme+1).padStart(2, '0') + '-15T00:00:00');

    //sin pendiente en la descripcion
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (!(a.descripcion.includes('pendiente') || a.descripcion.includes('Pendiente')));
    });

    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (
        (
          a.lineaDeServicio === 'Evolutivo Mayor' 
          && a.descripcion.slice(0 , 2) == 'MA'
          && (a.fechaDeRecepcion>=mesPasado16 && a.fechaDeRecepcion<=mesInforme15) 
        )
        || 
        (
          a.lineaDeServicio === 'Capacity Service' 
          && a.descripcion.slice(0 , 2) == 'CS'
          && a.fechaDeRecepcion.getMonth() == mesInforme)
        );
    });

    //INCURRIDAS
    if(tipo=='I'){
      //definimos un arreglo temporal para hacer unicos los objetos
      let jsontemporal = [];
      jsonDataReqArray.forEach(element => {
        let tmp = this.agregarJson(element, 'I');
        jsontemporal.push(tmp);
      });

      this.cuadraFacturacionJsonDataService.setJsonDataReqIService(jsontemporal);
    
    //PLANIFICADAS
    } else if(tipo=='P'){
      //definimos un arreglo temporal para hacer unicos los objetos
      let jsontemporal = [];
      jsonDataReqArray.forEach(element => {
        let tmp = this.agregarJson(element, 'P');
        jsontemporal.push(tmp);
      });

      this.cuadraFacturacionJsonDataService.setJsonDataReqPService(jsontemporal);
    }
  }
  
  //FILTRAR FACTURADOS
  filtrarFacturados(jsonDataReqArray: any) {
    let tipo = 'F';
    let mesInforme = this.monthNames[this.fechaInforme.getMonth()];
    let agnoInforme = this.fechaInforme.getFullYear();


    //sin pendiente en la descripcion
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (!(a.nombreRequerimiento.includes('pendiente') || a.nombreRequerimiento.includes('Pendiente')));
    });

    //fecha
    jsonDataReqArray = jsonDataReqArray.filter(a => {
      return (a.ano == agnoInforme && a.mes == mesInforme);
    });

    //definimos un arreglo temporal para hacer unicos los objetos
    let jsontemporal = [];
    jsonDataReqArray.forEach(element => {
      let tmp = this.agregarJson(element, 'F');
      jsontemporal.push(tmp);
    });

    this.cuadraFacturacionJsonDataService.setJsonDataReqFService(jsontemporal);
  }

  guardar(){
    if(this.estadoReqI==4 || this.estadoReqP==4 || this.estadoReqF==4 ){ 
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
      this.cuadraFacturacionJsonDataService.setFechaInforme(this.formulario.value.fecha)
      
      if (this.jsonDataReqI == null || this.jsonDataReqP == null || this.jsonDataReqF == null) {
        this.sweetAlerService.mensajeError('Archivo Invalido', 'El archivo seleccionado no corresponde a Requrimientos');
        return;
      }

      this.sweetAlerService.mensajeOK('Resumen facturación generado exitosamente').then(          
        resp => {
          if (resp.value) {
            //borramos campos que no se necesitan
            this.formulario.value.requerimientosI = null;
            this.formulario.value.requerimientosP = null;
            this.formulario.value.requerimientosF = null;

            this.router.navigateByUrl('/cuadra-facturacion-generar');        
          }
        }
      );
    }
  }
  
  get requerimientosINoValido() {
    return this.formulario.get('requerimientosI').invalid && this.formulario.get('requerimientosI').touched;
  }

  get requerimientosPNoValido() {
    return this.formulario.get('requerimientosP').invalid && this.formulario.get('requerimientosP').touched;
  }

  get requerimientosFNoValido() {
    return this.formulario.get('requerimientosF').invalid && this.formulario.get('requerimientosF').touched;
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

  formularioHeadersFacturado(sheet, limit){
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
      if(letra[0]!='A' || letra.length != 2){
        sheet[letra].w = camalize(sheet[letra].w);   
      }

      if (letra == limit){
        break;
      }
    }
  }

  //si hay archivo se borra y se pide cargar de nuevo
  cambiarFecha(event) {
    //si no ha subido archivo
    this.fechaInforme = new Date(this.formulario.value.fecha + "-05");
  
    if(this.formulario.value.requerimientosI){
      this.formulario.controls.requerimientosI.reset();
      this.estadoReqI = 4;
    }

    if(this.formulario.value.requerimientosP){
      this.formulario.controls.requerimientosP.reset();
      this.estadoReqP = 4;
    }
  }

  crearFormulario() {
    this.formulario = this.formBuilder.group({
        requerimientosI : ['', [Validators.required]],
        requerimientosP : ['', [Validators.required]],
        requerimientosF : ['', [Validators.required]],
        fecha : ['', [Validators.required]],
    });
  }

   //devuelve un arreglo con los valores a enviar
  agregarJson(ars, tipo: String){
    let tmp = [];
    //tmp['nroReq'] = ars['nroReq'];
    if(tipo=='I'){
      tmp['descripcion'] = ars['descripcion'];
      tmp['horas'] = ars['horas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
    } else if(tipo=='P'){
      tmp['descripcion'] = ars['descripcion'];
      tmp['horasPlanificadas'] = ars['horasPlanificadas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
    } if(tipo=='F'){
      tmp['hhIncurridas'] = ars['hhIncurridas'];
      tmp['lineaDeServicio'] = ars['lineaDeServicio'];
      tmp['nombreRequerimiento'] = ars['nombreRequerimiento'];
      tmp['mes'] = ars['mes'];
      tmp['ano'] = ars['ano'];
    }
    
    return tmp;
  }

  validarTipo(event, tipo) {
    return true;
  }


  //asigns vslor al estado correspondiente
  cambiarEstado(tipo: String, valor: number){
    if(tipo=='I'){
      this.estadoReqI = valor;
    } else if(tipo=='P'){
      this.estadoReqP = valor;
    }
    else if(tipo=='F'){
      this.estadoReqF = valor;
    }
  }


  //asigna null a la variable que corresponda
  vaciarJsonData(tipo: String){
    if(tipo=='I'){
      this.jsonDataReqI = null;
    } else if(tipo=='P'){
      this.jsonDataReqP = null;
    } else if(tipo=='F'){
      this.jsonDataReqF = null;
    }
  }
}
/*
  I P F
  estadoReq = 1 -> right
  estadoReq = 2 -> spinner
  estadoReq = 3 -> success
  estadoReq = 4 -> danger
*/