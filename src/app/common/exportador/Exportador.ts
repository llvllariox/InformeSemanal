import { Pdf } from '../pdf-factory/Pdf';
import { Ppt } from '../ppt-factory/ppt';

export class Exportador {
  segmentoInforme: string;
  nombreInforme: string;
  fechaDocumentos: string;
  pathPrimeraImagen = '/assets/images/generacionPPT/slide-1-accn.png';
  pathUltimaImagen = '/assets/images/generacionPPT/Slide13.PNG';

  tituloPresentacion = 'Servicio de Mantenimiento de \nDesarrollo de Aplicaciones para Transbank \nInforme semanal';
  nuevaFecha: string;

  constructor(nombreInforme: string, segnemntoInforme: string, nuevaFecha: string) {

    this.nombreInforme = nombreInforme;
    this.segmentoInforme = segnemntoInforme;
    this.fechaDocumentos = this.fecha(nuevaFecha);
  }

  exportarPPT(imagenesInfomre) {
    // tslint:disable-next-line: prefer-const
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
  }

  exportarPDF(imagenesInfomre, dimensiones) {
    // tslint:disable-next-line: prefer-const
    let documento = new Pdf(this.fechaDocumentos);

    documento.pathPrimeraPagina = this.pathPrimeraImagen;
    documento.pathUltimaPagina = this.pathUltimaImagen;
    documento.tituloPdf = this.tituloPresentacion;


    documento.generarPrimeraPagina(this.segmentoInforme);
    documento.generarPaginas(imagenesInfomre, dimensiones);
    documento.ultimaPagina();
    documento.guardarPdf(this.nombreInforme);
  }

  fecha(nuevaFecha) {

    const dayN = Number(nuevaFecha.substr(8, 29));
    const monthN = Number(nuevaFecha.substr(5, 2));
    const annoN = Number(nuevaFecha.substr(0, 4));

    const fecha = new Date(annoN, monthN, dayN);

    let day: string = fecha.getDate() + '';
    let month: string = (fecha.getMonth()) + '';
    if (+day < 10) {
      day = '0' + day;
    }
    if (+month < 10) {
      month = '0' + month;
    }
    return `${day}-${month}-${fecha.getUTCFullYear()}`;
  }
}
