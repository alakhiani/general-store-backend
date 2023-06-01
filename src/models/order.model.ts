import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
    orderTotal: number;
    items: IOrderItem[];
}

export interface IOrderItem {
    productId: string;
    quantity: number;
    price: number;
}

const orderCollection = process.env.ORDER_COLLECTION || 'order';

const OrderSchema = new Schema<IOrder>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    orderTotal: {
        type: Number,
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product', // Refers to the 'Product' collection
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }]
}, {
    timestamps: true,
    collection: orderCollection
});

export default mongoose.model<IOrder>('Order', OrderSchema);
