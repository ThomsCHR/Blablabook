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


  // Fonction simple pour vérifier si un livre est lu
  function isBookRead(status) {
    if (!status) return false;
    
    const statusText = typeof status === "string" ? status : status.name || "";
    const normalizedStatus = statusText.toLowerCase();
    
    return normalizedStatus === "lu" || normalizedStatus === "read";
  }

  // ⚠️ Mets ici les VRAIS IDs depuis ta table "status"
  const STATUS = { TO_READ: 1, READ: 2 };


  // Charge tous les livres de l'utilisateur
  async function loadUserBooks(user) {
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
      
      // Vérifier que nous avons bien un tableau
      const bookList = Array.isArray(books) ? books : [];


      // Séparer les livres en deux listes
      toReadBooks = [];
      readBooks = [];

      bookList.forEach(book => {
        const bookData = {
          id: book.book_id || book.id,
          title: book.title,
          image: book.image || "",

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

        if (isBookRead(book.status)) {
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