import { TDocumentDefinitions } from "pdfmake/interfaces";
import { EarnsDto } from "src/sales/dto/earns.dto";
import { headerSection } from "./sections/header.section";

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
        content: "Hola :3"
    }
}