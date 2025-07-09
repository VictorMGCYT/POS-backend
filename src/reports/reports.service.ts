import { BadRequestException, Injectable } from '@nestjs/common';
import { reportBestProducts } from 'src/assets/reports/report-best-products';
import { PrinterService } from 'src/printer/printer.service';
import { ReportBestProductsMonthDto } from './dtos/report-best-products-month.dto';
import { formatDate } from 'src/Common/functions/formate-date';
import { SaleItemsService } from 'src/sale-items/sale-items.service';

@Injectable()
export class ReportsService {
    // En el contructor se inyecta el servicio PrinterService
    // para poder utilizarlo en la generación de reportes.
    constructor(
        private readonly printerService: PrinterService, 
        private readonly saleItemsService: SaleItemsService
    ){}
    
    async bestSellingProductsMonth(bestProductsDto: ReportBestProductsMonthDto){
        const { username, daydate, period } = bestProductsDto;

        let titulo = '';
        let sbtitulo = '';
        // La fecha viene en zona de méxico o cualquier otra, pero no en UTC.
        const offesetTimezone = daydate.getTimezoneOffset();
        const hoursOffset = offesetTimezone / 60;

        // Extraer el año, mes y día de la fecha proporcionada
        const year = daydate.getFullYear();
        const month = daydate.getMonth();
        const day = daydate.getDate();

        let startDateUTC: Date;
        let endDateUTC: Date;

        if(period === 'month'){
            titulo = 'Reporte de Productos Más Vendidos del Mes';
            sbtitulo = 'Este reporte muestra los 50 productos más vendidos del mes.';
            
            // Para el mes, se toma el primer día del mes y el último día del mes.
            // Se ajusta la hora a UTC.                   v <- este es el día 1 del mes
            startDateUTC = new Date(Date.UTC(year, month, 1, hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(year, month + 1, 1, hoursOffset - 1, 59,59, 999));
        } else{
            throw new BadRequestException('Periodo no válido. Debe ser "month", "week" o "day".');
        }



        const products = await this.saleItemsService.findBestProducts({
            dayStart: startDateUTC,
            dayEnd: endDateUTC
        })

        const startLocalDate = formatDate(startDateUTC);
        const endLocalDate = formatDate(endDateUTC);


        const report = reportBestProducts({
            title: titulo,
            subtitle: sbtitulo,
            username: username,
            dayStart: startLocalDate,
            dayEnd: endLocalDate,
            products: products
        });

        return this.printerService.createPdf(report);

    }

}
