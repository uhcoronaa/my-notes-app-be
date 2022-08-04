import mongoose from "mongoose";

export interface ICategory {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    user_id: mongoose.Types.ObjectId;
}