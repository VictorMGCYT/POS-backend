import { Injectable } from '@nestjs/common';
const PdfPrinter = require('pdfmake');
import { BufferOptions, CustomTableLayout, TDocumentDefinitions } from 'pdfmake/interfaces';


// Fuentes para utilizar en el servicio de impresora:

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

// diseño personalizado de tabla para la impresora
const tableLayout : Record<string, CustomTableLayout> = {
    customLayout01: {
    hLineWidth: function (i, node) {
      if (i === 0 || i === node.table.body.length) {
        return 0;
      }
      return (i === node.table.headerRows) ? 2 : 1;
    },
    vLineWidth: function (i) {
      return 0;
    },
    hLineColor: function (i) {
      return i === 1 ? 'black' : '#ccc';
    },
    paddingLeft: function (i) {
      return i === 0 ? 8 : 8;
    },
    paddingRight: function (i, node) {
        // detectar si nos encontramos en la última columna
        const widthsLength = node.table.widths?.length || 0;
        return (i === widthsLength - 1) ? 8 : 8;
    },
    fillColor: function(i, node) {
      if( i === 0 ) return '#93c5fd' 
      return i % 2 === 0 ? '#eee' : '#fff'
    }
  }
}

// Servicio de la impresora que utiliza pdfmake para generar documentos PDF.
@Injectable()
export class PrinterService {
    
  private printer = new PdfPrinter(fonts);

  createPdf(
      docDefinition: TDocumentDefinitions, 
      options: BufferOptions = {tableLayouts: tableLayout}
  ): PDFKit.PDFDocument{
      return this.printer.createPdfKitDocument(docDefinition, options);
  }

}


