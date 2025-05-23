import type { RecipeResponseModel } from '../models/recipe.model.ts';
import { GoogleGenAI } from "@google/genai";

function success(description: string): RecipeResponseModel {
  return { description } as RecipeResponseModel;
}

function failure(error: string): RecipeResponseModel {
  return { error } as RecipeResponseModel;
}

function formatRecipes(rawText: string): string {
  const sections = rawText.split(/Recipe \d:/).filter(Boolean);

  return sections.map((section, index) => {
    const titleMatch = section.match(/^(.*?)(Description:)/);
    const title = titleMatch ? titleMatch[1].trim() : `Recipe ${index + 1}`;
    
    const descMatch = section.match(/Description:\s*([\s\S]*?)(Ingredients:)/);
    const desc = descMatch ? descMatch[1].trim() : '';
    
    const ingredientsMatch = section.match(/Ingredients:\s*(.*?)(Instructions:)/s);
    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim() : '';
    
    const instructionsMatch = section.match(/Instructions:\s*(.*)/s);
    const instructions = instructionsMatch ? instructionsMatch[1].trim() : '';

    const ingredientsList = ingredients
      .split(/•|\n|(?<!\d)\.\s/g)
      .map(i => i.trim())
      .filter(Boolean)
      .map(i => `• ${i}`)
      .join('\n');

    const instructionSteps = instructions
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .join('\n');


    return `🍽️ ${title}\n\n📖 Description:\n${desc}\n\n🥕 Ingredients:\n${ingredientsList}\n\n👨‍🍳 Instructions:\n${instructionSteps}`;
  }).join('\n\n---\n\n');
}




export async function generateRecipe(prompt: string): Promise<RecipeResponseModel> {
  try {
    const apiKey = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    const response = await apiKey.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Give me 2 detailed recipes I can make using the following ingredients: ${prompt}. Each recipe should include a name, a short description, a list of ingredients, and step-by-step instructions. Keep formatting clean and easy to read. Do not use markdown symbols like ** or * or headers.`,
    });

    
    const data = response.text;

    // logging the response for debugging
    console.log("Response from Gemini:", data);
    
    if (!data) {
      return failure('Gemini did not return a valid response.');
    }

    return success(formatRecipes(data))

  } catch (err: any) {
    console.error('Gemini API error:', err.message || err);
    return failure('Something went wrong calling Gemini.');
  }
}
