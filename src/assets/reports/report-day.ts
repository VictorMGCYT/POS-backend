import { TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "./sections/header.section";



export const reportDay = (): TDocumentDefinitions => {

    return {
        // Cabecera del reporte
        header: headerSection({
            title: 'Reporte Diario',
            subtitle: 'Reporte con la información de las ventas del día'
        }),
        // Tamaño de la página y márgenes
        pageSize: 'LETTER',
        pageMargins: [20,100,20,40],

        // Contenido del reporte
        content: [
            {
                columns: [
                    {
                        text: `Reporte generado por:`
                    },
                    {
                        text: 'Víctor Manuel González Cabrera'
                    }
                ]
            }
        ]
    }

}


