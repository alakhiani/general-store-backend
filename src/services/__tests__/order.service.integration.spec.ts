import request from 'supertest';
import { start, app } from '../../app';
import Order, { IOrder } from '../../models/order.model';
import mongoose from 'mongoose';

let server: any;
const ObjectId = mongoose.Types.ObjectId;

beforeAll(async () => {
    server = await start(Number(process.env.TEST_PORT_1) || 8004, process.env.TEST_DATABASE_URI || '');
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
})

describe('Order Service', () => {

    const orderOne: Partial<IOrder> = {
        firstName: 'order1',
        lastName: 'order1',
        address1: 'order1 address1',
        address2: 'order1 address2',
        city: 'order1 city',
        state: 'order1 state',
        zip: 'order1 zip',
        country: 'order1 country',
        phone: 'order1 phone',
        email: 'order1 email',
        orderTotal: 20.50,
        items: [
            {
                productId: new ObjectId().toString(),
                quantity: 1,
                price: 10.50
            },
            {
                productId: new ObjectId().toString(),
                quantity: 1,
                price: 10.00
            }
        ]
    };

    const orderTwo: Partial<IOrder> = {
        firstName: 'order2',
        lastName: 'order2',
        address1: 'order2 address1',
        address2: 'order2 address2',
        city: 'order2 city',
        state: 'order2 state',
        zip: 'order2 zip',
        country: 'order2 country',
        phone: 'order2 phone',
        email: 'order2 email',
        orderTotal: 20.50,
        items: [
            {
                productId: new ObjectId().toString(),
                quantity: 1,
                price: 10.50
            },
            {
                productId: new ObjectId().toString(),
                quantity: 1,
                price: 10.00
            }
        ]
    };

    it('should create a new orders and get them back from the database', async () => {
        // Clear the database first
        await Order.deleteMany();
        await Order.insertMany([orderOne, orderTwo]);

        const response = await request(app).get('/order');

        expect(response.statusCode).toBe(200);

        const orders = response.body.data;
        expect(Array.isArray(orders)).toBe(true);
        expect(orders.length).toBe(2);
        compareOrders(orders[0], orderOne);

        expect(orders[1].firstName).toBe(orderTwo.firstName);
    });
})

function compareOrders(databaseOrder: IOrder, inputOrder: Partial<IOrder>) {
    expect(databaseOrder.firstName).toBe(inputOrder.firstName);
    expect(databaseOrder.lastName).toBe(inputOrder.lastName);
    expect(databaseOrder.address1).toBe(inputOrder.address1);
    expect(databaseOrder.address2).toBe(inputOrder.address2);
    expect(databaseOrder.city).toBe(inputOrder.city);
    expect(databaseOrder.state).toBe(inputOrder.state);
    expect(databaseOrder.zip).toBe(inputOrder.zip);
    expect(databaseOrder.country).toBe(inputOrder.country);
    expect(databaseOrder.phone).toBe(inputOrder.phone);
    expect(databaseOrder.email).toBe(inputOrder.email);
    expect(databaseOrder.orderTotal).toBe(inputOrder.orderTotal);
    expect(databaseOrder.items?.length).toBe(inputOrder.items?.length);
    for (let i = 0; i < databaseOrder.items?.length; i++) {
        const inputOrderItems = inputOrder.items;
        if (inputOrderItems) {
            expect(databaseOrder.items[i].productId).toBe(inputOrderItems[i].productId);
            expect(databaseOrder.items[i].quantity).toBe(inputOrderItems[i].quantity);
            expect(databaseOrder.items[i].price).toBe(inputOrderItems[i].price);
        }
    }
}