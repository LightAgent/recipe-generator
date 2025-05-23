export type RecipeResponseModel =
  | { status: 'success'; description: string }
  | { status: 'error'; error: string };
