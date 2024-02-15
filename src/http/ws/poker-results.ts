import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import { z } from "zod";

export async function pokerResults(app: FastifyInstance) {
  app.get('/pokers/:pokerId/results', { websocket: true }, (connection, request) => {
    const getPokerParams = z.object({
      pokerId: z.string().uuid(),
    })

    const { pokerId } = getPokerParams.parse(request.params)

    voting.subscribe(pokerId, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}