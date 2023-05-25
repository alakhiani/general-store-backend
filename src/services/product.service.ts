import ProductModel, { IProduct } from '../models/product.model';

class ProductService {
    static async getProducts(): Promise<IProduct[]> {        
        const products: IProduct[] = await ProductModel.find().lean().exec();
        if (process.env.LOG_LEVEL === 'trace' && products) console.log(`➤ [service]: Got back ${products.length} products`);
        return products;
    }
}

export default ProductService;