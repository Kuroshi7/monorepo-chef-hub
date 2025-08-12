import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [MikroOrmModule.forFeature([Order, Product])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}