import Chance from 'chance';
import { Request, Response } from 'express';
import { ProductController } from '../product.controller';
import { ProductService } from '../../services/product.service';
import { IProduct } from '../../models/product.model';

// Chance lib to mock data
const chance = new Chance();

describe('ProductController::getProducts', () => {

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

    test('+ve: should call ProductService.getProducts to get all the products', async () => {
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

describe('ProductController::getProduct', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let productId = chance.guid();
    let mockProduct: Partial<IProduct>;
    let mockProductService: ProductService;
    let productController: ProductController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockProduct = {
            id: productId,
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        mockRequest = {
            params: {
                id: productId,
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the getProduct method in the ProductService
        mockProductService = {
            getProduct: jest.fn().mockResolvedValue(mockProduct),
        } as unknown as ProductService;

        productController = new ProductController(mockProductService);
    });

    test('+ve: should get a product', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = {
            status: 'success',
            data: mockProduct,
        };

        // Act
        await productController.getProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.getProduct).toHaveBeenCalledWith(productId);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: getProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.getProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In getProduct');
    });

    test('+ve: getProduct should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            getProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.getProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: getProduct should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.getProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when ProductService.getProduct fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            getProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.getProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.getProduct).toHaveBeenCalledWith(productId);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Product could not be retrieved.',
            details: mockError,
        });
    });
});

describe('ProductController::createProduct', () => {

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockProduct: Partial<IProduct>;
    let mockProductService: ProductService;
    let productController: ProductController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockProduct = {
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        mockRequest = {
            body: mockProduct,
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the createProduct method in the ProductService
        mockProductService = {
            createProduct: jest.fn().mockResolvedValue(mockProduct),
        } as unknown as ProductService;
        productController = new ProductController(mockProductService);
    });

    test('+ve: should create a new product', async () => {
        // Arrange
        const expectedStatusCode = 201;
        const expectedResponse = {
            status: 'success',
            data: mockProduct, // Use newProduct as the data object in the response
        };

        // Act
        await productController.createProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.createProduct).toHaveBeenCalledWith(expect.objectContaining(mockProduct));
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: should create a new product with description undefined', async () => {
        // Arrange
        const mockProductUndefinedDescription: Partial<IProduct> = {
            name: chance.word(),
            description: undefined,
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        const mockRequest = {
            body: mockProductUndefinedDescription,
        };

        // Mock the createProduct method in the ProductService
        mockProductService.createProduct = jest.fn().mockResolvedValue(mockProductUndefinedDescription);
        const expectedStatusCode = 201;
        const expectedResponse = {
            status: 'success',
            data: mockProductUndefinedDescription,
        };

        // Act
        await productController.createProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.createProduct).toHaveBeenCalledWith(expect.objectContaining(mockProductUndefinedDescription));
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: createProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.createProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In createProduct');
    });

    test('+ve: createProduct should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            createProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.createProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: createProduct should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.createProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when ProductService.createProduct fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            createProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.createProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Product creation failed.',
            details: mockError,
        });
    });
});

describe('ProductController::updateProduct', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let productId = chance.guid();
    let updatedName = 'Updated Product';
    let mockProduct: Partial<IProduct>;
    let mockProductService: ProductService;
    let productController: ProductController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockProduct = {
            id: productId,
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        mockRequest = {
            params: {
                id: productId,
            },
            body: {
                name: updatedName,
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the updateProduct method in the ProductService
        mockProductService = {
            updateProduct: jest.fn().mockResolvedValue(mockProduct),
        } as unknown as ProductService;

        productController = new ProductController(mockProductService);
    });

    test('+ve: should update a product', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedResponse = {
            status: 'success',
            data: mockProduct,
        };

        // Act
        await productController.updateProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.updateProduct).toHaveBeenCalledWith(productId, {
            name: updatedName,
        });
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('+ve: updateProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.updateProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In updateProduct');
    });

    test('+ve: updateProduct should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            updateProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.updateProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: updateProduct should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.updateProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when ProductService.updateProduct fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            updateProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.updateProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.updateProduct).toHaveBeenCalledWith(productId, {
            name: updatedName,
        });
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Product update failed.',
            details: mockError,
        });
    });
});

describe('ProductController::deleteProduct', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let productId = chance.guid();
    let mockProduct: Partial<IProduct>;
    let mockProductService: ProductService;
    let productController: ProductController;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mocked Data
        mockProduct = {
            id: productId,
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        mockRequest = {
            params: {
                id: productId,
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            end: jest.fn(),
        };

        // Mock the deleteProduct method in the ProductService
        mockProductService = {
            deleteProduct: jest.fn().mockResolvedValue(mockProduct),
        } as unknown as ProductService;

        productController = new ProductController(mockProductService);
    });

    test('+ve: should delete a product', async () => {
        // Arrange
        const expectedStatusCode = 204;

        // Act
        await productController.deleteProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.end).toHaveBeenCalled();
    });

    test('+ve: deleteProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.deleteProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith('➤ [controller]: In deleteProduct');
    });

    test('+ve: deleteProduct should log the error when an exception occurs', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            deleteProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.deleteProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('-ve: deleteProduct should not log when LOG_LEVEL is not "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productController.deleteProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    it('-ve: should call res.status with 500 when ProductService.deleteProduct fails', async () => {
        // Arrange
        const expectedStatusCode = 500;
        const mockError = new Error('Some error');
        const mockProductService: ProductService = {
            deleteProduct: jest.fn().mockRejectedValue(mockError),
        } as unknown as ProductService;
        const productController = new ProductController(mockProductService);

        // Act
        await productController.deleteProduct(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
        expect(mockResponse.status).toHaveReturnedWith(mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Product deletion failed.',
            details: mockError,
        });
    });
});
