import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { voting } from "../../utils/voting-pub-sub";
import { randomUUID } from "crypto";

export async function voteOnPoker(app: FastifyInstance) {

  app.post("/pokers/:pokerId/votes", async (request, reply) => {

    const voteOnPokerBody = z.object({
      pokerOptionId: z.string().uuid()
    })

    const voteOnPokerParams = z.object({
      pokerId: z.string().uuid()
    })

    const { pokerOptionId } = voteOnPokerBody.parse(request.body);
    const { pokerId } = voteOnPokerParams.parse(request.params);

    let { sessionId } = request.cookies;
    console.log(sessionId)
    if (sessionId) {
      const userPreviousVoteOnPoker = await prisma.vote.findUnique({
        where: {
          sessionId_pokerId: {
            sessionId,
            pokerId,
          }
        }
      })

      if (userPreviousVoteOnPoker && userPreviousVoteOnPoker.pokerOptionId !== pokerOptionId) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoker.id,
          }
        })

        const votes = await redis.zincrby(pokerId, -1, userPreviousVoteOnPoker.pokerOptionId)

        voting.publish(pokerId, {
          pokerOptionId,
          votes: Number(votes)
        })


      } else if (userPreviousVoteOnPoker) {
        return reply.status(400).send({ message: 'Ja votou nessa opção' })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 30 * 24, //30 days
        signed: true,
        httpOnly: true
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pokerId,
        pokerOptionId
      }
    })

    const votes = redis.zincrby(pokerId, 1, pokerOptionId);

    voting.publish(pokerId, {
      pokerOptionId,
      votes: Number(votes)
    })

    return reply.status(201).send();

  })
}