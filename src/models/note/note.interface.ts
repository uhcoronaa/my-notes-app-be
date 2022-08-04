import mongoose from "mongoose";

export interface INote {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image?: string;
    category: string;
    status: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    user_id: mongoose.Types.ObjectId;
}