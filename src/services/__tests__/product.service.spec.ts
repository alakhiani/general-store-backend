import Chance from "chance";
import { IProduct } from "../../models/product.model";
import { ProductService } from "../product.service";
import { Model } from "mongoose";

const chance = new Chance();

describe('ProductService::getProducts', () => {

    let mockProducts: Partial<IProduct>[] = [];
    let productService: ProductService;
    let mockProductModel: Model<IProduct>;

    beforeEach(() => {

        jest.clearAllMocks();

        // Mock products data
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

        // Mock the Product model
        mockProductModel = {
            find: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockReturnValue(mockProducts),
        } as unknown as Model<IProduct>;

        productService = new ProductService(mockProductModel);
    })

    test('+ve: should call find and get back products', async () => {

        // Act
        const result = await productService.getProducts();

        // Assert        
        expect(mockProductModel.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProducts);
    });

    test('+ve: getProducts should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.getProducts();

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Got back ${mockProducts.length} products`);
    });

    test('+ve: getProducts should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.getProducts();

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });
});

describe('ProductService::getProduct', () => {
    let mockProductId: string;
    let mockProduct: Partial<IProduct>;
    let productService: ProductService;
    let mockProductModel: Model<IProduct>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock product data
        mockProductId = chance.guid();
        mockProduct = {
            _id: mockProductId,
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        // Mock the Product model
        mockProductModel = {
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockProduct),
        } as unknown as Model<IProduct>;

        productService = new ProductService(mockProductModel);
    });

    test('+ve: should call findById and get back the product', async () => {
        // Act
        const result = await productService.getProduct(mockProductId);

        // Assert
        expect(mockProductModel.findById).toHaveBeenCalledWith(mockProductId);
        expect(result).toEqual(mockProduct);
    });

    test('+ve: getProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.getProduct(mockProductId);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Got back ${JSON.stringify(mockProduct)}`);
    });

    test('+ve: getProduct should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.getProduct(mockProductId);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });
});

describe('ProductService::createProduct', () => {
    let productService: ProductService;
    let mockProductId: string = chance.guid();
    let mockProduct: Partial<IProduct>;
    let mockCreatedProduct: Partial<IProduct>;
    let mockProductModel: Model<IProduct>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock product data
        mockProduct = {
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        mockCreatedProduct = { ...mockProduct, _id: mockProductId };

        // Mock the Product model
        mockProductModel = {
            create: jest.fn().mockResolvedValue(mockCreatedProduct),
        } as unknown as Model<IProduct>;

        productService = new ProductService(mockProductModel);
    });

    test('+ve: should create a new product', async () => {
        // Act
        const result = await productService.createProduct(mockProduct as IProduct);

        // Assert
        expect(mockProductModel.create).toHaveBeenCalledWith(mockProduct);
        expect(result).toEqual(mockCreatedProduct);
    });

    test('+ve: createProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.createProduct(mockProduct as IProduct);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Created ${JSON.stringify(mockCreatedProduct)}`);
    });

    test('+ve: createProduct should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.createProduct(mockProduct as IProduct);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });
});

describe('ProductService::updateProduct', () => {
    let productService: ProductService;
    let mockProductId: string = chance.guid();
    let mockProduct: Partial<IProduct>;
    let mockUpdatedProduct: Partial<IProduct>;
    let mockProductModel: Model<IProduct>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock product data
        mockProduct = {
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        mockUpdatedProduct = { ...mockProduct, _id: mockProductId };

        // Mock the Product model
        mockProductModel = {
            findByIdAndUpdate: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(mockUpdatedProduct)
                })
            }),
        } as unknown as Model<IProduct>;

        productService = new ProductService(mockProductModel);
    });

    test('+ve: should update the product', async () => {
        // Act
        const result = await productService.updateProduct(mockProductId, mockProduct as IProduct);

        // Assert
        expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(mockProductId, mockProduct, { new: true, runValidators: true });
        expect(result).toEqual(mockUpdatedProduct);
    });

    test('+ve: updateProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.updateProduct(mockProductId, mockProduct as IProduct);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Updated ${JSON.stringify(mockUpdatedProduct)}`);
    });

    test('+ve: updateProduct should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.updateProduct(mockProductId, mockProduct as IProduct);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });

    test('-ve: should throw an error when the product ID is not found', async () => {
        // Arrange
        const nonExistingProductId = chance.guid();
        const updatedProduct: Partial<IProduct> = {
            name: 'Updated Product',
            description: 'Updated Description',
            price: chance.floating({ min: 0, max: 100 }),
        };
        const mockProductModel: Model<IProduct> = {
            findByIdAndUpdate: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(null),
                }),
            }),
        } as unknown as Model<IProduct>;
        const productService = new ProductService(mockProductModel);

        // Act and Assert
        await expect(productService.updateProduct(nonExistingProductId, updatedProduct as IProduct)).rejects.toThrow(Error);
        expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
            nonExistingProductId,
            updatedProduct,
            { new: true, runValidators: true }
        );
    });


});

describe('ProductService::deleteProduct', () => {
    let productService: ProductService;
    let mockProductId: string = chance.guid();
    let mockProduct: Partial<IProduct>;
    let mockDeletedProduct: Partial<IProduct>;
    let mockProductModel: Model<IProduct>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock product data
        mockProduct = {
            name: chance.word(),
            description: chance.sentence(),
            price: chance.floating({ min: 0, max: 100 }),
            imageUrl: chance.url(),
        };

        mockDeletedProduct = { ...mockProduct, _id: mockProductId };

        // Mock the Product model
        mockProductModel = {
            findByIdAndDelete: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockDeletedProduct) }) }),
        } as unknown as Model<IProduct>;

        productService = new ProductService(mockProductModel);
    });

    test('+ve: should delete the product', async () => {
        // Act
        const result = await productService.deleteProduct(mockProductId);

        // Assert
        expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(mockProductId);
        expect(result).toEqual(mockDeletedProduct);
    });

    test('+ve: deleteProduct should log when LOG_LEVEL is "trace"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'trace';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.deleteProduct(mockProductId);

        // Assert
        expect(console.log).toHaveBeenCalledWith(`➤ [service]: Deleted ${JSON.stringify(mockDeletedProduct)}`);
    });

    test('+ve: deleteProduct should not log when LOG_LEVEL is "info"', async () => {
        // Arrange
        process.env.LOG_LEVEL = 'info';
        console.log = jest.fn(); // Mock console.log

        // Act
        await productService.deleteProduct(mockProductId);

        // Assert
        expect(console.log).not.toHaveBeenCalled();
    });
});
