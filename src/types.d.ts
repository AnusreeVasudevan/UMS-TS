declare module 'nocache';
declare module 'randomstring';
declare module 'secure-password';
declare module 'express-session';
declare module 'multer';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user_id: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: Session & Partial<SessionData>;
    file?: {
      filename: string;
    };
  }
}
