<script>
  import { removeBookFromUser, updateBookStatus } from "../../api/book.js";

  export let userId;
  export let toRead = [];
  export let read   = [];

  // ✅ garde seulement les livres valides
  const isBook = (b) => b && (b.id !== undefined && b.id !== null);
  $: toRead = Array.isArray(toRead) ? toRead.filter(isBook) : [];
  $: read   = Array.isArray(read)   ? read.filter(isBook)   : [];

  function scrollCarousel(carouselId, direction) {
    const el = document.getElementById(carouselId);
    if (!el) return;
    el.scrollBy({ left: 200 * direction, behavior: "smooth" });
  }

  async function handleRemove(bookId, listName) {
    if (!userId) {
      alert("Utilisateur non identifié. Reconnecte-toi.");
      return;
    }
    try {
      await removeBookFromUser(userId, bookId);
      if (listName === "toRead") toRead = toRead.filter(b => b && b.id !== bookId);
      if (listName === "read")   read   = read.filter(b => b && b.id !== bookId);
    } catch (e) {
      console.error(e);
      alert("Suppression impossible pour le moment.");
    }
  }

  const STATUS = { READ: 1, TO_READ: 2 };

  async function handleToggle(bookId, listName) {
    if (!userId) {
      alert("Utilisateur non identifié. Reconnecte-toi.");
      return;
    }

    const nextStatusId = listName === "toRead" ? STATUS.READ : STATUS.TO_READ;

    const backupToRead = [...toRead];
    const backupRead = [...read];

    try {
      if (listName === "toRead") {
        const book = toRead.find(b => b && b.id === bookId);
        toRead = toRead.filter(b => b && b.id !== bookId);
        if (book) read = [book, ...read];
      } else {
        const book = read.find(b => b && b.id === bookId);
        read = read.filter(b => b && b.id !== bookId);
        if (book) toRead = [book, ...toRead];
      }

      await updateBookStatus(userId, bookId, nextStatusId);
    } catch (e) {
      console.error(e);
      toRead = backupToRead;
      read = backupRead;
      alert("Impossible de modifier le statut pour le moment.");
    }
  }
</script>

<main class="library-page">
  <!-- À lire -->
  <section class="library-section">
    <div class="section-header">
      <h2>Mes livres à lire :</h2>
      <a href="#/My-library" class="view-all-link">voir tout</a>
    </div>

    {#if toRead.length === 0}
      <p>Aucun livre à lire pour le moment.</p>
    {:else}
      <div class="carousel-container">
        <button class="carousel-btn carousel-prev" on:click={() => scrollCarousel('toRead', -1)}>‹</button>
        <div class="book-row" id="toRead">
          {#each toRead as book (book?.id)}
            <a href={`#/BookDetail/${book.id}`} class="book">
              <button
                class="remove-btn"
                title="Retirer de ma bibliothèque"
                on:click|preventDefault|stopPropagation={() => handleRemove(book.id, "toRead")}
              >🗑️</button>

              <button
                class="status-btn"
                title="Modifier le statut (marquer comme lu)"
                aria-label="Modifier le statut (marquer comme lu)"
                on:click|preventDefault|stopPropagation={() => handleToggle(book.id, "toRead")}
              >🔄</button>

              {#if book.image}
                <img src={book.image} alt={book.title ?? "Couverture"} />
              {:else}
                <div class="no-cover">Sans couverture</div>
              {/if}
              <p class="book-title">{book.title ?? "Sans titre"}</p>
            </a>
          {/each}
        </div>
        <button class="carousel-btn carousel-next" on:click={() => scrollCarousel('toRead', 1)}>›</button>
      </div>
    {/if}
  </section>

  <!-- Lu -->
  <section class="library-section">
    <div class="section-header">
      <h2>Mes livres lus :</h2>
      <a href="#/My-library" class="view-all-link">voir tout</a>
    </div>

    {#if read.length === 0}
      <p>Pas encore de livres lus.</p>
    {:else}
      <div class="carousel-container">
        <button class="carousel-btn carousel-prev" on:click={() => scrollCarousel('read', -1)}>‹</button>
        <div class="book-row" id="read">
          {#each read as book (book?.id)}
            <a href={`#/BookDetail/${book.id}`} class="book">
              <button
                class="remove-btn"
                title="Retirer de ma bibliothèque"
                on:click|preventDefault|stopPropagation={() => handleRemove(book.id, "read")}
              >🗑️</button>

              <button
                class="status-btn"
                title="Modifier le statut (repasser à lire)"
                aria-label="Modifier le statut (repasser à lire)"
                on:click|preventDefault|stopPropagation={() => handleToggle(book.id, "read")}
              >🔄</button>

              {#if book.image}
                <img src={book.image} alt={book.title ?? "Couverture"} />
              {:else}
                <div class="no-cover">Sans couverture</div>
              {/if}
              <p class="book-title">{book.title ?? "Sans titre"}</p>
            </a>
          {/each}
        </div>
        <button class="carousel-btn carousel-next" on:click={() => scrollCarousel('read', 1)}>›</button>
      </div>
    {/if}
  </section>
</main>
