import express from 'express';
import { Router } from 'express';
import ProductsController from '../controllers/product.controller';

const router: Router = express.Router();

router.get('/', ProductsController.getProducts);

export default router;
