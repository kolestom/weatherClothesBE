import { z } from "zod";

const envSchema = z.object({
    CLIENT_ID: z.string(),
    CLIENT_SECRET: z.string(),
    SERVER: z.string().min(1),
    MONGO_URL: z.string().min(1),
    REDIRECT_URI: z.string(),
    JWT_SECRET_KEY: z.string(),
    WEATHER_API_KEY: z.string(),
    TEST_TOKEN: z.string(),
    TEST_SUB: z.string()
  });

export const env = envSchema.parse(process.env);
  