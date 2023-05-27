import { Model } from 'mongoose';
import { IProduct } from '../models/product.model';

export class ProductService {

    private productModel: Model<IProduct>;

    constructor(productModel: Model<IProduct>) {
        this.productModel = productModel;
    }

    async getProducts(): Promise<IProduct[]> {
        const products: IProduct[] = await this.productModel.find().lean().exec();
        if (process.env.LOG_LEVEL === 'trace' && products) console.log(`➤ [service]: Got back ${products.length} products`);
        return products;
    }
}