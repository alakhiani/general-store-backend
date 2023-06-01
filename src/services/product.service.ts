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

    async getProduct(id: string): Promise<IProduct | null> {
        const product: IProduct | null = await this.productModel.findById(id).lean().exec();
        if (process.env.LOG_LEVEL === 'trace' && product) console.log(`➤ [service]: Got back ${JSON.stringify(product)}`);
        return product;
    }

    async createProduct(product: IProduct): Promise<IProduct> {
        const createdProduct: IProduct = await this.productModel.create(product);
        if (process.env.LOG_LEVEL === 'trace' && createdProduct) console.log(`➤ [service]: Created ${JSON.stringify(createdProduct)}`);
        return createdProduct;
    }

    async updateProduct(id: string, product: IProduct): Promise<IProduct | null> {
        const updatedProduct: IProduct | null = await this.productModel.findByIdAndUpdate(
            id,
            product,
            { new: true, runValidators: true }
        ).lean().exec();

        if (!updatedProduct) {
            throw new Error(`Product with id ${id} not found.`);
        }

        if (process.env.LOG_LEVEL === 'trace') {
            console.log(`➤ [service]: Updated ${JSON.stringify(updatedProduct)}`);
        }

        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<IProduct | null> {
        const deletedProduct: IProduct | null = await this.productModel.findByIdAndDelete(id).lean().exec();
        if (process.env.LOG_LEVEL === 'trace' && deletedProduct) console.log(`➤ [service]: Deleted ${JSON.stringify(deletedProduct)}`);
        return deletedProduct;
    }
}