import { Request, Response, NextFunction } from "express";

declare type UserContext = {
  userId: string;
  role?: string;
  activeProfileId?: string;
};

export type AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type HasPermissionFunction = (
  requiredPermission?: string
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
