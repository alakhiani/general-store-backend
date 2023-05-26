import express from 'express';
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';

const router: Router = express.Router();
const productService: ProductService = new ProductService();
const productController: ProductController = new ProductController(productService);

router.get('/', productController.getProducts);

export default router;
