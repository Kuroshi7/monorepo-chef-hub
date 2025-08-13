import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CreateProductDto } from '../auth/dto/create-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    /**
     * Cria novo produto.
     */
    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    /**
     * Retorna todos os produtos.
     */
    @Get()
    async findAll() {
        return this.productsService.findAll();
    }

    /**
     * Retorna um produto pelo ID.
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.FindOne(+id);
    }

    /**
     * Atualiza um produto.
     */
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
        return this.productsService.update(+id, updateProductDto);
    }

    /**
     * Remove um produto.
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}