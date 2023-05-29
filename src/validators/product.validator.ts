import { check, ValidationChain } from 'express-validator';

export const createProductValidationRules: ValidationChain[] = [
    // Example rules, replace them with your specific validation rules
    check('name').notEmpty().withMessage('Name is required'),
    check('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    check('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
    check('imageUrl').isURL().withMessage('Invalid image URL'),
];
