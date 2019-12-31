import * as mongoose from 'mongoose';
import { ItemSchema } from './Item.schema';

export const TodoListSchema = new mongoose.Schema({
    uid: String,
    name: String,
    createdAt: Number,
    items: [
        ItemSchema,
    ],
});
