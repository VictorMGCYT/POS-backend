import { Body, Controller, Post, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { ReportBestProductsMonthDto } from './dtos/report-best-products-month.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('best-products')
  @ApiOperation({
    summary: 'Genera un con los 50 productos más vendidos',
    description: 'Este endpoint genera un reporte en PDF con los 50 productos más vendidos mesualmente.',
  })
  async getBestSellingProductsMonth(
    @Res() res: Response, 
    @Body() bestProductsDto: ReportBestProductsMonthDto
  ) {

    const pdfDocument = await this.reportsService.bestSellingProductsMonth(bestProductsDto);

    // Colocar los headers necesarios para la descarga del PDF
    res.setHeader('Content-Type', 'application/pdf');
    pdfDocument.info.Title = 'Reporte de Productos Más Vendidos';
    pdfDocument.pipe(res);
    pdfDocument.end();
  }

}
