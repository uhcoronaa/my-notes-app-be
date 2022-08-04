import mongoose, { Schema } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema: Schema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

const Category = mongoose.model<ICategory>('category', categorySchema);

export { Category }