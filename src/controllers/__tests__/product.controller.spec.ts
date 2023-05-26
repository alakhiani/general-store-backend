import Chance from 'chance';
import { Request, Response } from 'express';
import { ProductController } from '../product.controller';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';

// Chance lib to mock data
const chance = new Chance();

jest.mock('../../services/product.service', () => {
    const mockedProductService = {
        getProducts: jest.fn(),
    };
    return { ProductService: jest.fn(() => mockedProductService) };
});

describe('When calling the ProductController getProducts method', () => {

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockedProducts: Partial<IProduct>[] = [];
    let productController: ProductController;
    let productService: ProductService;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockedProducts = [
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

        productService = new ProductService();
        (productService.getProducts as jest.MockedFunction<any>).mockResolvedValue(mockedProducts);
        productController = new ProductController(productService);
    });

    test('+ve: should call ProductService.getProducts', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = mockedProducts;

        // Act
        // debugger; // used to set a breakpoint
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });

    test('+ve: should call res.status with 200 when ProductService.getProducts succeeds', async () => {
        // Arrange
        const expectedStatusCode = 200;

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test('+ve: should call res.json with the mocked products when ProductService.getProducts succeeds', async () => {
        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'success',
            data: mockedProducts,
        });
    })

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
        //        (productService.getProducts as jest.MockedFunction<any>).mockRejectedValue(mockError);
        jest.spyOn(productService, 'getProducts').mockRejectedValue(mockError);
        const productController = new ProductController(productService);

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
        const productService = new ProductService();
        (productService.getProducts as jest.MockedFunction<any>).mockRejectedValue(mockError);
        const productController = new ProductController(productService);

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });
});
