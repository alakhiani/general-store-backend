import express from 'express';
import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router: Router = express.Router();
const productController: ProductController = new ProductController();

router.get('/', productController.getProducts);

export default router;
