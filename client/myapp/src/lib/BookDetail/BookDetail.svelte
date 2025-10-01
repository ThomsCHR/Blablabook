<script>
  
  import { user as userStore } from "../../stores/user.js";
  import { addBookToUser } from "../../api/book.js";

  
  export let book; // objet livre : { id, title, author, image, genres, publication_date, summary, ... }

  
  let isMenuOpen = false;          // le petit menu "+ / Lu / À lire"
  let isSaving = false;            // on empêche les clics pendant l'enregistrement
  let errorMessage = "";           // message d'erreur si l'ajout échoue
  let confirmationMessage = "";    // message temporaire de succès

  
  const BOOK_STATUS = {
    READ: { key: "read", label: "Lu", id: 1 },
    TO_READ: { key: "to_read", label: "À lire", id: 2 }
  };

  // Rediriger vers la page de login
  function redirectToLogin() {
    // version hash-based pour rester compatible avec ton router
    window.location.hash = "#/login";
  }

// Récupérer le token d'authentification dans le localStorage
  function getAuthToken() {
    return localStorage.getItem("token");
  }

// Vérifier si l'utilisateur est connecté
  function isLoggedIn() {
    const me = $userStore;
    return Boolean(me?.id && getAuthToken());
  }

// Afficher un message de confirmation temporaire
  function showConfirmation(title) {
    confirmationMessage = `« ${title} » a bien été ajouté dans ta bibliothèque !`;
    // On efface le message après 3 sec (UI légère)
    setTimeout(() => (confirmationMessage = ""), 3000);
  }

// Mettre à jour le statut local du livre (optimiste)
  function setLocalStatus(statusObj) {
    // On met à jour uniquement l'affichage local (optimiste)
    book = { ...book, _status: statusObj.label };
  }

  // Générer le style CSS pour la couverture
  function getCoverStyle(imageUrl) {
    if (!imageUrl) return "";
    return `background-image:url(${imageUrl});background-size:cover;background-position:center;`;
  }

  
  async function handleSetStatus(desiredStatus) {
    // desiredStatus est l'un des objets de BOOK_STATUS (READ ou TO_READ)
    try {
      errorMessage = "";

      // 1) Vérifier l'authentification
      if (!isLoggedIn()) {
        redirectToLogin();
        return;
      }

      // 2) Récupérer l'utilisateur et préparer la requête
      const currentUser = $userStore; // lecture du store Svelte
      const status_id = desiredStatus.id;

      isSaving = true;

      // 3) Appeler l'API pour enregistrer le livre chez l'utilisateur
      await addBookToUser(currentUser.id, {
        title: book.title,
        status_id
      });

      // 4) Mettre à jour l'UI (optimiste + feedback)
      setLocalStatus(desiredStatus);
      isMenuOpen = false;
      showConfirmation(book.title);
    } catch (err) {
      console.error("[BookDetail] handleSetStatus error:", err);
      errorMessage = err?.message || "Impossible d'ajouter ce livre.";
      alert(errorMessage); // feedback basique et visible
    } finally {
      isSaving = false;
    }
  }
</script>

<main class="book-details-page">
  <div class="book-details-container">
    
    <div class="left-section">
      <div class="cover-container">
        <div
          class="cover-placeholder"
          style={getCoverStyle(book?.image)}
        >
          
          <div
            class="book-menu"
            role="button"
            tabindex="0"
            on:mouseenter={() => (isMenuOpen = true)}
            on:mouseleave={() => (isMenuOpen = false)}
            on:click={() => (isMenuOpen = !isMenuOpen)}
            on:keydown={(e) => e.key === "Enter" && (isMenuOpen = !isMenuOpen)}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <button
              class="book-menu-trigger"
              disabled={isSaving}
              title="Ajouter à ma bibliothèque"
              aria-label="Ajouter à ma bibliothèque"
            >
              {#if isSaving}
                …
              {:else if book?._status}
                ✔
              {:else}
                +
              {/if}
            </button>

            {#if isMenuOpen}
              <ul class="book-menu-dropdown" role="menu">
                <li>
                  <button
                    class="book-status-btn"
                    role="menuitem"
                    on:click={() => handleSetStatus(BOOK_STATUS.TO_READ)}
                    disabled={isSaving}
                  >
                    {BOOK_STATUS.TO_READ.label}
                  </button>
                </li>
                <li>
                  <button
                    class="book-status-btn"
                    role="menuitem"
                    on:click={() => handleSetStatus(BOOK_STATUS.READ)}
                    disabled={isSaving}
                  >
                    {BOOK_STATUS.READ.label}
                  </button>
                </li>
              </ul>
            {/if}
          </div>

          {#if !book?.image}
            <div class="cover-label">Pas de couverture</div>
          {/if}
        </div>
      </div>
    </div>

    
    <div class="right-section">
      <div class="book-info">
        <h1 class="book-title">{book?.title || "Titre inconnu"}</h1>
        <p class="book-author">
          de <strong>{book?.author || "Auteur inconnu"}</strong>
        </p>

        {#if book?.genres?.length}
          <p class="book-genres">
            <span class="label">Genres :</span>
            {#each book.genres as genre}
              <span class="chip">{genre.label}</span>
            {/each}
          </p>
        {/if}

        {#if book?.publication_date}
          <p class="book-year">
            <span class="label">Année :</span>
            {book.publication_date}
          </p>
        {/if}

        <div class="book-summary">
          <h2>Résumé</h2>
          <p>{book?.summary || "Aucun résumé disponible"}</p>
        </div>

        {#if confirmationMessage}
          <div class="confirmation-message">{confirmationMessage}</div>
        {/if}
      </div>
    </div>
  </div>
</main>