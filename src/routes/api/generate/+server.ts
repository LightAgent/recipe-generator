import { generateRecipe } from '../../../controllers/pageController';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { prompt } = await request.json();
  const result = await generateRecipe(prompt);

  return new Response(JSON.stringify(result), {
    status: 'error' in result ? 500 : 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
