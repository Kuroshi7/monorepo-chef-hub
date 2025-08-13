import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "../auth/dto/create-order.dto";
import { Order } from "src/entities/order.entity";
import { UpdateOrderStatusDto } from "../auth/dto/update-order-status.dto";
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Cria um novo pedido.
   */
  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(dto); 
  }

  /**
   * Retorna todos os pedidos.
   */
  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  /**
   * Retorna um pedido específico pelo ID.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  /**
   * Atualiza o status de um pedido.
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, dto.status);
  }

  /**
   * Deleta um pedido.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.delete(id);
  }
}