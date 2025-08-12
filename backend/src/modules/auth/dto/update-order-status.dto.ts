import { IsEnum } from "class-validator";
import { OrderStatus } from "src/entities/order.entity";

export class UpdateOrderStatusDto{
    @IsEnum(OrderStatus)
    status!: OrderStatus;
}