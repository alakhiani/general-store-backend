import express from 'express';
import { Router } from 'express';
import { Model } from 'mongoose';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import OrderModel, { IOrder } from '../models/order.model';
import ProductModel, { IProduct } from '../models/product.model';
import { createOrderValidationRules } from '../validators/order.validator';

const router: Router = express.Router();
const orderModel: Model<IOrder> = OrderModel;
const productModel: Model<IProduct> = ProductModel;
const orderService: OrderService = new OrderService(orderModel, productModel);
const orderController: OrderController = new OrderController(orderService);

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('/', createOrderValidationRules, orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;
