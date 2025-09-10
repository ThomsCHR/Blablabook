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

  // ⚠️ Mets ici les VRAIS IDs depuis ta table "status"
  const STATUS = { TO_READ: 1, READ: 2 };

  async function loadBooksFor(u) {
    loading = true; error = "";
    try {
      const token = localStorage.getItem("token");
      if (!token) { error = "Utilisateur non connecté"; return; }

      const payload = await getAllUserBooks(u.id);
      const list = (Array.isArray(payload) ? payload : []).map(b => {
        // ✅ On se base sur l'ID du statut (fiable), pas sur le nom
        const statusId = Number(b.status?.id ?? b.status_id ?? b.statusId ?? 0);
        const isRead = statusId === STATUS.READ;

        return {
          id: b.book_id ?? b.id,
          title: b.title,
          image: b.image || "",
          statusId,  // <-- utile pour l’UI/optimistic update
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
  <main class="library-page"><p>Chargement…</p></main>
{:else if error}
  <main class="library-page"><p style="color:#c00">{error}</p></main>
{:else}
  <MyLibraryView
    userId={$userStore.id}
    toRead={toReadBooks}
    read={readBooks}
  />
{/if}
