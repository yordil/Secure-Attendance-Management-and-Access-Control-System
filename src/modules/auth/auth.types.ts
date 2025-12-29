import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    lastName: z.string(),
    department: z.string().optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
