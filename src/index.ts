import { Hono } from 'hono'

export interface Env {
  AI:Ai;
}

const app = new Hono<{Bindings: Env}>();



app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('ai/summerize', async (c) => {
  const {text} = await c.req.json();

  if (!text) {
    return c.json({error: "text is requires"}, 400);
  }

  try {
    const response = await c.env.AI.run("@cf/meta/llama-2-7b-chat-fp16", {
      prompt: `You are a senior Ayurvedic doctor. A client has shared the following information: "${text}". Based on Ayurvedic principles, provide a personalized dietary recommendation.`,
    });

    return c.json(
      {
        data:response,
      },
      200
    );
  } catch (error) {
    return c.json({
      error:error
    }, 500)
  }

})

export default app
