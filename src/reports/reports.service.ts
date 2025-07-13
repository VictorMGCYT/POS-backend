import { BadRequestException, Injectable } from '@nestjs/common';
import { ReportBestProductsDto } from './dtos/report-best-products-month.dto';
import { formatDate } from 'src/Common/functions/formate-date';
import { SaleItemsService } from 'src/sale-items/sale-items.service';
import { AuthService } from 'src/auth/auth.service';
import { normalizeFullName } from 'src/utils/functions/normalizeString';
import { ReportWorstProductsDto } from './dtos/report-worst-products.dto';
import { reportBestAndWorstProducts } from 'src/assets/reports/report-best-and-worst-products';
import { PrinterService } from 'src/printer/printer.service';
import { noSaleProductsReport } from 'src/assets/reports/report-products-no-sale';
import { ReportNoSaleProductsDto } from './dtos/report-nosales-products.dto';
import { ProductsService } from '../products/products.service';
import { stockReport } from 'src/assets/reports/report-stock';
import { StockProductsReportDto } from './dtos/report-stock.dto';

@Injectable()
export class ReportsService {
    // En el contructor se inyecta el servicio PrinterService
    // para poder utilizarlo en la generación de reportes.
    constructor(
        private readonly printerService: PrinterService, 
        private readonly saleItemsService: SaleItemsService,
        private readonly authService: AuthService,
        private readonly productsService: ProductsService
    ){}
    
