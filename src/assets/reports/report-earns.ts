import { TDocumentDefinitions } from "pdfmake/interfaces";
import { EarnsDto } from "src/sales/dto/earns.dto";
import { headerSection } from "./sections/header.section";
import { gitHubQr } from "./sections/github-qr.section";

interface ReportEarnsProps {
    title: string;
    subtitle: string;
    username: string;
    dayStart?: string;
    dayEnd?: string;
    earns: EarnsDto | undefined;
}

export const reportEarnsOfSales = (
        props: ReportEarnsProps
    ): TDocumentDefinitions => {
    const { title, subtitle, username, dayStart, dayEnd, earns } = props;

    return {
        header: headerSection({
            title: title,
            subtitle: subtitle
        }),
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
            earns ? 
            {
                margin: [0, 20, 0, 0],
                layout: 'customLayout01',
                table: {
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Concepto', bold: true },
                            { text: 'Efectivo', bold: true, alignment: 'right' },
                            { text: 'Tarjeta', bold: true, alignment: 'right' },
                            { text: 'Total', bold: true, alignment: 'right'}
                        ],
                        [
                            {
                                text: 'Vendido',
                                bold: true
                            },
                            {
                                text: `$${earns.monto_en_efectivo}`,
                                alignment: 'right'
                            },
                            {
                                text: `$${earns.monto_en_tarjeta}`,
                                alignment: 'right'
                            },
                            {
                                text: `$${earns.monto_total}`,
                                alignment: 'right'
                            },
                        ],
                        [
                            {
                                text: 'Ganancias',
                                bold: true
                            },
                            {
                                text: `$${earns.ganancia_efectivo}`,
                                alignment: 'right'
                            },
                            {
                                text: `$${earns.ganancia_tarjeta}`,
                                alignment: 'right'
                            },
                            {
                                text: `$${earns.ganancia_total}`,
                                alignment: 'right'
                            },
                        ],
                        [
                            {
                                text: 'Número de ventas	',
                                bold: true
                            },
                            {
                                text: earns.ventas_efectivo,
                                alignment: 'right'
                            },
                            {
                                text: earns.ventas_tarjeta,
                                alignment: 'right'
                            },
                            {
                                text: earns.ventas_totales,
                                alignment: 'right'
                            }
                        ]
                    ]
                }
            } : 
            {
                text: "No hay ganancias para mostrar",
                margin: [0, 20, 0, 0],
                alignment: 'center',
                bold: true
            },

        ]
    }
}