import { Entity, PrimaryKey, Property, ManyToMany, Collection, Enum } from '@mikro-orm/core';
import { Product } from './product.entity';

export enum PaymentMethod {
    PIX = 'pix',
    CASH = 'dinheiro',
    CARD = 'cartao'
}

export enum OrderStatus {
    PENDING = 'pendente',
    PREPARING = 'preparando',
    READY = 'pronto',
}

@Entity()
export class Order {
    @PrimaryKey()
    id!: number;

    @ManyToMany(() => Product)
    products = new Collection<Product>(this);

    @Property({type: 'decimal', precision: 10, scale: 2})
    total!: string;

    @Enum(() => PaymentMethod)
    paymentMethod!: PaymentMethod;

    @Enum({items: () => OrderStatus, default: OrderStatus.PENDING})
    status: OrderStatus = OrderStatus.PENDING;

    @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}

