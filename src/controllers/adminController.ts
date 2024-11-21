import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import User from '../models/*';
import SecurePassword from 'secure-password'; // Assuming `secure-password` provides a named export

const securePassword = new SecurePassword(); // Assuming the package works this way

// Load login page
export const loadLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render('login');
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Verify login
export const verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: "Email and Password are incorrect!" });
                } else {
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home");
                }
            } else {
                res.render('login', { message: "Email and Password are incorrect!!" });
            }

        } else {
            res.render('login', { message: "Email and Password are incorrect!!!" });
        }
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Load dashboard
export const loadDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData = await User.findById(req.session.user_id);
        res.render('home', { admin: userData });
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        req.session.destroy(() => {
            res.redirect('/admin');
        });
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Admin dashboard
export const adminDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData = await User.find({ is_admin: 0 });
        res.render('dashboard', { users: userData });
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Add new user
export const newUserLoad = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render('new-user');
    } catch (error) {
        console.log((error as Error).message);
    }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, mno } = req.body;
        const image = req.file?.filename;
        const password = randomstring.generate(8);
        const spassword = await securePassword.hash(Buffer.from(password)); // Adjusted for `secure-password`

        const user = new User({
            name,
            email,
            mobile: mno,
            image,
            password: spassword.toString(),
            is_admin: 0
        });

        const userData = await user.save();

        if (userData) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('new-user', { message: "Something went wrong!!!" });
        }

    } catch (error) {
        console.log((error as Error).message);
    }
};

// Edit user
export const editUserLoad = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        const userData = await User.findById(id);

        if (userData) {
            res.render('edit-user', { user: userData });
        } else {
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.log((error as Error).message);
    }
};

export const updateUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, email, mno, verify } = req.body;
        await User.findByIdAndUpdate(id, { name, email, mobile: mno, is_verified: verify });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log((error as Error).message);
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.query;
        await User.deleteOne({ _id: id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log((error as Error).message);
    }
};

