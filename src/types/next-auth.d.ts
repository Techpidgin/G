import { UserRole } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  firstname: string;
  lastname: string;
  role: "SUPERUSER" | "USER";
  //   kv: boolean;
};

declare module "next-auth" {
  interface User {
    firstname?: string;
    lastname?: string;
    role: "SUPERUSER" | "USER";
  }

  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role: "SUPERUSER" | "USER";
    firstname: string;
    lastname: string;
  }
}
