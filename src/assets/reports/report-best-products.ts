import { TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "./sections/header.section";
import { formatDate } from "src/Common/functions/formate-date";
import { BestProductResultDto } from "src/sale-items/dto/best-products-result.dto";

interface BestProductsProps {
    title: string;
    subtitle: string;
    username: string;
    dayStart?: string;
    dayEnd?: string;
    products: BestProductResultDto[];
}

export const reportBestProducts = (
        props: BestProductsProps 
    ): TDocumentDefinitions => {

    const { title, subtitle, username, dayEnd, dayStart, products } = props;

    return {
        // Cabecera del reporte
        header: headerSection({
            title: title,
            subtitle: subtitle
        }),
        // Tamaño de la página y márgenes
        pageSize: 'LETTER',
        pageMargins: [20,120,20,40],
        footer: (currentPage, pageCount) => {
            return { 
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'right',
                margin: [0, 0, 20, 10],
            }
        },
        // Contenido del reporte
        content: [
            [
                {
                    text: [{text: `Reporte generado por: `, bold: true}, username ],
                },
                {
                    text: [{text: `${dayEnd ? 'Con fechas de: ' : 'Con fecha de: '}`, bold: true}, `${dayStart} ${ dayEnd ? 'al ' + dayEnd : ''}` ],
                },
                {
                    layout: 'noBorders',
                    table: {
                        widths: ['*', 'auto'],
                        body: [
                            [
                                '',
                                {                                
                                    qr: 'https://github.com/VictorMGCYT',
                                    fit: 100,
                                    alignment: 'right',
                                }
                            ],
                            [
                                '',
                                {
                                    text: 'Creador',
                                    alignment: 'center',
                                    bold: true,
                                }
                            ]
                        ]
                    }
                },

                // ! Tabla de productos
                {
                    margin: [0, 20, 0, 0],
                    layout: 'customLayout01',
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Producto', bold: true },
                                { text: 'Cantidad', bold: true },
                                { text: 'Ventas Totales', bold: true }, 
                                { text: 'Ganancias Totales', bold: true }, 
                            ],
                            ...products.map(product => [
                                {
                                    text: product.product_name,
                                    bold: true
                                }, 
                                {
                                    text: product.totalquantity,
                                    alignment: 'right'
                                },
                                {
                                    text: `$${product.totalsales}`,
                                    alignment: 'right'
                                },
                                {
                                    text: `$${product.totalprofit}`,
                                    alignment: 'right'
                                }
                            ])
                        ]
                    }
                }
            ],
        ]
    }

}


