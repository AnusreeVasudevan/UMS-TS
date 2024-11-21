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
const adminController = __importStar(require("../controllers/adminController")); // Use namespace import for controllers
const adminRoute = (0, express_1.default)();
// Session setup
adminRoute.use((0, express_session_1.default)({
    secret: config_1.default.sessionSecret,
    resave: false,
    saveUninitialized: false
}));
// Body parser setup
adminRoute.use(body_parser_1.default.json());
adminRoute.use(body_parser_1.default.urlencoded({ extended: true }));
// Set view engine and views directory
adminRoute.set('view engine', 'ejs');
adminRoute.set('views', path_1.default.join(__dirname, '../views/admin'));
// Static files
adminRoute.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
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
adminRoute.get('/', adminAuth_1.isLogout, adminController.loadLogin);
adminRoute.post('/', adminController.verifyLogin);
adminRoute.get('/home', adminAuth_1.isLogin, adminController.loadDashboard);
adminRoute.get('/logout', adminAuth_1.isLogin, adminController.logout);
adminRoute.get('/dashboard', adminAuth_1.isLogin, adminController.adminDashboard);
adminRoute.get('/new-user', adminAuth_1.isLogin, adminController.newUserLoad);
adminRoute.post('/new-user', upload.single('image'), adminController.addUser);
adminRoute.get('/edit-user', adminAuth_1.isLogin, adminController.editUserLoad);
adminRoute.post('/edit-user', adminController.updateUsers);
adminRoute.get('/delete-user', adminController.deleteUser);
// Fallback route for non-existent routes
adminRoute.get('*', (req, res) => {
    res.redirect('/admin');
});
// Export the router
exports.default = adminRoute;
