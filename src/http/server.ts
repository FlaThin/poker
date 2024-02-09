import fastify from "fastify";


import { z } from "zod";

const app = fastify();

app.post("/pokers", (resquest) => {
    const createPokerBody = z.object({
        title: z.string()
    })

    const { title } = createPokerBody.parse(resquest.body);

    


})

app.listen({ port: 3333 }).then(() => {
    console.log("Server Running")
});


