<script>
  import { onMount } from 'svelte';
  import Index from "../lib/Index/Index.svelte";
  import { allBooks } from "../api/book";

  let books = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      books = await allBooks();  // vient de ton clientApi
    } catch (e) {
      error = e?.message ?? 'Erreur de chargement';
    } finally {
      loading = false;
    }
  });
</script>


{#if loading}
  <p style="padding:1rem">Chargement…</p>
{:else if error}
  <p style="padding:1rem;color:#c00">{error}</p>
{:else}
  <!-- Passe les livres au composant d’UI -->
  <Index {books} />
{/if}

