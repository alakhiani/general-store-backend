import { check, ValidationChain } from 'express-validator';

export const createOrderValidationRules: ValidationChain[] = [
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('address1').notEmpty().withMessage('Address 1 is required'),
    check('city').notEmpty().withMessage('City is required'),
    check('state').notEmpty().withMessage('State is required'),
    check('zip').notEmpty().withMessage('Zip is required'),
    check('country').notEmpty().withMessage('Country is required'),
    check('phone').notEmpty().withMessage('Phone is required'),
    check('email').notEmpty().withMessage('Email is required'),
    check('orderTotal').notEmpty().withMessage('Order total is required'),
    check('items').notEmpty().withMessage('Items are required')    
];
