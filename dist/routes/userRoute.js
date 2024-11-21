"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config/config"));
const adminAuth_1 = require("../middleware/adminAuth"); // Import functions
const userController = __importStar(require("../controllers/userController")); // Use namespace import for controllers
const userRoute = (0, express_1.default)();
// Session setup
userRoute.use((0, express_session_1.default)({
    secret: config_1.default.sessionSecret,
    resave: false,
    saveUninitialized: false
}));
// Body parser setup
userRoute.use(body_parser_1.default.json());
userRoute.use(body_parser_1.default.urlencoded({ extended: true }));
// Set view engine and views directory
userRoute.set('view engine', 'ejs');
userRoute.set('views', path_1.default.join(__dirname, '../views/users'));
// Static files
userRoute.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Multer setup for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../public/userImages'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = (0, multer_1.default)({ storage });
// Routes
userRoute.get('/register', adminAuth_1.isLogout, userController.loadRegister);
userRoute.post('/register', upload.single('image'), userController.insertUser);
userRoute.get('/', userController.loginLoad);
userRoute.get('/login', userController.loginLoad);
userRoute.post('/login', userController.verifyLogin);
userRoute.get('/home', adminAuth_1.isLogin, userController.loadHome);
userRoute.get('/logout', adminAuth_1.isLogin, userController.userLogout);
userRoute.get('/edit', adminAuth_1.isLogin, userController.editLoad);
userRoute.post('/edit', upload.single('image'), userController.updateProfile);
// Export the router
exports.default = userRoute;
