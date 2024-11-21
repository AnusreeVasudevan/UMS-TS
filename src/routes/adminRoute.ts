import express, { Request, Response } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';

import config from '../config/config';
import { isLogin, isLogout } from '../middleware/adminAuth';  // Import functions
import * as adminController from '../controllers/adminController'; // Use namespace import for controllers

const adminRoute = express();

// Session setup
adminRoute.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

// Body parser setup
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));

// Set view engine and views directory
adminRoute.set('view engine', 'ejs');
adminRoute.set('views', path.join(__dirname, '../views/admin'));

// Static files
adminRoute.use(express.static(path.join(__dirname, '../public')));

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
adminRoute.get('/', isLogout, adminController.loadLogin);
adminRoute.post('/', adminController.verifyLogin);
adminRoute.get('/home', isLogin, adminController.loadDashboard);
adminRoute.get('/logout', isLogin, adminController.logout);
adminRoute.get('/dashboard', isLogin, adminController.adminDashboard);
adminRoute.get('/new-user', isLogin, adminController.newUserLoad);
adminRoute.post('/new-user', upload.single('image'), adminController.addUser);
adminRoute.get('/edit-user', isLogin, adminController.editUserLoad);
adminRoute.post('/edit-user', adminController.updateUsers);
adminRoute.get('/delete-user', adminController.deleteUser);

// Fallback route for non-existent routes
adminRoute.get('*', (req: Request, res: Response) => {
    res.redirect('/admin');
});

// Export the router
export default adminRoute;
