import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { OrdersService } from "../orders/orders.service";


@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController{
    constructor(private readonly orderService: OrdersService){}

    @Get('metrics')
    async getDashboardMetrics(){
        return this.orderService.getDailyMetrics();
    }
}