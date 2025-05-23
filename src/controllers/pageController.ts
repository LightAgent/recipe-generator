import type { RecipeResponseModel } from '../models/recipe.model.ts';
// import dotenv from 'dotenv';
// import fetch from 'node-fetch';
import { GoogleGenAI } from "@google/genai";

function success(description: string): RecipeResponseModel {
  return { description } as RecipeResponseModel;
}

function failure(error: string): RecipeResponseModel {
  return { error } as RecipeResponseModel;
}


export async function generateRecipe(prompt: string): Promise<RecipeResponseModel> {
  try {
    const apiKey = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    const response = await apiKey.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    
    const data = response.text;

    // logging the response for debugging
    console.log("Response from Gemini:", data);
    
    if (!data) {
      return failure('Gemini did not return a valid response.');
    }

    return success(data)

  } catch (err: any) {
    console.error('Gemini API error:', err.message || err);
    return failure('Something went wrong calling Gemini.');
  }
}
