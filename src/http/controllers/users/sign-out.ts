import type { FastifyReply, FastifyRequest } from 'fastify'

export async function signOut(_: FastifyRequest, reply: FastifyReply) {
	return reply.clearCookie('token').status(200).send()
}
