import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ProductRoutes from './routes/product.route';
import OrderRoutes from './routes/order.route';

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use('/product', ProductRoutes);
app.use('/order', OrderRoutes);

// Connect to MongoDB Atlas
const start = async (port: number, databaseUri: string) => {
    try {
        await mongoose.connect(databaseUri);
        console.log('⌸ [server]: Connected to MongoDB Atlas');
        const server = app.listen(port, () => {
            console.log('⚡️[server]: Server is listening on port', port);
        });
        return server;
    } catch (error) {
        console.error('[server]: Error connecting to MongoDB Atlas:', error);
    }
};

const port: number = parseInt(process.env.PORT || '8000');
const databaseUri: string = process.env.DATABASE_URI || '';

// Establish the MongoDB Atlas database connection and start the Express server
if (process.env.NODE_ENV !== 'test') {
    // Only connect to the database when not running tests
    start(port, databaseUri);
}

export { app, start };
