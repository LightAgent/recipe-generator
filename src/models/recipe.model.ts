export interface RecipeResponseModel {
  //discriminated union — a clean way to express either a success or a failure
  description: string;
  error: string;
}