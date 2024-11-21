"use strict";
// const mongoose = require("mongoose");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     mobile:{
//         type:Number,
//         required:true
//     },
//     image:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     is_admin:{
//         type:Number,
//         required:true
//     },
//     is_verified:{
//         type:Number,
//         default:0
//     }
// });
// module.exports = mongoose.model("User",userSchema);
const mongoose_1 = __importDefault(require("mongoose"));
// Define the User schema
const userSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('User', userSchema);
