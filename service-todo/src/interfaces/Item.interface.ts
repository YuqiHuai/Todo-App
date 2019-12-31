import { Document } from 'mongoose';

export interface Item extends Document {
    _id: string;
    name: string;
    completed: boolean;
    createdAt: number;
}