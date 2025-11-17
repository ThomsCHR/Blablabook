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

  // message d'erreur pour l'ajout (affiché dans la page)
  let addError = "";

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
    showAddBookForm = false; // réinitialiser le formulaire d'ajout

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
    addError = ""; // reset message
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

    // Validation simple (sans alert)
    addError = "";
    if (!newBook.title || !newBook.author || !newBook.summary) {
      addError = "Veuillez remplir au moins le titre, l'auteur et le résumé.";
      return;
    }

    isAddingBook = true;

    try {
      const bookData = {
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        summary: newBook.summary.trim(),
        image: newBook.image?.trim() || null,
        genre: newBook.genre?.trim() || null,
      };

      const addedBook = await createBook(bookData);

      // Reset form après succès nouvel ajout
      resetForm();
      showAddBookForm = false;
      addError = "";

      // Rediriger vers la page du livre nouvellement créé
      push(`/BookDetail/${addedBook.id}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);

      // Affichage texte (pas d'alert)
      if (error?.status === 409 || /existe déjà/i.test(error?.message || "") || (error?.message ?? "").includes("409")) {
        addError = "Ce livre existe déjà pour cet auteur.";
      } else if (error?.status === 401 || (error?.message ?? "").includes("401")) {
        addError = "Session expirée. Veuillez vous reconnecter.";
      } else if (error?.status === 400 || (error?.message ?? "").includes("400")) {
        addError = "Données invalides. Vérifiez les champs obligatoires.";
      } else if (error?.status === 404 || (error?.message ?? "").includes("404")) {
        addError = "Genre inconnu. Vérifiez l'orthographe du genre.";
      } else {
        addError = error?.message || "Erreur lors de l'ajout du livre.";
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
      // tu peux aussi afficher un message texte ici si tu veux éviter tout alert
      // addError = "Aucune couverture trouvée sur Open Library pour ces infos.";
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

          {#if addError}
            <div class="banner error" role="alert" aria-live="assertive">
              {addError}
            </div>
          {/if}

          <form on:submit|preventDefault={handleAddBook}>
            <div class="form-group">
              <label for="title">Titre *</label>
              <input
                type="text"
                id="title"
                bind:value={newBook.title}
                required
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
                on:click={() => { showAddBookForm = false; resetForm(); addError = ""; }}
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

