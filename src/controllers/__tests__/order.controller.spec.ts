import Chance from 'chance';
import { Request, Response } from 'express';
import { OrderController } from '../order.controller';
import { OrderService } from '../../services/order.service';
import { IOrder } from '../../models/order.model';

// Chance lib to mock data
const chance = new Chance();

describe('OrderController::getOrders', () => {

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockOrders: Partial<IOrder>[] = [];
    let mockOrderService: OrderService;
    let orderController: OrderController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockOrders = [
            {
                firstName: chance.first(),
                lastName: chance.last(),
                address1: chance.address(),
                address2: undefined, // optional
                city: chance.city(),
                state: chance.state(),
                zip: chance.zip(),
                country: chance.country(),
                phone: chance.phone(),
                email: chance.email(),
                orderTotal: chance.floating({ min: 0, max: 100 }),
                items: [
                    {
                        productId: chance.guid(),
                        quantity: chance.integer({ min: 1, max: 10 }),
                        price: chance.floating({ min: 0, max: 100 }),
                    },
                ],
            },
            {
                firstName: chance.first(),
                lastName: chance.last(),
                address1: chance.address(),
                address2: undefined, // optional
                city: chance.city(),
                state: chance.state(),
                zip: chance.zip(),
                country: chance.country(),
                phone: chance.phone(),
                email: chance.email(),
                orderTotal: chance.floating({ min: 0, max: 100 }),
                items: [
                    {
                        productId: chance.guid(),
                        quantity: chance.integer({ min: 1, max: 10 }),
                        price: chance.floating({ min: 0, max: 100 }),
                    },
                ],
            },
        ];

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockOrderService = {
            getOrders: jest.fn().mockResolvedValue(mockOrders),
        } as unknown as OrderService;
        orderController = new OrderController(mockOrderService);
    });

    test('+ve: should call OrderService.getOrders to get all the orders', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = mockOrders;

        // Act
        await orderController.getOrders(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.getOrders).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedResponse,
        });
    });

    test('+ve: getOrders should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.getOrders(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In getOrders');
    });

    test('+ve: getOrders should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            getOrders: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.getOrders(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: getOrders should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.getOrders(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it("-ve: should call res.status with 500 when OrderService.getOrders fails", async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            getOrders: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.getOrders(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);

        // Assert
        expect(mockOrderService.getOrders).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Orders could not be retrieved.',
            details: mockError.message,
        });
    });
});

describe('OrderController::getOrder', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let orderId = chance.guid();
    let mockOrder: Partial<IOrder>;
    let mockOrderService: OrderService;
    let orderController: OrderController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockOrder = {
            firstName: chance.first(),
            lastName: chance.last(),
            address1: chance.address(),
            address2: undefined, // optional
            city: chance.city(),
            state: chance.state(),
            zip: chance.zip(),
            country: chance.country(),
            phone: chance.phone(),
            email: chance.email(),
            orderTotal: chance.floating({ min: 0, max: 100 }),
            items: [
                {
                    productId: chance.guid(),
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
            ],
        };

        mockRequest = {
            params: {
                id: orderId,
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the getOrder method in the OrderService
        mockOrderService = {
            getOrder: jest.fn().mockResolvedValue(mockOrder),
        } as unknown as OrderService;

        orderController = new OrderController(mockOrderService);
    });

    test('+ve: should get a order', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = {
            status: 'success',
            data: mockOrder,
        };

        // Act
        await orderController.getOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.getOrder).toHaveBeenCalledWith(orderId);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: getOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.getOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In getOrder');
    });

    test('+ve: getOrder should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            getOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.getOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: getOrder should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.getOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when OrderService.getOrder fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            getOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.getOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.getOrder).toHaveBeenCalledWith(orderId);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Order could not be retrieved.',
            details: mockError.message,
        });
    });
});

