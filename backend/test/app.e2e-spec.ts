import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('Products (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let productId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // cria usuario teste
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'admin', email: 'admin@admin.com', password: '123456' });

    // login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@admin.com', password: '123456' });

    
    token = loginResponse.body.token || loginResponse.body.access_token;
  });

  it('/products (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Product', price: 10.99, category: 'comida' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    productId = response.body.id;
    expect(response.body.name).toBe('Test Product');
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });

  it('/products/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 12.99 })
      .expect(200)
      .then(response => {
        expect(response.body.price).toBe(12.99);
      });
  });

  it('/products/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('Orders (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'admin', email: 'admin@admin.com', password: '123456' });

    
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@admin.com', password: '123456' });

    token = loginResponse.body.token || loginResponse.body.access_token;
  });

  it('/orders (GET)', () => {
    return request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(Array.isArray(response.body)).toBe(true);
      });
  });

  // assume que existe produto com ID 1
  it('/orders (POST)', () => {
    return request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ productsIds: [1], paymentMethod: 'pix' })
      .expect(201)
      .then(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.paymentMethod).toBe('pix');
      });
  });

  // assume que existe um pedido com ID 1
  it('/orders/:id/status (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/orders/1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'preparando' })
      .expect(200)
      .then(response => {
        expect(response.body.status).toBe('preparando');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});