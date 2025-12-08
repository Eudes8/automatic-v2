import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null | undefined;
      email: string;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name: string | null | undefined;
    email: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    name: string | null | undefined;
    email: string;
    image?: string | null;
  }
}