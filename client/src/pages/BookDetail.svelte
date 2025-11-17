<script>
  import { onMount } from "svelte";
  import BookDetail from "../lib/BookDetail/BookDetail.svelte";
  import { getBookById } from "../api/book";
  import { allBooks } from "../api/book";

  export let params; // injecté par svelte-spa-router

  let book = null;
  let loading = true;
  let error = "";

  onMount(async () => {
    try {
      book = await getBookById(params.id);
    } catch (e) {
      error = e?.message ?? "Erreur de chargement";
    } finally {
      loading = false;
    }
  });
</script>




{#if loading}
  <p style="padding:1rem">Chargement…</p>
{:else if error}
  <p style="padding:1rem; color:red">{error}</p>
{:else}
  <!-- On passe le livre récupéré au composant -->
  <BookDetail {book} />
{/if}





