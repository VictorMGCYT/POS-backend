import { Content } from "pdfmake/interfaces"

interface HeaderOptions {
    title?: string;
    subtitle?: string;
}


export const headerSection = (options: HeaderOptions): Content => {
    const {title, subtitle} = options;
    console.log(`Titulo: ${title}, Subtítulo: ${subtitle}`);
    return {
        columns: [
            {
                image: 'src/assets/images/ventry_logo.png',
                width: 100,
                alignment: 'left',
            },
            {
                width: '*',
                stack: [
                    {
                        text: title ?? '',
                        fontSize: 24,
                        bold: true,
                        alignment: 'center',
                        margin: [0, 30, 0, 0]
                    },
                    {
                        text: subtitle ?? '',
                        fontSize: 12,
                        alignment: 'center',
                        margin: [0, 0, 0, 0]
                    }
                ]
            },
            {
                width: 100,
                text: ''
            }
        ]
    }
    
}