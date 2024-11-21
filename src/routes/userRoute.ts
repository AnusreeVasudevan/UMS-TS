import express, { Request, Response } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';

import config from '../config/config';
import { isLogin, isLogout } from '../middleware/adminAuth'; // Import functions
import * as userController from '../controllers/userController'; // Use namespace import for controllers

const userRoute = express();

// Session setup
userRoute.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

// Body parser setup
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

// Set view engine and views directory
userRoute.set('view engine', 'ejs');
userRoute.set('views', path.join(__dirname, '../views/users'));

// Static files
userRoute.use(express.static(path.join(__dirname, '../public')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage });

// Routes
userRoute.get('/register', isLogout, userController.loadRegister);
userRoute.post('/register', upload.single('image'), userController.insertUser);
userRoute.get('/', userController.loginLoad);
userRoute.get('/login', userController.loginLoad);
userRoute.post('/login', userController.verifyLogin);
userRoute.get('/home', isLogin, userController.loadHome);
userRoute.get('/logout', isLogin, userController.userLogout);
userRoute.get('/edit', isLogin, userController.editLoad);
userRoute.post('/edit', upload.single('image'), userController.updateProfile);

// Export the router
export default userRoute;

