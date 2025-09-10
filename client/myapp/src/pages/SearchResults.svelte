<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { searchBooksByName, createBook } from "../api/book.js";
  import { user } from "../stores/user.js";
  import { fetchOpenLibraryCover } from "../lib/openlibrary.js";

  let books = [];
  let loading = true;
  let error = "";
  let query = "";
  let showAddBookForm = false;
  let isAddingBook = false;

  // Formulaire d'ajout de livre
  let newBook = {
    title: "",
    author: "",
    summary: "",
    image: "",
    genre: "",
  };

  const getQueryFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
    return urlParams.get("q") || "";
  };

  const truncate = (text, length = 100) =>
    text?.length > length ? `${text.substring(0, length)}...` : text;

  // Fonction pour effectuer la recherche
  async function performSearch(searchQuery) {
    if (!searchQuery) {
      loading = false;
      return;
    }

    loading = true;
    error = "";
    books = [];
    showAddBookForm = false; // reinitialiser le formulaire d'ajout

    // Pré-remplir le titre du nouveau livre avec la requête de recherche
    newBook.title = searchQuery;

    try {
      books = await searchBooksByName(searchQuery);
    } catch (e) {
      error = e?.message ?? "Erreur lors de la recherche";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    query = getQueryFromUrl();
    performSearch(query);
  });

  // Écouter les changements d'URL
  $: if (typeof window !== "undefined") {
    const urlQuery = getQueryFromUrl();
    if (urlQuery !== query) {
      query = urlQuery;
      performSearch(query);
    }
  }

  function resetForm() {
    newBook = {
      title: query, // Garder le titre de la recherche
      author: "",
      summary: "",
      image: "",
      genre: "",
    };
  }

  async function toggleAddBookForm() {
    showAddBookForm = !showAddBookForm;
    if (showAddBookForm) {
      resetForm();
      // Essayer de récupérer automatiquement une image (titre connu grâce à query)
      const coverUrl = await fetchOpenLibraryCover({
        title: newBook.title,
        author: newBook.author,
        size: "L",
      });
      if (coverUrl) {
        newBook.image = coverUrl;
      }
    }
  }

  async function handleAddBook() {
    if (isAddingBook) return;

    // Validation simple
    if (!newBook.title || !newBook.author || !newBook.summary) {
      alert("Veuillez remplir au moins le titre, l'auteur et le résumé");
      return;
    }

    isAddingBook = true;

    try {
      const bookData = {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        summary: newBook.summary.trim(),
        image: newBook.image.trim() || null,
        genre: newBook.genre.trim() || null,
      };

      const addedBook = await createBook(bookData);

      // Reset form après succès nouvel ajout
      resetForm();
      showAddBookForm = false;

      // Rediriger vers la page du livre nouvellement créé
      push(`/BookDetail/${addedBook.id}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);

      // Gestion d'erreurs améliorée
      if (error.message && error.message.includes("401")) {
        alert("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message && error.message.includes("400")) {
        alert("Données invalides. Vérifiez les champs obligatoires.");
      } else if (error.message && error.message.includes("404")) {
        alert("Genre inconnu. Vérifiez l'orthographe du genre.");
      } else {
        alert(error.message || "Erreur lors de l'ajout du livre");
      }
    } finally {
      isAddingBook = false;
    }
  }

  // --------- BONUS: debounce auto-fetch quand titre/auteur changent ----------
  let fetchTimer;
  function debounceFetchCover() {
    clearTimeout(fetchTimer);
    fetchTimer = setTimeout(async () => {
      if (!newBook.title?.trim()) return;
      const coverUrl = await fetchOpenLibraryCover({
        title: newBook.title,
        author: newBook.author,
        size: "L",
      });
      if (coverUrl) newBook.image = coverUrl;
    }, 500);
  }

  async function findCoverManually() {
    const coverUrl = await fetchOpenLibraryCover({
      title: newBook.title,
      author: newBook.author,
      size: "L",
    });
    if (coverUrl) {
      newBook.image = coverUrl;
    } else {
      alert("Aucune couverture trouvée sur Open Library pour ces infos.");
    }
  }
</script>

<div class="search-results">
  <h1>Résultats de recherche</h1>

  {#if query}
    <p class="query-info">Recherche pour : "<strong>{query}</strong>"</p>
  {/if}

  {#if loading}
    <p class="loading">Recherche en cours...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if books.length === 0}
    <div class="no-results-section">
      <p class="no-results">Aucun livre trouvé pour "{query}"</p>

      <!-- Section d'actions pour les livres non trouvés -->
      <div class="action-section">
        {#if $user}
          <!-- Utilisateur connecté : proposer d'ajouter le livre -->
          <div class="add-book-suggestion">
            <p class="suggestion-text">
              Ce livre n'existe pas encore dans notre base de données.
            </p>
            <button class="btn-primary" on:click={toggleAddBookForm}>
              Ajouter "{query}" à la base de données
            </button>
          </div>
        {:else}
          <!-- Utilisateur non connecté : proposer de se connecter -->
          <div class="auth-suggestion">
            <p class="suggestion-text">
              Ce livre n'existe pas encore dans notre base de données.
              <br />Connectez-vous pour l'ajouter !
            </p>
            <div class="auth-buttons">
              <button class="btn-primary" on:click={() => push("/login")}>
                Se connecter
              </button>
              <button class="btn-secondary" on:click={() => push("/register")}>
                Créer un compte
              </button>
            </div>
          </div>
        {/if}
      </div>

      <!-- Formulaire d'ajout de livre (si utilisateur connecté) -->
      {#if $user && showAddBookForm}
        <div class="add-book-form">
          <h3>Ajouter un nouveau livre</h3>
          <form on:submit|preventDefault={handleAddBook}>
            <div class="form-group">
              <label for="title">Titre *</label>
              <input
                type="text"
                id="title"
                bind:value={newBook.title}
                required=
                {isAddingBook}
                on:input={debounceFetchCover}
                disabled={isAddingBook}
              />
            </div>

            <div class="form-group">
              <label for="author">Auteur *</label>
              <input
                type="text"
                id="author"
                bind:value={newBook.author}
                required
                on:input={debounceFetchCover}
                disabled={isAddingBook}
              />
            </div>

            <div class="form-group">
              <label for="summary">Résumé *</label>
              <textarea
                placeholder="Écrire un résumé du livre..."
                id="summary"
                bind:value={newBook.summary}
                rows="4"
                required
                disabled={isAddingBook}
              ></textarea>
            </div>

            <div class="form-group">
              <label for="genre">Genre *</label>
              <select
                id="genre"
                bind:value={newBook.genre}
                disabled={isAddingBook}
                required
              >
                <option value="">Sélectionner un genre</option>
                <option value="Biographie">Biographie</option>
                <option value="Classique">Classique</option>
                <option value="Épopée">Épopée</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horreur">Horreur</option>
                <option value="Jeunesse">Jeunesse</option>
                <option value="Manga">Manga</option>
                <option value="Philosophie">Philosophie</option>
                <option value="Policier">Policier</option>
                <option value="Roman">Roman</option>
                <option value="Science-Fiction">Science-Fiction</option>
              </select>
            </div>

            <div class="form-group">
              <label for="image">URL de l'image de couverture</label>
              <div style="display:flex; gap:8px; align-items:center;">
                <input
                  type="url"
                  id="image"
                  bind:value={newBook.image}
                  placeholder="https://... (auto-rempli si trouvé)"
                  disabled={isAddingBook}
                  style="flex:1"
                />
                <button type="button" class="btn-secondary" on:click={findCoverManually} disabled={isAddingBook}>
                  Trouver via Open Library
                </button>
              </div>
              {#if newBook.image}
                <img src={newBook.image} alt="Aperçu couverture" style="max-width:120px;margin-top:10px;border-radius:6px;border:1px solid rgba(44,62,80,0.2);" />
              {/if}
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" disabled={isAddingBook}>
                {#if isAddingBook}
                  Ajout en cours...
                {:else}
                  Ajouter le livre
                {/if}
              </button>
              <button
                type="button"
                class="btn-secondary"
                on:click={() => { showAddBookForm = false; resetForm(); }}
                disabled={isAddingBook}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      {/if}
    </div>
  {:else}
    <div class="books-grid">
      {#each books as book}
        <div
          class="book-card"
          on:click={() => push(`/BookDetail/${book.id}`)}
          on:keydown={(e) => e.key === "Enter" && push(`/BookDetail/${book.id}`)}
          role="button"
          tabindex="0"
        >
          <div class="book-info">
            <h3>{book.title}</h3>
            {#if book.author}
              <p class="author">Par {book.author}</p>
            {/if}
            {#if book.summary}
              <p class="description">{truncate(book.summary)}</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .search-results {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .query-info {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1em;
    font-family: "playfair display", serif;
    font-weight: 500;
  }

  .loading,
  .error,
  .no-results {
    text-align: center;
    padding: 2rem;
    font-size: 1.1em;
    font-family: "playfair display", serif;
    color: #2c3e50;
  }

  .error {
    color: #e74c3c;
  }

  .no-results-section {
    text-align: center;
    margin-top: 2rem;
  }

  .action-section {
    margin: 3rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    border: 2px solid rgba(44, 62, 80, 0.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    max-width: 600px;
    transition: all 0.3s ease;
  }

  .action-section:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    border-color: rgba(44, 62, 80, 0.2);
  }

  .add-book-suggestion,
  .auth-suggestion {
    text-align: center;
  }

  .suggestion-text {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.1em;
    line-height: 1.5;
    font-family: "playfair display", serif;
    font-weight: 500;
  }

  .auth-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: 2px solid #2c3e50;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    font-family: "playfair display", serif;
    position: relative;
    overflow: hidden;
  }

  .btn-primary {
    background: rgba(44, 62, 80, 0.2);
    color: #2c3e50;
  }

  .btn-primary:hover:not(:disabled) {
    background: #2c3e50;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(44, 62, 80, 0.3);
  }

  .btn-secondary {
    background: rgba(173, 216, 230, 0.5);
    color: #2c3e50;
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(173, 216, 230, 0.8);
    transform: translateY(-2px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .add-book-form {
    margin-top: 2rem;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: left;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .add-book-form h3 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
    text-align: center;
    font-family: "playfair display", serif;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: #2c3e50;
    font-family: "playfair display", serif;
    font-size: 0.9rem;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid #2c3e50;
    border-radius: 25px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    color: #2c3e50;
    font-family: "playfair display", serif;
    box-sizing: border-box;
  }

  .form-group textarea {
    border-radius: 15px;
    min-height: 120px;
    resize: vertical;
    line-height: 1.5;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #34495e;
    box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.1);
    background: white;
  }

  .form-group input:disabled,
  .form-group textarea:disabled,
  .form-group select:disabled {
    background-color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .books-grid {
    display: flex;
    gap: 2rem;
    padding: 1rem 0;
    margin-top: 2rem;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    justify-content: flex-start;
    align-items: center;
  }

  .books-grid::-webkit-scrollbar {
    height: 8px;
  }

  .books-grid::-webkit-scrollbar-track {
    background: rgba(44, 62, 80, 0.1);
    border-radius: 4px;
  }

  .books-grid::-webkit-scrollbar-thumb {
    background: rgba(44, 62, 80, 0.3);
    border-radius: 4px;
  }

  .books-grid::-webkit-scrollbar-thumb:hover {
    background: rgba(44, 62, 80, 0.5);
  }

  .book-card {
    text-align: center;
    width: 160px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: transparent;
  }

  .book-card:hover {
    transform: translateY(-8px) scale(1.05);
  }

  .book-card .book-info h3 {
    padding: 8px 4px 4px 4px;
    margin: 0;
    font-size: 0.9rem;
    color: #2c3e50;
    font-weight: 500;
    line-height: 1.2;
    font-family: "playfair display", serif;
  }

  .author {
    padding: 0 4px;
    color: #666;
    font-style: italic;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    font-family: "playfair display", serif;
  }

  .description {
    padding: 0 4px;
    color: #555;
    line-height: 1.5;
    font-size: 0.85rem;
    font-family: "playfair display", serif;
  }

  /* Responsivité adaptée à votre style existant */
  @media (max-width: 768px) {
    .search-results {
      padding: 1rem;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 0;
      margin-top: 1rem;
      overflow: visible;
    }

    .book-card {
      width: 100%;
      max-width: none;
    }

    .add-book-form {
      margin: 1rem;
      padding: 1.5rem;
    }

    .form-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .auth-buttons {
      flex-direction: column;
      align-items: stretch;
    }

    .action-section {
      margin: 2rem auto;
      padding: 1.5rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      padding: 12px 15px;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .search-results {
      padding: 0.5rem;
    }

    .action-section {
      margin: 1rem auto;
      padding: 1rem;
    }

    .add-book-form {
      padding: 1rem;
    }

    .books-grid {
      gap: 0.8rem;
    }

    .book-card .book-info h3 {
      font-size: 0.8rem;
    }

    .author,
    .description {
      font-size: 0.75rem;
    }
  }
</style>
