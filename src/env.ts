import z from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
	JWT_SECRET: z.string(),
	PORT: z.coerce.number().default(3333),
	CLIENT_URL: z.string().url(),
	DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
