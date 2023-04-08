import { OpenAIStream, OpenAIStreamPayload } from './_utils/stream';

// @ts-ignore
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  const { schema, query } = (await req.json()) as {
    schema?: string;
    query?: string;
  };

  if (!query) {
    return new Response('No prompt in the request', { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are Postgres & Supabase expert. Translate given natural language query into SQL without changing the case of the entries given.',
      },
      {
        role: 'user',
        content: `### Postgres SQL tables, with their properties:\n#${schema}\n### ${query}\n`,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);

  return new Response(stream);
};

export default handler;
