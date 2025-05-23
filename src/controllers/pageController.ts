import type { RecipeResponseModel } from '../models/recipe.model.ts';
import dotenv from 'dotenv';
// import fetch from 'node-fetch';

try {
  dotenv.config();
} catch (err) {
  console.error("Failed to load dotenv:", err);
}


function success(description: string): RecipeResponseModel {
  return { description } as RecipeResponseModel;
}

function failure(error: string): RecipeResponseModel {
  return { error } as RecipeResponseModel;
}



export async function generateRecipe(prompt: string): Promise<RecipeResponseModel> {
  try {

    const apiKey = process.env.GEMINI_API_KEY;

    type GeminiResponse = { // nested JSON structure
      candidates?: { // ? means optional
        content?: {
          parts?: {
            text?: string;
          }[];
        };
      }[];
    };

    // logging the API key for debugging
    console.log("Prompt received:", prompt);
    console.log("Calling Gemini API...");
    console.log("Using API key:", apiKey); // (Only for testing! Don’t log secrets in production)



    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }] // here is the prompt
      })
    });


    
    const data = await response.json() as GeminiResponse;

    // logging the response for debugging
    console.log("Response from Gemini:", data);


    // Check and extract response
    const recipeText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!recipeText) {
      return failure('Gemini did not return a valid response.');
    }

    return success(recipeText)

  } catch (err: any) {
  console.error('Gemini API error:', err.message || err);
  return failure('Something went wrong calling Gemini.');
  }
}
