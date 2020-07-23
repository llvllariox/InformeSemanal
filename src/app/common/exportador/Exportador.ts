import { Pdf } from '../pdf-factory/Pdf';
import { Ppt } from '../ppt-factory/ppt';

export class Exportador {
  segmentoInforme: string;
  nombreInforme: string;
  fechaDocumentos: string;
  pathPrimeraImagen: string = '/assets/images/generacionPPT/slide-1-accn.png';
  // pathPrimeraImagen: string = '/assets/images/generacionPPT/Slide13.PNG';
  // pathUltimaImagen: string = '/assets/images/generacionPPT/slide-1-accn.png';
  pathUltimaImagen: string = '/assets/images/generacionPPT/Slide13.PNG';

  tituloPresentacion: string = 'Servicio de Mantenimiento de \nDesarrollo de Aplicaciones para Transbank \nInforme semanal';
  nuevaFecha: string

  constructor(nombreInforme: string, segnemntoInforme: string, nuevaFecha:string) {
    
    this.nombreInforme = nombreInforme;
    this.segmentoInforme = segnemntoInforme;
    this.fechaDocumentos = this.fecha(nuevaFecha);
  }

  exportarPPT(imagenesInfomre) {
    // console.log("generando presentacion");
    let presentacion = new Ppt(this.fechaDocumentos);
    try {

      presentacion.tituloPresentacion = this.tituloPresentacion;
      presentacion.pathPrimeraSlide = this.pathPrimeraImagen;
      presentacion.pathUltimaSlide = this.pathUltimaImagen;
      presentacion.generarInforme(this.segmentoInforme, imagenesInfomre);
    } catch (error) {
      console.error(error);
    }

    presentacion.guardarPresentacion(this.nombreInforme);
    // console.log("presentacion guardada");
  }

  exportarPDF(imagenesInfomre, dimensiones) {
    // console.log("generando pdf");
    // console.log('dimensiones', dimensiones);
    let documento = new Pdf(this.fechaDocumentos);

    documento.pathPrimeraPagina = this.pathPrimeraImagen;
    documento.pathUltimaPagina = this.pathUltimaImagen;
    documento.tituloPdf = this.tituloPresentacion;


    documento.generarPrimeraPagina(this.segmentoInforme);
    documento.generarPaginas(imagenesInfomre, dimensiones);
    documento.ultimaPagina();
    documento.guardarPdf(this.nombreInforme);
    // console.log("pdf guardado")
  }

  fecha(nuevaFecha) {
    // let fecha = this.nuevaFecha;
    // // console.log(fecha);
    // let day: string = fecha.substr(9,2) + '';
    // // console.log(day);
    // let month: string = (fecha.substr(6,2)) + '';
    // if (+day < 10) {
    //   day = '0' + day;
    // }
    // if (+month < 10) {
    //   month = '0' + month;
    // }
    // // console.log(month);
    // return `${day}-${month}-${fecha.substr(1,4)}`;
    // let fecha = new Date();
  //   // console.log(fecha);
  //   let day: string = fecha.getDate() + '';
  //   // console.log(day);
  //   let month: string = (fecha.getMonth() + 1) + '';
  //   if (+day < 10) {
  //     day = '0' + day;
  //   }
  //   if (+month < 10) {
  //     month = '0' + month;
  //   }
  //   // console.log(month);
  //   return `${day}-${month}-${fecha.getUTCFullYear()}`;

    // console.log('export', nuevaFecha);
    let dayN = Number(nuevaFecha.substr(8,29));
    let monthN = Number(nuevaFecha.substr(5,2));
    let annoN = Number(nuevaFecha.substr(0,4));
    // console.log(dayN);
    // console.log(monthN);
    // console.log(annoN);

    let fecha = new Date(annoN,monthN,dayN);
    // console.log(fecha);
    // console.log(nuevaFecha.getDate());
    
    // let fecha = new Date();
    // fecha = this.nuevaFecha.
    // console.log(fecha);
    let day: string = fecha.getDate() + '';
    // console.log(day);
    let month: string = (fecha.getMonth()) + '';
    if (+day < 10) {
      day = '0' + day;
    }
    if (+month < 10) {
      month = '0' + month;
    }
    // console.log(month);
    return `${day}-${month}-${fecha.getUTCFullYear()}`;
  }
}
