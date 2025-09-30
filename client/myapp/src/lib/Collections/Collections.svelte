<script>
  import { user } from '../../stores/user.js';
  import { deleteBook } from '../../stores/admin.js';
  import { onMount } from 'svelte';
  
  export let books = [];

  let activeFilter = "all";
  let currentPage = 1;
  const itemsPerPage = 20; // nombre de livres par page

  // Vérifier si l'utilisateur est admin
  $: isAdmin = $user?.role === 'admin';

  // Fonction pour supprimer un livre (admin seulement)
  async function handleDeleteBook(bookId, bookTitle) {
    if (!isAdmin) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le livre "${bookTitle}" de la collection ?`)) {
      const success = await deleteBook(bookId);
      if (success) {
        // Recharger la page pour actualiser la liste
        window.location.reload();
      } else {
        alert('Erreur lors de la suppression du livre');
      }
    }
  }

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

  // remonter en haut de la page
  let showScrollTop = false;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  onMount(() => {
    const handleScroll = () => {
      showScrollTop = window.scrollY > 300; // apparaît après 300px de scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
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
              {#if isAdmin}
                <button 
                  class="admin-delete-btn" 
                  on:click={() => handleDeleteBook(book.id, book.title)}
                  title="Supprimer ce livre (Admin)"
                >
                  ✕
                </button>
              {/if}
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
  {#if showScrollTop}
  <button class="scroll-top-btn" on:click={scrollToTop} title="Remonter en haut">
    ⬆
  </button>
  {/if}
</main>

<style>
  
</style>