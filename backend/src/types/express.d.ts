import { AdminPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export {};
