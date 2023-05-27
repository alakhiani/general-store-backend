import Chance from 'chance';
import { Request, Response } from 'express';
import { ProductController } from '../product.controller';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';

// Chance lib to mock data
const chance = new Chance();

describe('ProductController', () => {

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockProducts: Partial<IProduct>[] = [];
    let mockProductService: ProductService;
    let productController: ProductController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockProducts = [
            {
                name: chance.word(),
                description: chance.sentence(),
                price: chance.floating({ min: 0, max: 100 }),
                imageUrl: chance.url(),
            },
            {
                name: chance.word(),
                description: chance.sentence(),
                price: chance.floating({ min: 0, max: 100 }),
                imageUrl: chance.url(),
            },
        ];

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockProductService = {
            getProducts: jest.fn().mockResolvedValue(mockProducts),
        } as unknown as ProductService;
        productController = new ProductController(mockProductService);
    });

    test('+ve: should call ProductService.getProducts', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = mockProducts;

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.getProducts).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'success',
            data: expectedResponse,
        });
    });

    test('+ve: getProducts should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In getProducts');
    });

    test('+ve: getProducts should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            getProducts: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: getProducts should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it("-ve: should call res.status with 500 when ProductService.getProducts fails", async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            getProducts: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });
});
