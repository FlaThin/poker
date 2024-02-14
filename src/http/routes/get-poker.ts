import { FastifyInstance } from "fastify";
import zod from "zod";
import { prisma } from "../../lib/prisma";

export function getPoker(app: FastifyInstance) {
	app.get("pokers/:pokerId", async (request, reply) => {

		const getPokerParams = zod.object({
			pokerId: zod.string()
		});

		const { pokerId } = getPokerParams.parse(request.params);

		const poker = await prisma.poker.findUnique({
			where: {
				id: pokerId
			},
			include: {
				options: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});

		return reply.status(201).send({ poker });
	});
}