<script>
  
  import { user as userStore } from "../../stores/user.js";
  import { deleteBook } from "../../stores/admin.js";
  import { onMount } from "svelte";

 
  export let books = []; // tableau de livres : [{ id, title, image, genres:[{label}], tags:[...] }, ...]

  
  let selectedGenreFilter = "all"; // filtre actif (ex: "fantasy", "roman", ...)
  let currentPageNumber = 1;       // page courante (1-based)
  const ITEMS_PER_PAGE = 20;       // nb de livres par page

  // Affichage du bouton "remonter en haut"
  let showScrollTop = false;

  
  // Liste unique des filtres (DRY)
  const GENRE_FILTERS = [
    "all",
    "fantasy",
    "science-fiction",
    "jeunesse",
    "manga",
    "philosophie",
    "classique",
    "roman",
    "epopee",
    "horreur",
    "policier",
    "biographie",
  ];

  
  // $userStore = valeur du store; on en déduit si l'utilisateur est admin
  $: isAdmin = $userStore?.role === "admin";

  // Normalisation d'un texte pour comparaison (trim + lowercase)
  function normalize(text) {
    return (text || "").toString().trim().toLowerCase();
  }

  // Vérifie si un livre matche le filtre de genre
  function matchesFilter(book, filter) {
    if (filter === "all") return true;
    // true si un des genres du livre matche le filtre (case-insensitive)
    return book?.genres?.some((g) => normalize(g?.label) === normalize(filter));
  }

  // Vérifie si un livre est "featured"
  function isBookFeatured(book) {
    return Array.isArray(book?.tags) && book.tags.includes("featured");
  }

  // filtrage, pagination, featured
  $: filteredBooks = books.filter((b) => matchesFilter(b, selectedGenreFilter));
 // nombre total de pages
  $: totalPagesCount = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE));
  // livres paginés pour la page courante
  $: paginatedBooks = filteredBooks.slice(
    (currentPageNumber - 1) * ITEMS_PER_PAGE,
    currentPageNumber * ITEMS_PER_PAGE
  );

  // "featured" de la page en cours ; si aucun, on affiche simplement tous les livres paginés
  $: featuredBooks = paginatedBooks.filter(isBookFeatured);
  $: if (!featuredBooks.length) featuredBooks = paginatedBooks.slice();

   // changement de filtre
  function changeFilter(newFilter) {
    selectedGenreFilter = newFilter;
    currentPageNumber = 1; // on revient au début sur changement de filtre
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // navigation vers une page
  function goToPage(page) {
    if (page < 1 || page > totalPagesCount) return;
    currentPageNumber = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // remonter en haut de la page
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Confirmation et suppression d'un livre (admin uniquement)
  async function confirmAndDeleteBook(bookId, bookTitle) {
    if (!isAdmin) return;

    const ok = confirm(`Êtes-vous sûr de vouloir supprimer le livre "${bookTitle}" de la collection ?`);
    if (!ok) return;

    const success = await deleteBook(bookId);
    if (success) {
      // approche simple : rechargement de la page pour refléter la suppression
      window.location.reload();
    } else {
      alert("Erreur lors de la suppression du livre");
    }
  }

  // Gestion du scroll pour afficher le bouton "remonter en haut"
  onMount(() => {
    const handleScroll = () => {
      showScrollTop = window.scrollY > 300; // on affiche le bouton après 300px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<main>
  <section class="library-section">
    <div class="collections-container">
      <div class="collections-header">
        <h2>Collections de livres</h2>
      </div>

      
      <div class="collections-filters">
        <div class="filter-container">
          {#each GENRE_FILTERS as filter}
            <button
              class="filter-btn {selectedGenreFilter === filter ? 'active' : ''}"
              on:click={() => changeFilter(filter)}
              data-filter={filter}
              aria-pressed={selectedGenreFilter === filter}
            >
              {filter === "all" ? "Tous" : (
                filter === "science-fiction" ? "Science-Fiction" :
                filter === "epopee" ? "Épopée" :
                filter.charAt(0).toUpperCase() + filter.slice(1)
              )}
            </button>
          {/each}
        </div>
      </div>

      
      <div class="collections-books">
        <div class="book-row expanded">
          {#each featuredBooks as book (book.id)}
            <div
              class="book"
              data-category={normalize(book?.genres?.[0]?.label) || "inconnu"}
            >
              {#if isAdmin}
                <button
                  class="admin-delete-btn"
                  on:click={() => confirmAndDeleteBook(book.id, book.title)}
                  title="Supprimer ce livre (Admin)"
                  aria-label={`Supprimer ${book.title}`}
                >
                  ✕
                </button>
              {/if}

              <a href={`#/BookDetail/${book.id}`} aria-label={`Voir ${book.title}`}>
                {#if book?.image}
                  <img src={book.image} alt={book.title} />
                {:else}
                  <div class="no-image" aria-hidden="true">Pas d’image</div>
                {/if}
                <p><strong>{book?.title || "Titre inconnu"}</strong></p>
              </a>
            </div>
          {/each}
        </div>
      </div>

      <!-- Pagination -->
      {#if totalPagesCount > 1}
        <div class="pagination" role="navigation" aria-label="Pagination">
          <button
            on:click={() => goToPage(currentPageNumber - 1)}
            disabled={currentPageNumber === 1}
            aria-label="Page précédente"
          >
            ← Précédent
          </button>

          {#each Array(totalPagesCount) as _, i}
            <button
              class:active={currentPageNumber === i + 1}
              on:click={() => goToPage(i + 1)}
              aria-current={currentPageNumber === i + 1 ? "page" : undefined}
              aria-label={`Aller à la page ${i + 1}`}
            >
              {i + 1}
            </button>
          {/each}

          <button
            on:click={() => goToPage(currentPageNumber + 1)}
            disabled={currentPageNumber === totalPagesCount}
            aria-label="Page suivante"
          >
            Suivant →
          </button>
        </div>
      {/if}
    </div>
  </section>

  {#if showScrollTop}
    <button class="scroll-top-btn" on:click={scrollToTop} title="Remonter en haut" aria-label="Remonter en haut">
      ⬆
    </button>
  {/if}
</main>