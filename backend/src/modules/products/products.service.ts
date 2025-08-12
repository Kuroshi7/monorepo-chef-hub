import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from '../auth/dto/create-product.dto';
import { EntityManager } from '@mikro-orm/core';


@Injectable()
export class ProductsService {
  constructor(
    private readonly em: EntityManager, 
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.findAll();
  }

  async FindOne(id: number): Promise<Product | null> {
    return this.productRepo.findOne({id});
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    await this.em.persistAndFlush(product);
    return product;
  }

  async update(id: number, dto: Partial<CreateProductDto>): Promise<Product | null> {
    const product = await this.productRepo.findOneOrFail(id);
    this.productRepo.assign(product, dto);
    await this.em.flush();
    return product;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepo.findOneOrFail(id);
    await this.em.removeAndFlush(product);
  }

}