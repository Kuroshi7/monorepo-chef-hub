import { Entity, Primary, Property, Enum, PrimaryKey } from "@mikro-orm/core";

export enum ProductCategory {
  FOOD = 'comida',
  DRINK = 'bebida',
  DESSERT = 'sobremesa',
}

@Entity()
export class Product {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({type: 'float'})
    price!: number;
    
    @Enum(() => ProductCategory)
    category!: ProductCategory;
}