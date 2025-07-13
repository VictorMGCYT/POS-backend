import { Content } from "pdfmake/interfaces";


export const gitHubQr = (): Content => {

    return [
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
        }
    ]
}