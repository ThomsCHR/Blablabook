<script>
  export let books = [];

  let activeFilter = "all";
  let currentPage = 1;
  const itemsPerPage = 20; // nombre de livres par page

  // Filtrage des livres selon le filtre actif
  $: filteredBooks =
    activeFilter === "all"
      ? books
      : books.filter((book) =>
          book.genres?.some(
            (genre) => genre.label.toLowerCase() === activeFilter.toLowerCase()
          )
        );

  // Pagination
  $: totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  $: paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion des featured books
  $: featured = paginatedBooks.filter((b) => b.tags?.includes("featured"));
  $: if (!featured.length) featured = paginatedBooks.slice();

  // Fonction pour changer de filtre
  function setFilter(filter) {
    activeFilter = filter;
    currentPage = 1; // revenir à la première page quand on change de filtre
  }

  // Changer de page
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<main>
  <section class="library-section">
    <div class="collections-container">
      <!-- Header avec titre centré -->
      <div class="collections-header">
        <h2>Collections de livres</h2>
      </div>

      <!-- Section des filtres centrés -->
      <div class="collections-filters">
        <div class="filter-container">
          <button
            class="filter-btn {activeFilter === 'all' ? 'active' : ''}"
            on:click={() => setFilter("all")}
            data-filter="all"
          >
            Tous
          </button>
          <button
            class="filter-btn {activeFilter === 'fantasy' ? 'active' : ''}"
            on:click={() => setFilter("fantasy")}
            data-filter="fantasy"
          >
            Fantasy
          </button>
          <button
            class="filter-btn {activeFilter === 'science-fiction'
              ? 'active'
              : ''}"
            on:click={() => setFilter("science-fiction")}
            data-filter="science-fiction"
          >
            Science-Fiction
          </button>
          <button
            class="filter-btn {activeFilter === 'jeunesse' ? 'active' : ''}"
            on:click={() => setFilter("jeunesse")}
            data-filter="jeunesse"
          >
            Jeunesse
          </button>
          <button
            class="filter-btn {activeFilter === 'manga' ? 'active' : ''}"
            on:click={() => setFilter("manga")}
            data-filter="manga"
          >
            Manga
          </button>
          <button
            class="filter-btn {activeFilter === 'philosophie' ? 'active' : ''}"
            on:click={() => setFilter("philosophie")}
            data-filter="philosophie"
          >
            Philosophie
          </button>
          <button
            class="filter-btn {activeFilter === 'classique' ? 'active' : ''}"
            on:click={() => setFilter("classique")}
            data-filter="classique"
          >
            Classique
          </button>
          <button
            class="filter-btn {activeFilter === 'roman' ? 'active' : ''}"
            on:click={() => setFilter("roman")}
            data-filter="roman"
          >
            Roman
          </button>
          <button
            class="filter-btn {activeFilter === 'epopee' ? 'active' : ''}"
            on:click={() => setFilter("epopee")}
            data-filter="epopee"
          >
            Épopée
          </button>
          <button
            class="filter-btn {activeFilter === 'horreur' ? 'active' : ''}"
            on:click={() => setFilter("horreur")}
            data-filter="horreur"
          >
            Horreur
          </button>
          <button
            class="filter-btn {activeFilter === 'policier' ? 'active' : ''}"
            on:click={() => setFilter("policier")}
            data-filter="policier"
          >
            Policier
          </button>
          <button
            class="filter-btn {activeFilter === 'biographie' ? 'active' : ''}"
            on:click={() => setFilter("biographie")}
            data-filter="biographie"
          >
            Biographie
          </button>
        </div>
      </div>

      <!-- Conteneur des livres -->
      <div class="collections-books">
        <div class="book-row expanded">
          {#each featured as book (book.id)}
            <div class="book" data-category="classique">
              <a href={`#/BookDetail/${book.id}`}>
                <img src={book.image} alt={book.title} />
                <p><strong>{book.title}</strong></p>
              </a>
            </div>
          {/each}
        </div>
      </div>

      <!-- Pagination -->
      {#if totalPages > 1}
        <div class="pagination">
          <button on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            ← Précédent
          </button>

          {#each Array(totalPages) as _, i}
            <button
              class:active={currentPage === i + 1}
              on:click={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          {/each}

          <button on:click={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Suivant →
          </button>
        </div>
      {/if}
    </div>
  </section>
</main>

<style>
  /* Pagination uniquement */
  .pagination {
    display: flex;
    justify-content: center;
    margin: 1.5rem 0 2rem 0;
    padding: 1rem;
    gap: 0.5rem;
  }

  .pagination button {
    padding: 0.4rem 0.8rem;
    border: 1px solid transparent;
    background: #c0d4e3;
    cursor: pointer;
    border-radius: 10px;
    transition: transform 0.2s ease;
  }

  .pagination button:hover {
    transform: translateY(-3px);
  }

  .pagination button.active {
    background: #333;
    color: white;
    border-color: #333;
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ton style existant */
  .library-section .book-row {
    flex-wrap: wrap !important;
  }
</style>
