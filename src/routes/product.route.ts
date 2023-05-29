import express from 'express';
import { Router } from 'express';
import { Model } from 'mongoose';
import { IProduct } from '../models/product.model';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import ProductModel from '../models/product.model';
import { createProductValidationRules } from '../validators/product.validator';

const router: Router = express.Router();
const productModel: Model<IProduct> = ProductModel;
const productService: ProductService = new ProductService(productModel);
const productController: ProductController = new ProductController(productService);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', createProductValidationRules, productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
