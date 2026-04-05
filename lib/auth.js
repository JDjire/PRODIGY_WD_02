import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password).trim();

        try {
          await connectDB();
        } catch (err) {
          console.error("[auth] Database connection failed:", err);
          throw new Error("DatabaseUnavailable");
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[auth] No user with this email in the database. Run: npm run seed"
            );
          }
          return null;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              "[auth] Password does not match. If you changed .env.local, run: npm run seed -- --reset-password"
            );
          }
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || "Admin",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
