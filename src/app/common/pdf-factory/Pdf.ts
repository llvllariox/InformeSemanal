import jsPDF from 'jspdf';

export class Pdf {

    documentHeigth: number = 7.5;
    documentWidth: number = 13.33;

    documentoPdf: jsPDF;
    segmentoInforme: string;
    fechaInforme: string;

    pathUltimaPagina: string = "/assets/images/generacionPPT/Slide13.PNG";
    pathPrimeraPagina: string = "/assets/images/generacionPPT/slide-1-accn.png";

    tituloPdf: string = '';
    constructor(fecha) {
        let constDocumentHeight = this.documentHeigth * 72;
        let constDocumentWidth = this.documentWidth * 72;
        this.documentoPdf = new jsPDF('l', 'in', [constDocumentWidth, constDocumentHeight],);
        this.fechaInforme = fecha;

    }

    generarInforme(seccion: string, imagenes: string[]) {

        let imgData = "";
        var doc = new jsPDF();


        doc.addImage(imgData, 'JPEG', 0, 0, this.documentWidth, this.documentHeigth);
    }
    generarPrimeraPagina(segmentoInforme: string) {
        this.segmentoInforme = segmentoInforme;
        let portada = new Image();
        let offcetHeigth = 0.76;
        let offcetWidth = -0.053;
        portada.src = this.pathPrimeraPagina;

        this.documentoPdf.addImage(portada, 'JPEG', 0, 0, this.documentWidth, this.documentHeigth);

        let tituloInforme = `${this.tituloPdf}  ${segmentoInforme}`;
        // this.documentoPdf.setFont(this.titleFont);
        this.documentoPdf.setFontSize(32);

        this.documentoPdf.setFontType('bold');

        this.documentoPdf.setTextColor(255, 255, 255);
        this.documentoPdf.text(0.69 + offcetWidth, 1.46 + offcetHeigth, tituloInforme);


        //fecha
        let offcetHeigthFecha = 0.35;
        let offcetWidthFecha = 0.1;
        this.documentoPdf.setFontSize(20);

        this.documentoPdf.setFontType('normal');

        this.documentoPdf.setTextColor(255, 255, 255);
        this.documentoPdf.text(0.69 + offcetWidthFecha, 3.39 + offcetHeigthFecha, this.fechaInforme);
    }
    // generaPaginas(string[]):void
    // este metodo recibe como parametro un areglo de imagenes encodeadas en base64
    // por cada elemento de en el arreglo genera una pagina en la presentacion del tamaño de la hoja del pdf
    generarPaginas(imagenesPaginas: string[], dimensiones: any[]) {
        console.log(imagenesPaginas);
        console.log(dimensiones);
        for (let i = 0; i < imagenesPaginas.length; i++) {
            this.documentoPdf.addPage();

            // console.log(imagenesPaginas[i]);
            // let imagenFinal="/assets/images/generacionPPT/Slide13.PNG"
            this.documentoPdf.addImage(imagenesPaginas[i], 'JPEG', 1, 0.5, this.documentWidth, this.documentHeigth);
            // console.log('widht',dimensiones[i].widht);
            // console.log('height',dimensiones[i].height);
            // this.documentoPdf.addImage(imagenesPaginas[i], 'JPEG', 1, 0, dimensiones[i].widht, dimensiones[i].height);

        }
    }
    ultimaPagina() {
        this.documentoPdf.addPage();
        let paginaFinal = new Image();
        paginaFinal.src = this.pathUltimaPagina;

        // let imagenFinal="/assets/images/generacionPPT/Slide13.PNG"
        this.documentoPdf.addImage(paginaFinal, 'JPEG', 0, 0, this.documentWidth, this.documentHeigth)
    }
    guardarPdf(nombreArchivo: string) {
        if (this.segmentoInforme) {

            this.documentoPdf.save(`${nombreArchivo} ${this.segmentoInforme} - ${this.fechaInforme}.pdf`);
        } else {
            this.documentoPdf.save(`${nombreArchivo} ${this.fechaInforme}.pdf`);

        }
    }

}