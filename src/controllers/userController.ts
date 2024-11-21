import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/*';

// Secure password hashing function
const securePassword = async (password: string): Promise<string | undefined> => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Load registration page
export const loadRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render('registration');
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Insert a new user
export const insertUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file?.filename,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();

        if (userData) {
            res.render('registration', { message: "Your registration has been successful!!" });
        } else {
            res.render('registration', { message: "Your registration has failed!!!" });
        }
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Load login page
export const loginLoad = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render('login');
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Verify user login
export const verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your mail." });
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            } else {
                res.render('login', { message: "Email and Password are incorrect" });
            }
        } else {
            res.render('login', { message: "Email and Password are incorrect!!!" });
        }
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Load home page
export const loadHome = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('home', { user: userData });
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Logout user
export const userLogout = async (req: Request, res: Response): Promise<void> => {
    try {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Load edit user page
export const editLoad = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.query.id as string;
        const userData = await User.findById(id);

        if (userData) {
            res.render('edit', { user: userData });
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.file) {
            await User.findByIdAndUpdate(req.body.user_id, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mno,
                    image: req.file.filename
                }
            });
        } else {
            await User.findByIdAndUpdate(req.body.user_id, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mno
                }
            });
        }

        res.redirect('/home');
    } catch (error) {
        console.log((error as Error).message);
    }
};

