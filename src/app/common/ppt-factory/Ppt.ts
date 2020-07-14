import pptxgen from "pptxgenjs";

export class Ppt {

    presentacion: pptxgen;
    presentationWidth: number = 13.33;
    presentatioHeigth: number = 7.5;
    font: string = 'Arial';
    fontColor: string = 'FFFFFF';
    segmentoInforme: string;
    fechaInfomre: string;

    pathPrimeraSlide: string = '/assets/images/generacionPPT/slide-1-accn.png';
    pathUltimaSlide: string = '/assets/images/generacionPPT/Slide13.PNG';
    tituloPresentacion: string = '';

    constructor(fecha) {
        this.presentacion = new pptxgen();
        this.presentacion.layout = 'LAYOUT_WIDE';
        this.fechaInfomre = fecha;
    }

    //generaInforme(string[]):void
    //recive como parametro un arreglo de string con imagnes encodeadas en base 64
    //estas imagenes seran incluidas en la presentacion
    generarInforme(segmentoInforme: string, imagenesPPT: string[]) {

        //genera la primera Slide
        this.segmentoInforme = segmentoInforme;
        let tituloInforme = `${this.tituloPresentacion}  ${segmentoInforme}`;
        try {


            this.primeraSlide(tituloInforme);
            for (let i = 0; i < imagenesPPT.length; i++) {

                if (typeof imagenesPPT[i] != 'string') {
                    throw 'tipo de dato de la imagene es incorrecto, prueba con la imagen en formato string en base 64';
                }
                let slide = this.presentacion.addSlide();
                slide.addImage({ data: imagenesPPT[i], x: 0, y: 0, w: this.presentationWidth, h: this.presentatioHeigth });
            }
        } catch (error) {
            throw error;
        }
        //genera la ultima slide
        this.ultimaSlide();
    }

    //primeraSlide(string):void
    //agrega a la presentacion una slide con las pripiedades de la primera slidide de portada
    // recibe como parametro el titulo de la presentacon 
    primeraSlide(tituloPresentacion: string) {
        if (typeof tituloPresentacion != 'string') {
            throw 'tipo incorrecto para el titulo se la presentacion, prueba con string';
        }
        //opciones para la imagen de fondo
        this.presentacion.defineSlideMaster({
            title: 'portada',
            bkgd: 'FFFFFF',
            objects: [
                { image: { path: this.pathPrimeraSlide, x: 0, y: 0, w: this.presentationWidth, h: this.presentatioHeigth } },
            ],
        });
        let slide = this.presentacion.addSlide("portada");

        //titulo Slide 1
        // let title = "Servicio de Mantenimiento de \nDesarrollo de Aplicaciones para Transbank \nInforme semanal  Segmento Backend";
        let title = tituloPresentacion;
        let titleOptions = {
            x: 0.69, y: 1.46,
            h: 1.93, w: 12.39,
            fontSize: 32,
            fontFace: this.font,
            color: this.fontColor,
            align: this.presentacion.AlignH.left,
            margin: 0,
            valign: this.presentacion.AlignV.bottom,
            bold: true,

        };
        slide.addText(title, titleOptions);
        //fecha de la generacion de la presentacion
        let fechaTexto = this.fechaInfomre;
        let fechaOptions = {
            x: 0.69, y: 3.39,
            h: 0.51, w: 11.96,
            fontSize: 20,
            fontFace: this.font,
            color: this.fontColor,
            align: this.presentacion.AlignH.left
        };
        slide.addText(fechaTexto, fechaOptions);
    }
    //ultimaSlide(void):void
    //genera la ultima slide
    // puede ser llamado multiples veces, aunque la idea es que se 
    //utilice solo para la ulima slide
    ultimaSlide() {
        this.presentacion.defineSlideMaster({
            title: 'finaPage',
            bkgd: '800000',
            objects: [
                { image: { path: this.pathUltimaSlide, x: 0, y: 0, w: this.presentationWidth, h: this.presentatioHeigth } },
            ],
        });
        let slide = this.presentacion.addSlide("finaPage");

        const ROJO_OSCURO = '800000'
        slide.bkgd = ROJO_OSCURO;
    }
    //guardarPresentacion(string):void
    //este metodo guarda la presentacion hecha 
    //este metodo de descarga automaticamentegenera la descarga
    guardarPresentacion(nombrePresentacion: string) {
        if (this.segmentoInforme) {

            this.presentacion.writeFile(`${nombrePresentacion} ${this.segmentoInforme} - ${this.fechaInfomre}`);

        } else {
            this.presentacion.writeFile(`${nombrePresentacion} ${this.fechaInfomre}`);

        }
    }

}