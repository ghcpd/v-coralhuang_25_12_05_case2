/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    STRIPE_SECRET_KEY?: string;
  }
}