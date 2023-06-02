import request from 'supertest';
import { start, app } from '../../app';
import Product, { IProduct } from '../../models/product.model';
import mongoose from 'mongoose';

let server: any;

beforeAll(async () => {
    server = await start(Number(process.env.TEST_PORT_2) || 8004, process.env.TEST_DATABASE_URI || '');
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
})

describe('Product Service', () => {

    const productOne = {
        name: 'product1',
        description: 'product1 description',
        price: 10.50,
        imageUrl: 'product1.jpg'
    }

    const productTwo = {
        name: 'product2',
        description: 'product2 description',
        price: 20.50,
        imageUrl: 'product2.jpg'
    }

    it('should create a new products and get them back from the database', async () => {
        // Clear the database first
        await Product.deleteMany();
        await Product.insertMany([productOne, productTwo]);

        const response = await request(app).get('/product');

        expect(response.statusCode).toBe(200);

        const products = response.body.data;
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(2);
        expect(products).toEqual(
            expect.arrayContaining([
                expect.objectContaining(productOne),
                expect.objectContaining(productTwo)
            ])
        )
    });
})