describe('OrderController::createOrder', () => {

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockOrder: Partial<IOrder>;
    let mockOrderService: OrderService;
    let orderController: OrderController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockOrder = {
            firstName: chance.first(),
            lastName: chance.last(),
            address1: chance.address(),
            address2: undefined, // optional
            city: chance.city(),
            state: chance.state(),
            zip: chance.zip(),
            country: chance.country(),
            phone: chance.phone(),
            email: chance.email(),
            orderTotal: chance.floating({ min: 0, max: 100 }),
            items: [
                {
                    productId: chance.guid(),
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
            ],
        };

        mockRequest = {
            body: mockOrder,
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the createOrder method in the OrderService
        mockOrderService = {
            createOrder: jest.fn().mockResolvedValue(mockOrder),
        } as unknown as OrderService;
        orderController = new OrderController(mockOrderService);
    });

    test('+ve: should create a new order', async () => {
        // Arrange
        const expectedStatusCode = 201;
        const expectedResponse = {
            status: 'success',
            data: mockOrder, // Use newOrder as the data object in the response
        };

        // Act
        await orderController.createOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.createOrder).toHaveBeenCalledWith(expect.objectContaining(mockOrder));
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: should create a new order with address2 undefined', async () => {
        // Arrange
        const mockOrderUndefinedDescription: Partial<IOrder> = {
            firstName: chance.first(),
            lastName: chance.last(),
            address1: chance.address(),
            address2: undefined, // optional
            city: chance.city(),
            state: chance.state(),
            zip: chance.zip(),
            country: chance.country(),
            phone: chance.phone(),
            email: chance.email(),
            orderTotal: chance.floating({ min: 0, max: 100 }),
            items: [
                {
                    productId: chance.guid(),
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
            ],
        };

        const mockRequest = {
            body: mockOrderUndefinedDescription,
        };

        // Mock the createOrder method in the OrderService
        mockOrderService.createOrder = jest.fn().mockResolvedValue(mockOrderUndefinedDescription);
        const expectedStatusCode = 201;
        const expectedResponse = {
            status: 'success',
            data: mockOrderUndefinedDescription,
        };

        // Act
        await orderController.createOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.createOrder).toHaveBeenCalledWith(expect.objectContaining(mockOrderUndefinedDescription));
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: createOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.createOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In createOrder');
    });

    test('+ve: createOrder should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            createOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.createOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: createOrder should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.createOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when OrderService.createOrder fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            createOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.createOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Order could not be created.',
            details: mockError.message,
        });
    });
});

describe('OrderController::updateOrder', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let orderId = chance.guid();
    let updatedName = 'Updated Order';
    let mockOrder: Partial<IOrder>;
    let mockOrderService: OrderService;
    let orderController: OrderController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockOrder = {
            firstName: chance.first(),
            lastName: chance.last(),
            address1: chance.address(),
            address2: undefined, // optional
            city: chance.city(),
            state: chance.state(),
            zip: chance.zip(),
            country: chance.country(),
            phone: chance.phone(),
            email: chance.email(),
            orderTotal: chance.floating({ min: 0, max: 100 }),
            items: [
                {
                    productId: chance.guid(),
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
            ],
        };

        mockRequest = {
            params: {
                id: orderId,
            },
            body: {
                name: updatedName,
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the updateOrder method in the OrderService
        mockOrderService = {
            updateOrder: jest.fn().mockResolvedValue(mockOrder),
        } as unknown as OrderService;

        orderController = new OrderController(mockOrderService);
    });

    test('+ve: should update a order', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = {
            status: 'success',
            data: mockOrder,
        };

        // Act
        await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.updateOrder).toHaveBeenCalledWith(orderId, {
            name: updatedName,
        });
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: updateOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In updateOrder');
    });

    test('+ve: updateOrder should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            updateOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: updateOrder should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when OrderService.updateOrder fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            updateOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.updateOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.updateOrder).toHaveBeenCalledWith(orderId, {
            name: updatedName,
        });
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Order could not be updated.',
            details: mockError.message,
        });
    });
});

describe('OrderController::deleteOrder', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let orderId = chance.guid();
    let mockOrder: Partial<IOrder>;
    let mockOrderService: OrderService;
    let orderController: OrderController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockOrder = {
            firstName: chance.first(),
            lastName: chance.last(),
            address1: chance.address(),
            address2: undefined, // optional
            city: chance.city(),
            state: chance.state(),
            zip: chance.zip(),
            country: chance.country(),
            phone: chance.phone(),
            email: chance.email(),
            orderTotal: chance.floating({ min: 0, max: 100 }),
            items: [
                {
                    productId: chance.guid(),
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
            ],
        };

        mockRequest = {
            params: {
                id: orderId,
            },
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        };

        // Mock the deleteOrder method in the OrderService
        mockOrderService = {
            deleteOrder: jest.fn().mockResolvedValue(mockOrder),
        } as unknown as OrderService;

        orderController = new OrderController(mockOrderService);
    });

    test('+ve: should delete a order', async () => {
        // Arrange
        const expectedStatusCode = 204;

        // Act
        await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockOrderService.deleteOrder).toHaveBeenCalledWith(orderId);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.end).toHaveBeenCalled();
    });

    test('+ve: deleteOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In deleteOrder');
    });

    test('+ve: deleteOrder should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            deleteOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: deleteOrder should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when OrderService.deleteOrder fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockOrderService: OrderService = {
            deleteOrder: jest.fn().mockRejectedValue(mockError),
        } as unknown as OrderService;
        const orderController = new OrderController(mockOrderService);

        // Act
        await orderController.deleteOrder(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Order could not be deleted.',
            details: mockError.message,
        });
    });
});
