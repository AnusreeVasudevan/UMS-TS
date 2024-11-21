import { Request, Response, NextFunction } from 'express';

export const isLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/admin');
    }
  } catch (error: any) {
    console.error(error.message);
  }
};

export const isLogout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.session.user_id) {
      res.redirect('/admin/home');
    } else {
      next();
    }
  } catch (error: any) {
    console.error(error.message);
  }
};


