import Chance from "chance";
import { IOrder } from "../../models/order.model";
import { OrderService } from "../order.service";
import { Model } from "mongoose";
import { IProduct } from "../../models/product.model";

const chance = new Chance();
// Mock the Product model
const mockProductModel = {
    exists: jest.fn().mockReturnValue(true)
} as unknown as Model<IProduct>;

describe('OrderService::getOrders', () => {

    let mockOrders: Partial<IOrder>[] = [];
    let orderService: OrderService;
    let mockOrderModel: Model<IOrder>;

    beforeEach(() => {

        jest.clearAllMocks();

        // Mock orders data
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

        // Mock the Order model
        mockOrderModel = {
            find: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(mockOrders),
        } as unknown as Model<IOrder>;

        orderService = new OrderService(mockOrderModel, mockProductModel);
    })

    test('+ve: should call find and get back orders', async () => {

        // Act
        const result = await orderService.getOrders();

        // Assert        
        expect(mockOrderModel.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockOrders);
    });

    test('+ve: getOrders should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.getOrders();

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Got back ${mockOrders.length} orders`);
    });

    test('+ve: getOrders should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.getOrders();

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });
});

describe('OrderService::getOrder', () => {
    let mockOrderId: string;
    let mockOrder: Partial<IOrder>;
    let orderService: OrderService;
    let mockOrderModel: Model<IOrder>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock order data
        mockOrderId = chance.guid();
        mockOrder = {
            _id: mockOrderId,
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

            // Mock the Order model
            mockOrderModel = {
                findById: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockOrder),
            } as unknown as Model<IOrder>;

        orderService = new OrderService(mockOrderModel, mockProductModel);
    });

    test('+ve: should call findById and get back the order', async () => {
        // Act
        const result = await orderService.getOrder(mockOrderId);

        // Assert
        expect(mockOrderModel.findById).toHaveBeenCalledWith(mockOrderId);
        expect(result).toEqual(mockOrder);
    });

    test('+ve: getOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.getOrder(mockOrderId);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Got back ${JSON.stringify(mockOrder)}`);
    });

    test('+ve: getOrder should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.getOrder(mockOrderId);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });
});

describe('OrderService::createOrder', () => {
    let orderService: OrderService;
    let mockOrderId: string = chance.guid();
    let mockProductId1: string = chance.guid();
    let mockProductId2: string = chance.guid();
    let mockOrder: Partial<IOrder>;
    let mockCreatedOrder: Partial<IOrder>;
    let mockOrderModel: Model<IOrder>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock order data
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
                    productId: mockProductId1,
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
                {
                    productId: mockProductId2,
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
            ],
        };

        mockCreatedOrder = { ...mockOrder, _id: mockOrderId };

        // Mock the Order model
        mockOrderModel = {
            create: jest.fn().mockResolvedValue(mockCreatedOrder),
        } as unknown as Model<IOrder>;

        orderService = new OrderService(mockOrderModel, mockProductModel);
    });

    test('+ve: should create a new order', async () => {
        // Act
        const result = await orderService.createOrder(mockOrder as IOrder);

        // Assert
        expect(mockProductModel.exists).toHaveBeenCalledTimes(2);
        expect(mockProductModel.exists).toHaveBeenCalledWith({ _id: mockProductId1 });
        expect(mockProductModel.exists).toHaveBeenCalledWith({ _id: mockProductId2 });

        expect(mockOrderModel.create).toHaveBeenCalledWith(mockOrder);
        expect(result).toEqual(mockCreatedOrder);
    });

    test('+ve: createOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.createOrder(mockOrder as IOrder);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Created ${JSON.stringify(mockCreatedOrder)}`);
    });

    test('+ve: createOrder should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.createOrder(mockOrder as IOrder);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should throw an error if any product does not exist', async () => {

        // Mock the Product model
        const mockProductModel = {
            exists: jest.fn().mockReturnValue(false)
        } as unknown as Model<IProduct>;

        orderService = new OrderService(mockOrderModel, mockProductModel);

        await expect(orderService.createOrder(mockOrder as IOrder)).rejects.toThrow(
            `Invalid productId '${mockProductId1}'. The product does not exist.`
        );

        expect(mockProductModel.exists).toHaveBeenCalledTimes(1);
        expect(mockProductModel.exists).toHaveBeenCalledWith({ _id: mockProductId1 });
        expect(mockOrderModel.create).not.toHaveBeenCalled();
    });
});

