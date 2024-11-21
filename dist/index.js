"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const nocache_1 = __importDefault(require("nocache"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
// Connect to MongoDB
mongoose_1.default.connect('mongodb://127.0.0.1:27017/user_management_system')
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
// Initialize Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, nocache_1.default)());
// Routes
app.use('/', userRoute_1.default);
app.use('/admin', adminRoute_1.default);
// Start the server
const PORT = 9090;
app.listen(PORT, () => {
    console.log(`Running..http://localhost:${PORT}/`);
});
