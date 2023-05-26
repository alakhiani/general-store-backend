import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
        // Bind the 'this' context explicitly else the product service object will be undefined
        this.getProducts = this.getProducts.bind(this);
    }

    public async getProducts (req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In getProducts");
            const products = await this.productService.getProducts();
            res.status(200).json({
                status: 'success',
                data: products
            });
        } catch (err) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Products could not be retrieved.',
                details: err
            });
        }
    }
}