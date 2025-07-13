import { TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "./sections/header.section";
import { recomendaciones } from "./sections/recomendaciones.section";
import { gitHubQr } from "./sections/github-qr.section";
import { NoSaleProductResultDto } from "src/products/dto/no-sales-products-result.dto";

interface NoSaleProductsProps {
    title: string;
    subtitle: string;
    username: string;
    dayStart?: string;
    dayEnd?: string;
    products: NoSaleProductResultDto[];
}

export const noSaleProductsReport = (
        props: NoSaleProductsProps
    ): TDocumentDefinitions => {

    const {subtitle, title, username, dayEnd, dayStart, products} = props;

    return {
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
        content: [
            {
                    text: [{text: `Reporte generado por: `, bold: true}, username ],
            },
            {
                text: [{text: `${dayEnd ? 'Con fechas de: ' : 'Con fecha de: '}`, bold: true}, `${dayStart} ${ dayEnd ? 'al ' + dayEnd : ''}` ],
            },
            gitHubQr(),

            // Ternario en caso de que no venga ningún producto
            products.length === 0 
                ?
                {text: "No hay productos sin ventas", margin: [0, 20, 0, 0], alignment: 'center', bold: true}
                :
                // Tabla con el resultado de los productos
                {
                    margin: [0, 20, 0, 0],
                    layout: "customLayout01",
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Producto', bold: true },
                                { text: 'Cantidad/Stock', bold: true },
                                { text: 'Precio de compra', bold: true }, 
                                { text: 'Precio de venta', bold: true }, 
                            ],
                            ...products.map( product => {
                                return [
                                    {
                                        text: product.prod_name,
                                        bold: true
                                    }, 
                                    {
                                        text: product.prod_stockQuantity,
                                        alignment: 'right'
                                    },
                                    {
                                        text: `$${product.prod_purchasePrice}`,
                                        alignment: 'right'
                                    },
                                    {
                                        text: `$${product.prod_unitPrice}`,
                                        alignment: 'right'
                                    }
                                ]
                            })
                        ]
                    }
                },
            // sección recomendaciones
            recomendaciones(),

        ]
    }

}