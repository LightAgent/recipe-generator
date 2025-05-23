<script lang="ts">
  import { generateRecipe } from "../controllers/pageController";
  
  let mealQuery = "";
  let result = "";

    async function handleGenerate() {
        // if (mealQuery.trim() === "") {
        //     alert("Please enter a meal query.");
        //     return;
        // }
        result = "Generating recipe...";
        const response = await generateRecipe(mealQuery);

        
        if ("error" in response) {
          result = `❌ Error: ${response.error}`;
        } else {
          // Explicitly assert the type here
          result = (response as { description: string }).description;
        }
  }
  
</script>

<div class="container">
  <h1>👨‍🍳 What recipe would you like?</h1>
  <input
    type="text"
    bind:value={mealQuery}
    placeholder="e.g. spaghetti carbonara"
  />
  <div style="display: flex; justify-content: center; margin-top: 1rem;">
    <button on:click={handleGenerate}>Generate</button>
  </div>

  {#if result}
    <div class="response">{result}</div>
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

  input[type="text"] {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #3a3a3a;
    color: white;
    font-size: 1rem;
  }

  button {
    margin-top: 1rem;
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

  .response {
    margin-top: 2rem;
    background: #1a1a1a;
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>
