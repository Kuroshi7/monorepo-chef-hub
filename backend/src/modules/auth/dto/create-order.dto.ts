import { IsArray, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { PaymentMethod } from "src/entities/order.entity";


export class CreateOrderDto{
    @IsArray()
    @IsNumber({}, { each: true })
    productsIds!: number[];


    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    paymentMethod!: PaymentMethod;
}