<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { user as userStore } from "../stores/user.js";
  import { getAllUserBooks } from "../api/book.js";
  import MyLibraryView from "../lib/My-library/My-library.svelte";

  // Variables principales
  let toReadBooks = [];
  let readBooks = [];
  let loading = true;
  let error = "";
  let fetchedForUserId = null;

  // ⚠️ Mets ici les VRAIS IDs depuis ta table "status"
  const STATUS = { TO_READ: 1, READ: 2 };

  // Charge tous les livres de l'utilisateur
  async function loadBooksFor(user) {
    loading = true;
    error = "";

    try {
      // Vérifier le token
      const token = localStorage.getItem("token");
      if (!token) {
        error = "Vous devez être connecté";
        return;
      }

      // Récupérer les livres depuis l'API
      const books = await getAllUserBooks(user.id);
      const bookList = Array.isArray(books) ? books : [];

      // Séparer les livres en deux listes
      toReadBooks = [];
      readBooks = [];

      bookList.forEach(book => {
        const statusId = Number(book.status?.id ?? book.status_id ?? 0);
        const isRead = statusId === STATUS.READ;

        const bookData = {
          id: book.book_id ?? book.id,
          title: book.title,
          image: book.image || "",
          statusId,
          isRead
        };

        if (isRead) {
          readBooks.push(bookData);
        } else {
          toReadBooks.push(bookData);
        }
      });
    } catch (err) {
      error = "Erreur lors du chargement des livres";
      console.error("Erreur:", err);
    } finally {
      loading = false;
    }
  }

  // Vérifier la connexion au démarrage
  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      loading = false;
      push("/login"); // Rediriger vers la connexion
      return;
    }
  });

  // Charger les livres si l'utilisateur change
  $: if ($userStore?.id && $userStore.id !== fetchedForUserId) {
    fetchedForUserId = $userStore.id;
    loadBooksFor($userStore);
  }
</script>

<!-- Interface utilisateur -->
{#if loading}
  <main class="library-page">
    <p>Chargement de votre bibliothèque...</p>
  </main>
{:else if error}
  <main class="library-page">
    <p style="color: red;">{error}</p>
  </main>
{:else}
  <MyLibraryView
    userId={$userStore.id}
    toRead={toReadBooks}
    read={readBooks}
  />
{/if}