import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // FIX 1: Use Environment Variable for baseURL so it doesn't default to localhost on Render
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8000',

  // FIX 2: Add secret (Required for production)
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://am-de-mu-frontend.vercel.app',
  ], // Add your testing origins here
  emailAndPassword: {
    enabled: true, // This handles your email/pass signup & login
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: 'offline',
      prompt: 'select_account consent',
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    // This helps cookies travel between your Render backend and Vercel frontend
    crossSubdomainCookies: true,
  },
});
