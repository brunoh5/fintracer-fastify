import type { FastifyJWT as JWT } from '@fastify/jwt'

declare module '@fastify/jwt' {
	export interface FastifyJWT extends JWT {
		user: {
			sub: string
		}
	}
}
