import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequest } from './_errors/bad-request'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
	if (error instanceof ZodError) {
		console.error(error.message)
		return reply.status(400).send({
			message: 'Error during validation',
			errors: error.flatten().fieldErrors,
		})
	}

	if (error instanceof BadRequest) {
		console.error(error.message)
		return reply.status(400).send({ message: error.message })
	}

	if (error instanceof Error) {
		console.error(error.message)
		return reply.status(400).send({ message: error.message })
	}

	console.error('> Internal server error', error)
	return reply.status(500).send({ message: 'Internal server error', error })
}
