import { Injectable } from '@nestjs/common';
import { reportDay } from 'src/assets/reports/report-day';
import { PrinterService } from 'src/printer/printer.service';


@Injectable()
export class ReportsService {
    // En el contructor se inyecta el servicio PrinterService
    // para poder utilizarlo en la generación de reportes.
    constructor(
        private readonly printerService: PrinterService, 
    ){}
    
    async getReportPerDay(){
        
        const report = reportDay();

        return this.printerService.createPdf(report);

    }

}
