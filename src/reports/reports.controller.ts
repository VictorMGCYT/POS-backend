import { Body, Controller, Post, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { ReportBestProductsDto } from './dtos/report-best-products-month.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/auth/interfaces/user-roles.interface';
import { ReportWorstProductsDto } from './dtos/report-worst-products.dto';
import { ReportNoSaleProductsDto } from './dtos/report-nosales-products.dto';
import { StockProductsReportDto } from './dtos/report-stock.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('best-products')
  @Auth( UserRole.ADMIN )
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Genera un con los 50 productos más vendidos',
    description: 'Este endpoint genera un reporte en PDF con los 50 productos más vendidos por mes, semana o día.',
  })
  async getBestSellingProducts(
    @Res() res: Response, 
    @Body() bestProductsDto: ReportBestProductsDto
  ) {

    const pdfDocument = await this.reportsService.bestSellingProducts(bestProductsDto);

    // Colocar los headers necesarios para la descarga del PDF
    res.setHeader('Content-Type', 'application/pdf');
    pdfDocument.info.Title = 'Reporte de Productos Más Vendidos';
    pdfDocument.pipe(res);
    pdfDocument.end();
  }

  @Post('worst-products')
  @Auth( UserRole.ADMIN )
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Genera un reporte con los 50 productos menos vendidos',
    description: 'Este endpoint genera un reporte en PDF con los 50 productos menos vendidos por mes, semana o día.',
  })
  async getWorstSellingProducts(
    @Res() res: Response,
    @Body() worstProductsDto: ReportWorstProductsDto
  ){
    const pdfDocument = await this.reportsService.worstSellingProducts(worstProductsDto);

    // Colocar los headers necesarios para la descarga del PDF
    res.setHeader('Content-Type', 'application/pdf');
    pdfDocument.info.Title = 'Reporte de Productos Menos Vendidos';
    pdfDocument.pipe(res);
    pdfDocument.end();
  }

  @Post('no-sales')
  @Auth( UserRole.ADMIN )
  @ApiCookieAuth('jwt')
  @ApiOperation({
    summary: 'Genera un reporte con los productos que no tienen ventas',
    description: 'Este endpoint genera un reporte en PDF con los productos no vendidos por mes, semana o día.',
  })
  async getProductsNoSale(
    @Res() res: Response,
    @Body() noSalesProductsDto: ReportNoSaleProductsDto
  ) {
    const pdfDocument = await this.reportsService.noSellingProducts(noSalesProductsDto);

    res.setHeader('Content-Type', 'application/pdf');
    pdfDocument.info.Title = 'Repporte de productos sin ventas'
    pdfDocument.pipe(res);
    pdfDocument.end()
  }

  @Post('stock')
  @ApiOperation({
    summary: "Genera el reporte de todo el sock actual.",
    description: "Este endpoint genera un PDF del reporte de stock ordenado de mayor a menor"
  })
  async getStock(
    @Res() res: Response,
    @Body() stockProductsDto: StockProductsReportDto
  ) {
    const pdfDocument = await this.reportsService.stockProducts(stockProductsDto);

    res.setHeader("Content-Type", "application/pdf");
    pdfDocument.info.Title = "Reporte de Stock";
    pdfDocument.pipe(res);
    pdfDocument.end();
  }

}
