import mongoose from "mongoose";

export interface IUser {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    image?: string;
}