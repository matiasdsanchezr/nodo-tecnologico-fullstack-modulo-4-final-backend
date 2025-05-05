type UserContext = {
  userId: string;
  role?: string;
  activeProfileId?: string;
};

declare namespace Express {
  export interface Request {
    userContext?: UserContext;
  }
}
