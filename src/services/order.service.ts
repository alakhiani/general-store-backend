import { Model } from 'mongoose';
import { IOrder } from '../models/order.model';
import { IProduct } from '../models/product.model';

export class OrderService {
    private orderModel: Model<IOrder>;
    private productModel: Model<IProduct>;

    constructor(orderModel: Model<IOrder>, productModel: Model<IProduct>) {
        this.orderModel = orderModel;
        this.productModel = productModel;
    }

    async getOrders(): Promise<IOrder[]> {
        const orders: IOrder[] = await this.orderModel.find().lean().exec();
        if (process.env.LOG_LEVEL === 'trace' && orders) console.log(`➤ [service]: Got back ${orders.length} orders`);
        return orders;
    }

    async getOrder(id: string): Promise<IOrder | null> {
        const order: IOrder | null = await this.orderModel.findById(id).lean().exec();
        if (process.env.LOG_LEVEL === 'trace' && order) console.log(`➤ [service]: Got back ${JSON.stringify(order)}`);
        return order;
    }

    async createOrder(order: IOrder): Promise<IOrder> {
        // Check if each productId in the order items exists in the Product collection
        for (const item of order.items) {
            const productExists: any = await this.productModel.exists({ _id: item.productId });

            if (!productExists) {
                throw new Error(`Invalid productId '${item.productId}'. The product does not exist.`);
            }
        }

        // Create the order
        const createdOrder: IOrder = await this.orderModel.create(order);
        if (process.env.LOG_LEVEL === 'trace' && createdOrder) console.log(`➤ [service]: Created ${JSON.stringify(createdOrder)}`);
        return createdOrder;
    }

    async updateOrder(id: string, order: IOrder): Promise<IOrder | null> {
        // Check if each productId in the order items exists in the Product collection
        for (const item of order.items) {
            const productExists: any = await this.productModel.exists({ _id: item.productId });

            if (!productExists) {
                throw new Error(`Invalid productId '${item.productId}'. The product does not exist.`);
            }
        }

        const updatedOrder: IOrder | null = await this.orderModel
            .findByIdAndUpdate(id, order, { new: true, runValidators: true })
            .lean()
            .exec();

        if (!updatedOrder) {
            throw new Error(`Order with id ${id} not found.`);
        }

        if (process.env.LOG_LEVEL === 'trace') {
            console.log(`➤ [service]: Updated ${JSON.stringify(updatedOrder)}`);
        }

        return updatedOrder;
    }

    async deleteOrder(id: string): Promise<IOrder | null> {
        const deletedOrder: IOrder | null = await this.orderModel.findByIdAndDelete(id).lean().exec();
        if (process.env.LOG_LEVEL === 'trace' && deletedOrder) console.log(`➤ [service]: Deleted ${JSON.stringify(deletedOrder)}`);
        return deletedOrder;
    }
}
