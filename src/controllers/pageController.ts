export async function generateRecipe(mealQuery: string): Promise<string> {
  if (!mealQuery.trim()) return '';
  
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 1000));

  return `Here's a delicious recipe for "${mealQuery}" 🍽️`;
}
