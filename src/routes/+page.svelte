<script lang="ts">
  
  import { generateRecipe } from "../controllers/pageController";
  import { onMount } from "svelte";

  let availableIngredients: string[] = [];
  let selectedIngredient = "";
  let addedIngredients: string[] = [];
  let result = "";

  onMount(() => {
    // You can replace this with a dynamic fetch if needed
    availableIngredients = [
      "chicken", "beef", "tofu", "rice", "onion", "garlic", "tomato", "carrot",
      "cheese", "basil", "egg", "milk", "butter", "pepper", "spinach", "mushroom"
    ];
  });

  function addIngredient() {
    if (selectedIngredient && !addedIngredients.includes(selectedIngredient)) {
      addedIngredients = [...addedIngredients, selectedIngredient];
    }
    selectedIngredient = "";
  }

  function removeIngredient(ingredient: string) {
    addedIngredients = addedIngredients.filter(i => i !== ingredient);
  }

  async function handleGenerate() {
    if (addedIngredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    result = "Generating recipe...";
    const query = addedIngredients.join(", ");
    const response = await generateRecipe(query);

    if ("error" in response) {
      result = `❌ Error: ${response.error}`;
    } else {
      result = (response as { description: string }).description;
    }
  }
</script>

<div class="container">
  <h1>👨‍🍳 What ingredients do you have?</h1>

  <div class="dropdown-container">
    <input
      list="ingredients"
      bind:value={selectedIngredient}
      placeholder="Search ingredient..."
    />
    <datalist id="ingredients">
      {#each availableIngredients as ingredient}
        <option value={ingredient}></option>
      {/each}
    </datalist>
    <button on:click={addIngredient}>Add</button>
  </div>

  {#if addedIngredients.length}
    <div class="ingredient-list">
      {#each addedIngredients as ingredient}
        <span class="ingredient-tag">
          {ingredient}
          <button class="remove-btn" on:click={() => removeIngredient(ingredient)}>✕</button>
        </span>
      {/each}
    </div>
  {/if}

  <div style="display: flex; justify-content: center; margin-top: 1rem;">
    <button on:click={handleGenerate}>Generate</button>
  </div>

  {#if result}
    <div style="white-space: pre-wrap;">{result}</div>

  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, sans-serif;
    background-color: #1e1e1e;
    color: white;
  }

  .container {
    max-width: 600px;
    margin: 100px auto;
    padding: 5rem;
    background-color: #2b2b2b;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }

  input[list] {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #3a3a3a;
    color: white;
    font-size: 1rem;
  }

  .dropdown-container {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #10a37f;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0d8f6b;
  }

  .ingredient-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .ingredient-tag {
    background-color: #444;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .remove-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }
</style>
