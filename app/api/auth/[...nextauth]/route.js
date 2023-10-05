import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from "next-auth/providers/github";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../lib/mongodb';
import User from "../../../../models/User"
import bcrypt from "bcrypt";
import db from "../../../../utils/db";


db.connectDb();
const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
    providers: [
        // OAuth authentication providers...
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            const email = credentials.email;
            const password = credentials.password;
            const user = await User.findOne({ email });
      
            if (user) {
              return SignInUser({ password, user });
            } else {
              throw new Error("This email does not exist.");
            }
          }
        }),
        TwitterProvider({
          clientId: process.env.TWITTER_ID,
          clientSecret: process.env.TWITTER_SECRET
        }),
        FacebookProvider({
          clientId: process.env.FACEBOOK_ID,
          clientSecret: process.env.FACEBOOK_SECRET
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET
        }),
        GithubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
        }),
        Auth0Provider({
          clientId: process.env.AUTH0_CLIENT_ID,
          clientSecret: process.env.AUTH0_CLIENT_SECRET,
          issuer: process.env.AUTH0_ISSUER,
        }),
    ],
    callbacks: {
      async session({ session, token }) {
        let user = await User.findById(token.sub);
        session.user._id = token.sub || user._id.toSting();
        session.user.role = user.role || "user";
        token.role = user.role || "user";
        return session;

      // async redirect({ url, baseUrl }) {
      //   // Allows relative callback URLs
      //   if (url.startsWith("/")) return `${baseUrl}${url}`
      //   // Allows callback URLs on the same origin
      //   else if (new URL(url).origin === baseUrl) return url
      //   return baseUrl
      },
    },
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.JWT_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }

const SignInUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error("Please enter your password.");
  }
  const testPassword = await bcrypt.compare(password, user.password);
  if (!testPassword) {
    throw new Error("Email or password is wrong!");
  }
  return user;
};