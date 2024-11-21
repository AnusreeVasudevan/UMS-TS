import { Request, Response, NextFunction } from 'express';

export const isLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.session.user_id) {
      // User is logged in, proceed to the next middleware
      next();
    } else {
      // User is not logged in, redirect to the login page
      res.redirect('/');
    }
  } catch (error: any) {
    console.error(error.message);
  }
};

export const isLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.session.user_id) {
      // User is logged in, redirect to the home page
      res.redirect('/home');
    } else {
      // User is not logged in, proceed to the next middleware
      next();
    }
  } catch (error: any) {
    console.error(error.message);
  }
};

