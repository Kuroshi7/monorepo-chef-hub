import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/sqlite';
import { Order, OrderStatus, PaymentMethod } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { CreateOrderDto } from '../auth/dto/create-order.dto';


@Injectable()
export class OrdersService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Order)
    private readonly ordersRepo: EntityRepository<Order>,
  ) {}

    async createOrder(dto: CreateOrderDto): Promise<Order> {
    
    const products = await this.em.find(Product, { id: { $in: dto.productsIds } });

    if (!products.length || products.length !== dto.productsIds.length) {
      throw new NotFoundException('Um ou mais produtos não foram encontrados.');
    }

    
    const total = products.reduce((sum, p) => sum + parseFloat(p.price as any), 0);

    
    const order = new Order();
    order.products.set(products); 
    order.paymentMethod = dto.paymentMethod;
    order.total = total.toFixed(2); 

    await this.em.persistAndFlush(order);

    return order;
  }

    async findAll(): Promise<Order[]> {
        const orders = await this.ordersRepo.findAll({ populate: ['products'] }); 
        return orders;
    }

    async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepo.findOne({ id }, { populate: ['products'] }); 
    
    if (!order) {
        throw new NotFoundException('Pedido nao encontrado.');
    }
    
    return order;
    }

    async updateStatus(id: number, status: OrderStatus): Promise<Order> {
        const order = await this.findOne(id);
        order.status = status;
        await this.em.flush(); 
        return order;
    }

  
  async getDailyMetrics(): Promise<{ revenue: number; orderCount: number; averageTicket: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

   
    const orders = await this.em.find(Order, { createdAt: { $gte: today } });

    const orderCount = orders.length;
    const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total as any), 0);
    const averageTicket = orderCount > 0 ? revenue / orderCount : 0;

    return {
      revenue: parseFloat(revenue.toFixed(2)),
      orderCount,
      averageTicket: parseFloat(averageTicket.toFixed(2)),
    };
  }
}