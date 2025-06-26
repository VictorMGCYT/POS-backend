import { Controller, Get, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-report')
  @ApiOperation({
    summary: 'Genera un reporte diario en formato PDF',
    description: 'Este endpoint genera un reporte diario y lo devuelve como un archivo PDF.'
  })
  async getReportPerDay(@Res() res: Response) {

    const pdfDocument = await this.reportsService.getReportPerDay();

    // Colocar los headers necesarios para la descarga del PDF
    res.setHeader('Content-Type', 'application/pdf');
    pdfDocument.info.Title = 'Reporte Diario';
    pdfDocument.pipe(res);
    pdfDocument.end();
  }

}
