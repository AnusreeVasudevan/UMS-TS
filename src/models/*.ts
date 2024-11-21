import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for the User document
export interface IUser extends Document {
    name: string;
    email: string;
    mobile: number;
    image: string;
    password: string;
    is_admin: number;
    is_verified: number;
}

// Define the User schema
const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_verified: {
        type: Number,
        default: 0
    }
});

// Export the model
export default mongoose.model<IUser>('User', userSchema);
