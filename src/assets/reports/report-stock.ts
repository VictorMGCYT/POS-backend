import { TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "./sections/header.section";
import { gitHubQr } from "./sections/github-qr.section";
import { Products } from "src/products/entities/product.entity";

interface StockReportProps {
    username: string;
    dayStart?: string;
    stockProducts: Products[]
}

export const stockReport = (
        props: StockReportProps
    ): TDocumentDefinitions => {
    const {username, dayStart, stockProducts} = props;

    return {
        header: headerSection({
            title: "Reporte del stock actual",
            subtitle: "Este reporte genera una listado del stock del negocio."
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
        content: [
            {
                    text: [{text: `Reporte generado por: `, bold: true}, username ],
            },
            {
                text: [{text: 'Con fecha de: ', bold: true}, `${dayStart}` ],
            },
            gitHubQr(),
            stockProducts.length === 0 ?
            {text: "No hay productos para mostrar", margin: [0, 20, 0, 0], alignment: 'center', bold: true}
            :
            {
                margin: [0, 20, 0, 0],
                layout: "customLayout01",
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                    body: [
                        ['Nombre', 'Código de barras', 'Cantidad/Stock', 'Precio compra', 'Precio venta'],
                        ...stockProducts.map(product => {
                            return [
                                {
                                    text: product.name,
                                    bold: true
                                }, 
                                {
                                    text: product.skuCode,
                                    alignment: 'right'
                                },
                                {
                                    text: product.stockQuantity,
                                    alignment: 'right'
                                },
                                {
                                    text: `$${product.purchasePrice}`,
                                    alignment: 'right'
                                },
                                {
                                    text: `$${product.unitPrice}`,
                                    alignment: 'right'
                                }
                            ]
                        })
                    ]
                }
            }
        ]
    }
}