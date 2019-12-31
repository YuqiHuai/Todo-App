import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    password: String,
    validated: Boolean,
});
