import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

export function voteOnPoker(app: FastifyInstance) {

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

                const votes = await redis.zincrby(pokerId, -1, userPreviousVoteOnPoker.pokerOptionId);

            }

            if (!sessionId) {

            }



        })



}