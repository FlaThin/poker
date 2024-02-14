import fastify from "fastify";
import cookie from "@fastify/cookie";
import websocket from "@fastify/websocket";

import { createPoker } from "./routes/create-poker";
import { getPoker } from "./routes/get-poker";
import { voteOnPoker } from "./routes/vote-on-poker";

const app = fastify();

app.register(cookie, {
    secret: "polls-app-nlw",
    hook: 'onRequest',
});

app.register(websocket)

app.register(createPoker);
app.register(getPoker);
app.register(voteOnPoker);

app.listen({ port: 3333 }).then(() => {
    console.log("Server Running")
});


