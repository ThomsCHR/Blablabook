<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { user as userStore } from "../stores/user.js";
  import { getAllUserBooks } from "../api/book.js";
  import MyLibraryView from "../lib/My-library/My-library.svelte";

  let toReadBooks = [];
  let readBooks = [];
  let loading = true;
  let error = "";
  let fetchedForUserId = null;

  const STATUS = { TO_READ: 2, READ: 1 };

  async function loadBooksFor(user) {
    loading = true;
    error = "";

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error = "Vous devez être connecté";
        return;
      }

      const books = await getAllUserBooks(user.id);

      const normalized = (Array.isArray(books) ? books : [])
        .filter(b => b && (b.book_id ?? b.id)) // supprime null / undefined
        .map(b => {
          const statusId = Number(b.status?.id ?? b.status_id ?? 0);
          return {
            id: b.book_id ?? b.id,
            title: b.title ?? "",
            image: b.image ?? "",
            statusId,
            isRead: statusId === STATUS.READ
          };
        });

      toReadBooks = normalized.filter(b => !b.isRead);
      readBooks   = normalized.filter(b =>  b.isRead);

    } catch (err) {
      error = "Erreur lors du chargement des livres";
      console.error("Erreur:", err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      loading = false;
      push("/login");
      return;
    }
  });

  $: if ($userStore?.id && $userStore.id !== fetchedForUserId) {
    fetchedForUserId = $userStore.id;
    loadBooksFor($userStore);
  }
</script>

{#if loading}
  <main class="library-page">
    <p>Chargement de votre bibliothèque...</p>
  </main>

{:else if error}
  <main class="library-page">
    <p style="color: red;">{error}</p>
  </main>

{:else if !$userStore?.id}
  <main class="library-page">
    <p>Vous devez être connecté.</p>
  </main>

{:else}
  <MyLibraryView
    userId={$userStore?.id ?? null}
    toRead={toReadBooks}
    read={readBooks}
  />
{/if}
