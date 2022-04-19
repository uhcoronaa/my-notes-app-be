import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';

const userSchema: Schema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model<IUser>('user', userSchema);

export { User }