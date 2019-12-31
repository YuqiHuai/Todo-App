import * as mongoose from 'mongoose';

export const ItemSchema = new mongoose.Schema({
    name: String,
    completed: Boolean,
    createdAt: Number,
});
