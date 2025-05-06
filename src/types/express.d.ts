type UserContext = {
  id: string;
  role?: string;
  activeProfileId?: string;
};

type ProfileContext = {
  id: string;
  name: string;
  role: {
    permissions: { name: string; description: string }[];
  };
};

declare namespace Express {
  export interface Request {
    user?: UserContext;
    profile?: ProfileContext;
  }
}
