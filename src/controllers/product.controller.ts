import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { IProduct } from '../models/product.model';

export class ProductController {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
        // Bind the 'this' context explicitly else the product service object will be undefined
        this.productService = productService;
        this.getProducts = this.getProducts.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    public async getProducts(req: Request, res: Response) {
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

    public async getProduct(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In getProduct");
            const product = await this.productService.getProduct(req.params.id);
            res.status(200).json({
                status: 'success',
                data: product
            });
        } catch (err) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Product could not be retrieved.',
                details: err
            });
        }
    }

    public async createProduct(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In createProduct");

            // Extract the validated data from the request body
            const { name, price, description, imageUrl } = req.body;

            // Construct the product object
            const product: Partial<IProduct & Document> = {
                name,
                price,
                description: description || undefined,
                imageUrl,
            };

            // Call the createProduct method in the service
            const createdProduct = await this.productService.createProduct(product as IProduct);

            // Return the response
            res.status(201).json({
                status: 'success',
                data: createdProduct,
            });
        } catch (err) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Product creation failed.',
                details: err
            });
        }
    }

    public async updateProduct(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In updateProduct");
            const product = await this.productService.updateProduct(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: product,
            });
        } catch (err) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Product update failed.',
                details: err
            });
        }
    }

    public async deleteProduct(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In deleteProduct");
            const product = await this.productService.deleteProduct(req.params.id);
            res.status(204).end();
        } catch (err) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Product deletion failed.',
                details: err
            });
        }
    }
}