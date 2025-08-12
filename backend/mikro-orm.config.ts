
import { Product } from './src/entities/product.entity';
import { User } from './src/entities/user.entity';
import { defineConfig } from '@mikro-orm/sqlite';

export default defineConfig({


  dbName: 'data/database.sqlite',


  entities: [User, Product], 
  entitiesTs: ['./src/entities'], 


  migrations: {
    path: './dist/migrations', 
    pathTs: './migrations', 
  },


  debug: process.env.NODE_ENV !== 'production',
});