import mongoose, { Schema } from 'mongoose';
import { INote } from './note.interface';

const noteSchema: Schema = new mongoose.Schema<INote>({
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
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

const Note = mongoose.model<INote>('note', noteSchema);

export { Note }
