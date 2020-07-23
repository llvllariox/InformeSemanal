import jsPDF from 'jspdf';

export class Pdf {

    documentHeigth: number = 7.5;
    documentWidth: number = 13.33;

    documentoPdf: jsPDF;
    segmentoInforme: string;
    fechaInforme: string;

    pathUltimaPagina: string = '/assets/images/generacionPPT/Slide13.PNG';
    pathPrimeraPagina: string = '/assets/images/generacionPPT/slide-1-accn.png';

    tituloPdf: string = '';
    constructor(fecha) {
        const constDocumentHeight = this.documentHeigth * 72;
        const constDocumentWidth = this.documentWidth * 72;
        this.documentoPdf = new jsPDF('l', 'in', [constDocumentWidth, constDocumentHeight]);
        this.fechaInforme = fecha;

    }

    generarInforme(seccion: string, imagenes: string[]) {

        const imgData = '';
        // tslint:disable-next-line: prefer-const
        let doc = new jsPDF();
        doc.addImage(imgData, 'JPEG', 0, 0, this.documentWidth, this.documentHeigth);
    }

    generarPrimeraPagina(segmentoInforme: string) {
        this.segmentoInforme = segmentoInforme;
        // tslint:disable-next-line: prefer-const
        let portada = new Image();
        const offcetHeigth = 0.76;
        const offcetWidth = -0.053;
        portada.src = this.pathPrimeraPagina;

        this.documentoPdf.addImage(portada, 'JPEG', 0, 0, this.documentWidth, this.documentHeigth);

        const tituloInforme = `${this.tituloPdf}  ${segmentoInforme}`;
        this.documentoPdf.setFontSize(32);
        this.documentoPdf.setFontType('bold');
        this.documentoPdf.setTextColor(255, 255, 255);
        this.documentoPdf.text(0.69 + offcetWidth, 1.46 + offcetHeigth, tituloInforme);

        const offcetHeigthFecha = 0.35;
        const offcetWidthFecha = 0.1;
        this.documentoPdf.setFontSize(20);
        this.documentoPdf.setFontType('normal');
        this.documentoPdf.setTextColor(255, 255, 255);
        this.documentoPdf.text(0.69 + offcetWidthFecha, 3.39 + offcetHeigthFecha, this.fechaInforme);
    }

    generarPaginas(imagenesPaginas: string[], dimensiones: any[]) {
        for (let i = 0; i < imagenesPaginas.length; i++) {
            if ((imagenesPaginas.length - 1) === i ) {
                const Wtabla = this.documentWidth * 72;
                const HTabla = Number(dimensiones[i]['height']);
                const HTablaIN = (HTabla / 72) - 1;
                this.documentoPdf.addPage(Wtabla, HTabla);
                this.documentoPdf.addImage(imagenesPaginas[i], 'JPEG', 1, 0.5, this.documentWidth, HTablaIN );
            } else {
                this.documentoPdf.addPage();
                this.documentoPdf.addImage(imagenesPaginas[i], 'JPEG', 1, 0.5, this.documentWidth, this.documentHeigth);
            }
        }
    }
    ultimaPagina() {
        const originalW = this.documentWidth * 72;
        const originalH = this.documentHeigth * 72;
        this.documentoPdf.addPage(originalW, originalH);
        // tslint:disable-next-line: prefer-const
        let paginaFinal = new Image();
        paginaFinal.src = this.pathUltimaPagina;

        this.documentoPdf.addImage(paginaFinal, 'JPEG', 0, 0, this.documentWidth, this.documentHeigth);
    }
    guardarPdf(nombreArchivo: string) {
        if (this.segmentoInforme) {

            this.documentoPdf.save(`${nombreArchivo} ${this.segmentoInforme} - ${this.fechaInforme}.pdf`);
        } else {
            this.documentoPdf.save(`${nombreArchivo} ${this.fechaInforme}.pdf`);

        }
    }
}
