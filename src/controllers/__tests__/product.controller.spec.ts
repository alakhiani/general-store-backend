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
    let responseObject: any = {};
    let mockedProducts: Partial<IProduct>[] = [];

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

        // (global.console.log as jest.Mock) = jest.fn();
        // (global.console.error as jest.Mock) = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    test('should call ProductService.getProducts', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = mockedProducts;
        const productService = new ProductService();
        (productService.getProducts as jest.MockedFunction<any>).mockResolvedValue(mockedProducts);
        const productController = new ProductController();

        console.log(mockedProducts);

        // Act
        await productController.getProducts(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        // expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        // expect(mockResponse.json).toHaveBeenCalledWith({
        //     status: 'success',
        //     data: expectedResponse,
        // });
    });
});
