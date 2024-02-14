import { FastifyInstance } from "fastify";
import { FastifyRouteConfig } from "fastify/types/route";
import zod from "zod";
import { prisma } from "../../lib/prisma";

export const createPoker = (app: FastifyInstance) => {

	app.post("/pokers", async (resquest, reply) => {
		const createPokerBody = zod.object({
			title: zod.string(),
			options: zod.array(zod.string())
		})

		const { title, options } = createPokerBody.parse(resquest.body);

		const poker = await prisma.poker.create({
			data: {
				title,
				options: {
					createMany: {
						data: options.map((option) => {
							return {
								title: option
							}
						})
					}
				}
			}
		})

		return reply.status(201).send({ pokerId: poker.id });
	
	})

}