import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { ProductCategory } from '../../../entities/product.entity';
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsEnum(ProductCategory)
    category: ProductCategory;
}