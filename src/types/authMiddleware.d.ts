import { Request, Response, NextFunction } from "express";

declare type UserContext = {
  userId: string;
  role?: string;
  activeProfileId?: string;
};

export type AuthenticateTokenFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type HasPermissionFunction = (
  requiredPermission?: string
) => (req: any, res: any, next: any) => Promise<void>;
