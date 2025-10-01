<script>
  
  import { removeBookFromUser, updateBookStatus } from "../../api/book.js";

  
  export let userId;              // identifiant de l'utilisateur
  export let toRead = [];         // liste de livres "À lire"
  export let read   = [];         // liste de livres "Lu"

  // Sert à filtrer les livres invalides (ex: {id: null})
  const isValidBook = (b) => b && (b.id !== undefined && b.id !== null);
  $: toRead = Array.isArray(toRead) ? toRead.filter(isValidBook) : [];
  $: read   = Array.isArray(read)   ? read.filter(isValidBook)   : [];

  
  const SCROLL_STEP = 200; // pixels à défiler à chaque clic
  const STATUS = { READ: 1, TO_READ: 2 }; // ids de statut côté backend

  // Si l'utilisateur n'est pas identifié, on affiche une alerte et on bloque l'action
  function requireUser() {
    if (!userId) {
      alert("Utilisateur non identifié. Reconnecte-toi.");
      return false;
    }
    return true;
  }
 
  // Défilement manuel des carrousels
  function scrollCarousel(containerId, direction) {
    // direction: -1 (gauche) ou +1 (droite)
    const el = document.getElementById(containerId);
    if (!el) return;
    el.scrollBy({ left: SCROLL_STEP * direction, behavior: "smooth" });
  }

  // Supprimer un livre d'une liste (toRead ou read)
  async function handleRemove(bookId, listName) {
    if (!requireUser()) return;

    try {
      // 1) Optimisme : on retire immédiatement 
      const backupToRead = [...toRead];
      const backupRead   = [...read];

      if (listName === "toRead") toRead = toRead.filter(b => b.id !== bookId);
      if (listName === "read")   read   = read.filter(b => b.id !== bookId);

      // 2) API
      await removeBookFromUser(userId, bookId);
    } catch (err) {
      console.error(err);
      alert("Suppression impossible pour le moment. Réessaie plus tard.");
      
    }
  }

  // Bascule un livre entre "À lire" et "Lu"
  async function handleToggle(bookId, currentListName) {
    if (!requireUser()) return;

    // Déterminer le nouveau statut serveur
    const nextStatusId = currentListName === "toRead" ? STATUS.READ : STATUS.TO_READ;

    // Sauvegarde pour rollback si l’API échoue
    const backupToRead = [...toRead];
    const backupRead   = [...read];

    try {
      // 1) Déplacement optimiste dans l'UI
      if (currentListName === "toRead") {
        const book = toRead.find(b => b.id === bookId);
        toRead = toRead.filter(b => b.id !== bookId);
        if (book) read = [book, ...read]; // on le met en tête
      } else {
        const book = read.find(b => b.id === bookId);
        read = read.filter(b => b.id !== bookId);
        if (book) toRead = [book, ...toRead];
      }

      // 2) Appel API
      await updateBookStatus(userId, bookId, nextStatusId);
    } catch (err) {
      console.error(err);
      // 3) Rollback UI si l'API a échoué
      toRead = backupToRead;
      read   = backupRead;
      alert("Impossible de modifier le statut pour le moment.");
    }
  }
</script>

<main class="library-page">
 
  <section class="library-section">
    <div class="section-header">
      <h2>Mes livres à lire :</h2>
      <a href="#/My-library" class="view-all-link">voir tout</a>
    </div>

    {#if toRead.length === 0}
      <p>Aucun livre à lire pour le moment.</p>
    {:else}
      <div class="carousel-container">
        <button
          class="carousel-btn carousel-prev"
          on:click={() => scrollCarousel('toRead', -1)}
          aria-label="Défiler vers la gauche"
          title="Défiler vers la gauche"
        >‹</button>

        <div class="book-row" id="toRead">
          {#each toRead as book (book.id)}
            <a href={`#/BookDetail/${book.id}`} class="book" aria-label={`Voir ${book.title ?? 'Sans titre'}`}>
              <!-- Supprimer -->
              <button
                class="remove-btn"
                title="Retirer de ma bibliothèque"
                aria-label="Retirer de ma bibliothèque"
                on:click|preventDefault|stopPropagation={() => handleRemove(book.id, "toRead")}
              >🗑️</button>

              <!-- Bascule vers 'Lu' -->
              <button
                class="status-btn"
                title="Marquer comme lu"
                aria-label="Marquer comme lu"
                on:click|preventDefault|stopPropagation={() => handleToggle(book.id, "toRead")}
              >🔄</button>

              {#if book.image}
                <img src={book.image} alt={book.title ?? "Couverture"} />
              {:else}
                <div class="no-cover" aria-hidden="true">Sans couverture</div>
              {/if}
              <p class="book-title">{book.title ?? "Sans titre"}</p>
            </a>
          {/each}
        </div>

        <button
          class="carousel-btn carousel-next"
          on:click={() => scrollCarousel('toRead', 1)}
          aria-label="Défiler vers la droite"
          title="Défiler vers la droite"
        >›</button>
      </div>
    {/if}
  </section>


  <section class="library-section">
    <div class="section-header">
      <h2>Mes livres lus :</h2>
      <a href="#/My-library" class="view-all-link">voir tout</a>
    </div>

    {#if read.length === 0}
      <p>Pas encore de livres lus.</p>
    {:else}
      <div class="carousel-container">
        <button
          class="carousel-btn carousel-prev"
          on:click={() => scrollCarousel('read', -1)}
          aria-label="Défiler vers la gauche"
          title="Défiler vers la gauche"
        >‹</button>

        <div class="book-row" id="read">
          {#each read as book (book.id)}
            <a href={`#/BookDetail/${book.id}`} class="book" aria-label={`Voir ${book.title ?? 'Sans titre'}`}>
              <!-- Supprimer -->
              <button
                class="remove-btn"
                title="Retirer de ma bibliothèque"
                aria-label="Retirer de ma bibliothèque"
                on:click|preventDefault|stopPropagation={() => handleRemove(book.id, "read")}
              >🗑️</button>

              <!-- Bascule vers 'À lire' -->
              <button
                class="status-btn"
                title="Repasser à lire"
                aria-label="Repasser à lire"
                on:click|preventDefault|stopPropagation={() => handleToggle(book.id, "read")}
              >🔄</button>

              {#if book.image}
                <img src={book.image} alt={book.title ?? "Couverture"} />
              {:else}
                <div class="no-cover" aria-hidden="true">Sans couverture</div>
              {/if}
              <p class="book-title">{book.title ?? "Sans titre"}</p>
            </a>
          {/each}
        </div>

        <button
          class="carousel-btn carousel-next"
          on:click={() => scrollCarousel('read', 1)}
          aria-label="Défiler vers la droite"
          title="Défiler vers la droite"
        >›</button>
      </div>
    {/if}
  </section>
</main>