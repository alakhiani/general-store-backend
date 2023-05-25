import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    description?: string;
    imageUrl: string;
}

const productCollection = process.env.PRODUCT_COLLECTION || 'product';

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: productCollection
});

export default mongoose.model<IProduct>('Product', ProductSchema);
