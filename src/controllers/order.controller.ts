import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
    private orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
        // Bind the 'this' context explicitly else the order service object methods be undefined
        this.getOrders = this.getOrders.bind(this);
        this.getOrder = this.getOrder.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
    }

    public async getOrders(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In getOrders");
            const orders = await this.orderService.getOrders();
            res.status(200).json({
                status: 'success',
                data: orders
            });
        } catch (err: any) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Orders could not be retrieved.',
                details: err.message
            });
        }
    }

    public async getOrder(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In getOrder");
            const order = await this.orderService.getOrder(req.params.id);
            res.status(200).json({
                status: 'success',
                data: order
            });
        } catch (err: any) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Order could not be retrieved.',
                details: err.message
            });
        }
    }

    public async createOrder(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In createOrder");
            const order = await this.orderService.createOrder(req.body);
            res.status(201).json({
                status: 'success',
                data: order
            });
        } catch (err: any) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Order could not be created.',
                details: err.message
            });
        }
    }

    public async updateOrder(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In updateOrder");
            const order = await this.orderService.updateOrder(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: order
            });
        } catch (err: any) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Order could not be updated.',
                details: err.message
            });
        }
    }

    public async deleteOrder(req: Request, res: Response) {
        try {
            if (process.env.LOG_LEVEL === 'trace') console.log("➤ [controller]: In deleteOrder");
            await this.orderService.deleteOrder(req.params.id);
            res.status(204).end();
        } catch (err: any) {
            if (process.env.LOG_LEVEL === 'trace') console.log(err);
            res.status(500).json({
                status: 'error',
                message: 'Order could not be deleted.',
                details: err.message
            });
        }
    }
}