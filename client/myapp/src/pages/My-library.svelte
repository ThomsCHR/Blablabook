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

  // normalise un libellé de statut ("Lu", "a_lire", "a lire", "À lire", etc.)
  function normStatus(raw) {
    return String(raw || "")
      .toLowerCase()
      .normalize("NFD").replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "_"); // "a lire" -> "a_lire"
  }

  async function loadBooksFor(u) {
    loading = true; error = "";
    try {
      const token = localStorage.getItem("token");
      if (!token) { error = "Utilisateur non connecté"; return; }

      const payload = await getAllUserBooks(u.id);

      const list = (Array.isArray(payload) ? payload : []).map(b => {
        const statusName = typeof b.status === "string" ? b.status : (b.status?.name || "");
        const s = normStatus(statusName);
        const isRead = (s === "lu" || s === "read");
        return {
          id: b.book_id ?? b.id,
          title: b.title,
          image: b.image || "",
          isRead
        };
      });

      toReadBooks = list.filter(b => !b.isRead);
      readBooks   = list.filter(b =>  b.isRead);
    } catch (e) {
      error = e?.message || "Erreur de chargement";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      loading = false;
      // Rediriger automatiquement vers la page de connexion si non connecté
      push('/login');
      return;
    }
  });

  // charge dès que l'utilisateur est prêt (et quand il change)
  $: if ($userStore?.id && $userStore.id !== fetchedForUserId) {
    fetchedForUserId = $userStore.id;
    loadBooksFor($userStore);
  }
</script>

{#if loading}
  <main class="library-page"><p>Chargement…</p></main>
{:else if error}
  <main class="library-page"><p style="color:#c00">{error}</p></main>
{:else}
  <MyLibraryView toRead={toReadBooks} read={readBooks} />
{/if}
