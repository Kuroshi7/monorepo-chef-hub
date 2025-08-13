import '@mikro-orm/sqlite';
import { Order } from './src/entities/order.entity';
import { Product } from './src/entities/product.entity';
import { User } from './src/entities/user.entity';
import { defineConfig, SqliteDriver } from '@mikro-orm/sqlite';

export default defineConfig({
  dbName: 'data/database.sqlite',
  driver: SqliteDriver,
  entities: [User, Product, Order],
  entitiesTs: ['./src/entities'],
  migrations: {
    path: './dist/migrations',
    pathTs: './migrations',
  },
  debug: process.env.NODE_ENV !== 'production',
});