    // ** Método para generar el reporte de los productos más vendidos
    async bestSellingProducts(bestProductsDto: ReportBestProductsDto){
        const { userId, daydate, period } = bestProductsDto;

        // Obtener el usuario autenticado
        const user = await this.authService.findOne(userId);
        const fullName = `${user.firstName} ${user.paternalSurname} ${user.maternalSurname}`;

        // La fecha viene en zona de méxico o cualquier otra, pero no en UTC.
        const offesetTimezone = daydate.getTimezoneOffset();
        const hoursOffset = offesetTimezone / 60;
        
        // Extraer el año, mes y día de la fecha proporcionada
        const year = daydate.getFullYear();
        const month = daydate.getMonth();
        const day = daydate.getDate();
        
        // variable para los datos del reporte
        let titulo = '';
        let sbtitulo = '';
        let startDateUTC: Date;
        let endDateUTC: Date;
        if(period === 'month'){
            titulo = 'Reporte de Productos Más Vendidos del Mes';
            sbtitulo = 'Este reporte muestra los 50 productos más vendidos del mes.';
            
            // Para el mes, se toma el primer día del mes y el último día del mes.
            // Se ajusta la hora a UTC.                   v <- este es el día 1 del mes
            startDateUTC = new Date(Date.UTC(year, month, 1, hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(year, month + 1, 1, hoursOffset - 1, 59,59, 999));
        } else if(period === 'week'){

            titulo = 'Reporte de Productos Más Vendidos de la Semana';
            sbtitulo = 'Este reporte muestra los 50 productos más vendidos de la semana.';
            
            // Para la semana, se toma el primer día de la semana (domingo) y el último día de la semana (sábado).
            const firstDayOfWeek = new Date(year, month, day - daydate.getDay());
            const lastDayOfWeek = new Date(year, month, day + (6 - daydate.getDay()));

            startDateUTC = new Date(Date.UTC(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate(), hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate(), hoursOffset - 1, 60, 60, 999));

        } else if(period === 'day'){

            titulo = 'Reporte de Productos Más Vendidos del Día';
            sbtitulo = 'Este reporte muestra los 50 productos más vendidos del día.';
            
            // Para el día, se toma la fecha proporcionada y se ajusta a UTC.
            startDateUTC = new Date(Date.UTC(year, month, day, hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(year, month, day + 1, hoursOffset - 1, 59, 59, 999));

        } else{
            throw new BadRequestException('Periodo no válido. Debe ser "month", "week" o "day".');
        }


        const products = await this.saleItemsService.findBestProducts({
            dayStart: startDateUTC,
            dayEnd: endDateUTC
        })

        const startLocalDate = formatDate(startDateUTC);
        const endLocalDate = formatDate(endDateUTC);

        const report = reportBestAndWorstProducts({
            title: titulo,
            subtitle: sbtitulo,
            username: normalizeFullName(fullName),
            dayStart: startLocalDate,
            dayEnd: endLocalDate,
            products: products
        });

        return this.printerService.createPdf(report);

    }

    // ** Método para generar el reporte de los productos menos vendidos
    async worstSellingProducts(worstProductsDto: ReportWorstProductsDto){
        const { userId, daydate, period } = worstProductsDto;

        // Obtener el usuario autenticado
        const user = await this.authService.findOne(userId);
        const fullName = `${user.firstName} ${user.paternalSurname} ${user.maternalSurname}`;

        // La fecha viene en zona de méxico o cualquier otra, pero no en UTC.
        const offesetTimezone = daydate.getTimezoneOffset();
        const hoursOffset = offesetTimezone / 60;
        
        // Extraer el año, mes y día de la fecha proporcionada
        const year = daydate.getFullYear();
        const month = daydate.getMonth();
        const day = daydate.getDate();
        
        // variable para los datos del reporte
        let titulo = '';
        let sbtitulo = '';
        let startDateUTC: Date;
        let endDateUTC: Date;
        if(period === 'month'){
            titulo = 'Reporte de Productos Menos Vendidos del Mes';
            sbtitulo = 'Este reporte muestra los 50 productos menos vendidos del mes.';
            
            // Para el mes, se toma el primer día del mes y el último día del mes.
            // Se ajusta la hora a UTC.                   v <- este es el día 1 del mes
            startDateUTC = new Date(Date.UTC(year, month, 1, hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(year, month + 1, 1, hoursOffset - 1, 59,59, 999));
        } else if(period === 'week'){

            titulo = 'Reporte de Productos Menos Vendidos de la Semana';
            sbtitulo = 'Este reporte muestra los 50 productos menos vendidos de la semana.';
            
            // Para la semana, se toma el primer día de la semana (domingo) y el último día de la semana (sábado).
            const firstDayOfWeek = new Date(year, month, day - daydate.getDay());
            const lastDayOfWeek = new Date(year, month, day + (6 - daydate.getDay()));

            startDateUTC = new Date(Date.UTC(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate(), hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate(), hoursOffset - 1, 60, 60, 999));

        } else if(period === 'day'){

            titulo = 'Reporte de Productos Menos Vendidos del Día';
            sbtitulo = 'Este reporte muestra los 50 productos menos vendidos del día.';
            
            // Para el día, se toma la fecha proporcionada y se ajusta a UTC.
            startDateUTC = new Date(Date.UTC(year, month, day, hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(year, month, day + 1, hoursOffset - 1, 59, 59, 999));

        } else{
            throw new BadRequestException('Periodo no válido. Debe ser "month", "week" o "day".');
        }

        const products = await this.saleItemsService.findWorstProducts({
            dayStart: startDateUTC,
            dayEnd: endDateUTC
        })

        const startLocalDate = formatDate(startDateUTC);
        const endLocalDate = formatDate(endDateUTC);

        const report = reportBestAndWorstProducts({
            title: titulo,
            subtitle: sbtitulo,
            username: normalizeFullName(fullName),
            dayStart: startLocalDate,
            dayEnd: endLocalDate,
            products: products
        });

        return this.printerService.createPdf(report);
    }

    // ** Método para generar el reporte de los productos que no se han vendido
    async noSellingProducts(noSalesProductsDto: ReportNoSaleProductsDto) {

        const { userId, daydate, period } = noSalesProductsDto;

        // Obtener el usuario autenticado
        const user = await this.authService.findOne(userId);
        const fullName = `${user.firstName} ${user.paternalSurname} ${user.maternalSurname}`;


        // La fecha viene en zona de méxico o cualquier otra, pero no en UTC.
        const offesetTimezone = daydate.getTimezoneOffset();
        const hoursOffset = offesetTimezone / 60;
        
        // Extraer el año, mes y día de la fecha proporcionada
        const year = daydate.getFullYear();
        const month = daydate.getMonth();
        const day = daydate.getDate();
        
        // variable para los datos del reporte
        let titulo = '';
        let sbtitulo = '';
        let startDateUTC: Date;
        let endDateUTC: Date;
        if(period === 'month'){
            titulo = 'Reporte de Productos No Vendidos del Mes';
            sbtitulo = 'Este reporte muestra todos los productos no vendidos del mes.';
            
            // Para el mes, se toma el primer día del mes y el último día del mes.
            // Se ajusta la hora a UTC.                   v <- este es el día 1 del mes
            startDateUTC = new Date(Date.UTC(year, month, 1, hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(year, month + 1, 1, hoursOffset - 1, 59,59, 999));
        } else if(period === 'week'){

            titulo = 'Reporte de Productos No Vendidos de la Semana';
            sbtitulo = 'Este reporte muestra todos los productos no vendidos de la semana.';
            
            // Para la semana, se toma el primer día de la semana (domingo) y el último día de la semana (sábado).
            const firstDayOfWeek = new Date(year, month, day - daydate.getDay());
            const lastDayOfWeek = new Date(year, month, day + (6 - daydate.getDay()));

            startDateUTC = new Date(Date.UTC(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate(), hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate(), hoursOffset - 1, 60, 60, 999));

        } else if(period === 'day'){

            titulo = 'Reporte de Productos No Vendidos del Día';
            sbtitulo = 'Este reporte muestra todos los productos no vendidos del día.';
            
            // Para el día, se toma la fecha proporcionada y se ajusta a UTC.
            startDateUTC = new Date(Date.UTC(year, month, day, hoursOffset, 0, 0));
            endDateUTC = new Date(Date.UTC(year, month, day + 1, hoursOffset - 1, 59, 59, 999));

        } else{
            throw new BadRequestException('Periodo no válido. Debe ser "month", "week" o "day".');
        }

        // Hacemos la consulta para traer los productos que no se venden
        const products = await this.productsService.findNoSalesProducts({
            dayStart: startDateUTC,
            dayEnd: endDateUTC
        })
        const startLocalDate = formatDate(startDateUTC);
        const endLocalDate = formatDate(endDateUTC);

        const report = noSaleProductsReport({
            title: titulo,
            subtitle: sbtitulo,
            username: normalizeFullName(fullName),
            dayStart: startLocalDate,
            dayEnd: endLocalDate,
            products: products
        });

        return this.printerService.createPdf(report);
    }

    // ** Método para generar el reporte del stock
    async stockProducts(stockProductsDto: StockProductsReportDto){

        const {userId, daydate} = stockProductsDto;

         // Obtener el usuario autenticado
        const user = await this.authService.findOne(userId);
        const fullName = `${user.firstName} ${user.paternalSurname} ${user.maternalSurname}`;

        const stockProducts = await this.productsService.findStockProducts();

        const document = stockReport({
            username: normalizeFullName(fullName),
            dayStart: formatDate(daydate),
            stockProducts: stockProducts
        });

        return this.printerService.createPdf(document);

    }
 }
