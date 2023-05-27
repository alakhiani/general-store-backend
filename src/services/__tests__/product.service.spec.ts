import Chance from "chance";
import { IProduct } from "../../models/product.model";
import { ProductService } from "../product.service";
import { Model } from "mongoose";

const chance = new Chance();



describe('ProductService', () => {

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
});