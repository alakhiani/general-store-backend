import { Request, Response } from 'express';
import ProductService from '../services/product.service';

class ProductController {
    static async getProducts(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In getProducts");
            const products = await ProductService.getProducts();
            res.status(200).json({
                status: 'success',
                data: products
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: 'Products could not be retrieved.',
                details: err
            });
        }
    }
}

export default ProductController;