describe('OrderService::updateOrder', () => {
    let orderService: OrderService;
    let mockOrderId: string = chance.guid();
    let mockProductId1: string = chance.guid();
    let mockProductId2: string = chance.guid();
    let mockOrder: Partial<IOrder>;
    let mockUpdatedOrder: Partial<IOrder>;
    let mockOrderModel: Model<IOrder>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock order data
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
                    productId: mockProductId1,
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
                {
                    productId: mockProductId2,
                    quantity: chance.integer({ min: 1, max: 10 }),
                    price: chance.floating({ min: 0, max: 100 }),
                },
            ],
        };

        mockUpdatedOrder = { ...mockOrder, _id: mockOrderId };

        // Mock the Order model
        mockOrderModel = {
            findByIdAndUpdate: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(mockUpdatedOrder)
                })
            }),
        } as unknown as Model<IOrder>;

        orderService = new OrderService(mockOrderModel, mockProductModel);
    });

    test('+ve: should update the order', async () => {
        // Act
        const result = await orderService.updateOrder(mockOrderId, mockOrder as IOrder);

        // Assert
        expect(mockProductModel.exists).toHaveBeenCalledTimes(2);
        expect(mockProductModel.exists).toHaveBeenCalledWith({ _id: mockProductId1 });
        expect(mockProductModel.exists).toHaveBeenCalledWith({ _id: mockProductId2 });

        expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(mockOrderId, mockOrder, { new: true, runValidators: true });
        expect(result).toEqual(mockUpdatedOrder);
    });

    test('+ve: updateOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.updateOrder(mockOrderId, mockOrder as IOrder);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Updated ${JSON.stringify(mockUpdatedOrder)}`);
    });

    test('+ve: updateOrder should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.updateOrder(mockOrderId, mockOrder as IOrder);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should throw an error when the order ID is not found', async () => {
        // Arrange
        const nonExistingOrderId = chance.guid();
        const updatedOrder: Partial<IOrder> = {
            firstName: 'Updated First Name',
            orderTotal: chance.floating({ min: 0, max: 100 }),
            items: [],
        };
        const mockOrderModel: Model<IOrder> = {
            findByIdAndUpdate: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            }),
        } as unknown as Model<IOrder>;
        const orderService = new OrderService(mockOrderModel, mockProductModel);

        // Act and Assert
        await expect(orderService.updateOrder(nonExistingOrderId, updatedOrder as IOrder)).rejects.toThrow(Error);
        expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
            nonExistingOrderId,
            updatedOrder,
            { new: true, runValidators: true }
        );
    });

    it('-ve: should throw an error if any product does not exist', async () => {

        // Mock the Product model
        const mockProductModel = {
            exists: jest.fn().mockReturnValue(false)
        } as unknown as Model<IProduct>;

        orderService = new OrderService(mockOrderModel, mockProductModel);

        await expect(orderService.updateOrder(mockOrderId, mockOrder as IOrder)).rejects.toThrow(
            `Invalid productId '${mockProductId1}'. The product does not exist.`
        );

        expect(mockProductModel.exists).toHaveBeenCalledTimes(1);
        expect(mockProductModel.exists).toHaveBeenCalledWith({ _id: mockProductId1 });
        expect(mockOrderModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
});

describe('OrderService::deleteOrder', () => {
    let orderService: OrderService;
    let mockOrderId: string = chance.guid();
    let mockOrder: Partial<IOrder>;
    let mockDeletedOrder: Partial<IOrder>;
    let mockOrderModel: Model<IOrder>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock order data
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
        },

            mockDeletedOrder = { ...mockOrder, _id: mockOrderId };

        // Mock the Order model
        mockOrderModel = {
            findByIdAndDelete: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDeletedOrder) }) }),
        } as unknown as Model<IOrder>;

        orderService = new OrderService(mockOrderModel, mockProductModel);
    });

    test('+ve: should delete the order', async () => {
        // Act
        const result = await orderService.deleteOrder(mockOrderId);

        // Assert
        expect(mockOrderModel.findByIdAndDelete).toHaveBeenCalledWith(mockOrderId);
        expect(result).toEqual(mockDeletedOrder);
    });

    test('+ve: deleteOrder should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.deleteOrder(mockOrderId);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Deleted ${JSON.stringify(mockDeletedOrder)}`);
    });

    test('+ve: deleteOrder should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await orderService.deleteOrder(mockOrderId);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });
});
