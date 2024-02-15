import { FastifyInstance } from "fastify";
import zod from "zod";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

export async function getPoker(app: FastifyInstance) {
  app.get("/pokers/:pokerId", async (request, reply) => {

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

    if (!poker) {
      return reply.status(400).send({ message: 'Poker not found.' })
    }

    const result = await redis.zrange(pokerId, 0, -1, 'WITHSCORES')

    const votes = result.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1]

        Object.assign(obj, { [line]: Number(score) })
      }

      return obj
    }, {} as Record<string, number>)

    return reply.send({
      poker: {
        id: poker.id,
        title: poker.title,
        options: poker.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: (option.id in votes) ? votes[option.id] : 0,
          };
        }),
      },
    });
  })
}