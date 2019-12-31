import { Document } from 'mongoose';
import { Item } from './Item.interface';

export interface TodoList extends Document {
    _id: string;
    uid: string;
    name: string;
    createdAt: number;
    items: Item[];
}