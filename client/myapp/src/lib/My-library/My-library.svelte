<script>
  export let toRead = []; // [{ id, title, image }]
  export let read   = []; // [{ id, title, image }]

  if (!Array.isArray(toRead)) toRead = [];
  if (!Array.isArray(read)) read = [];

  function scrollCarousel(carouselId, direction) {
    const el = document.getElementById(carouselId);
    if (!el) return;
    el.scrollBy({ left: 200 * direction, behavior: "smooth" });
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
          {#each toRead as book (book.id)}
            <a href={`#/BookDetail/${book.id}`} class="book">
              {#if book.image}
                <img src={book.image} alt={book.title} />
              {:else}
                <div class="no-cover">Sans couverture</div>
              {/if}
              <p class="book-title">{book.title}</p>
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
          {#each read as book (book.id)}
            <a href={`#/BookDetail/${book.id}`} class="book">
              {#if book.image}
                <img src={book.image} alt={book.title} />
              {:else}
                <div class="no-cover">Sans couverture</div>
              {/if}
              <p class="book-title">{book.title}</p>
            </a>
          {/each}
        </div>
        <button class="carousel-btn carousel-next" on:click={() => scrollCarousel('read', 1)}>›</button>
      </div>
    {/if}
  </section>
</main>

<style>
 /* ===== PAGE BIBLIOTHÈQUE ===== */
.library-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Panneaux */
.library-section {
  margin: 40px 0;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(44, 62, 80, 0.12);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

/* En-tête de section — calqué sur index */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(44, 62, 80, 0.15);
  padding-bottom: 12px;
}
.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 700;
}
.view-all-link {
  color: #2c3e50;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}
.view-all-link:hover {
  color: #34495e;
  text-decoration: underline;
}

/* RANGÉES DE LIVRES — même logique que l’index */
.book-row {
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
  margin-top: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  align-items: center;
}
.book-row::-webkit-scrollbar { height: 8px; }
.book-row::-webkit-scrollbar-track {
  background: rgba(44, 62, 80, 0.1);
  border-radius: 4px;
}
.book-row::-webkit-scrollbar-thumb {
  background: rgba(44, 62, 80, 0.3);
  border-radius: 4px;
}
.book-row::-webkit-scrollbar-thumb:hover {
  background: rgba(44, 62, 80, 0.5);
}

/* Boutons carrousel (sobres) */
.carousel-container { position: relative; display: flex; align-items: center; gap: 12px; }
.carousel-btn {
  width: 40px; height: 40px; border-radius: 50%;
  border: none; background: rgba(44,62,80,.85); color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.2rem; cursor: pointer;
  box-shadow: 0 8px 20px rgba(0,0,0,.2);
  transition: transform .15s ease, background .2s ease;
  flex-shrink: 0;
}
.carousel-btn:hover { transform: scale(1.05); background: rgba(44,62,80,1); }

/* Cartes livre — compact, focus sur la cover */
.book { 
  flex-shrink: 0; width: 170px; text-align: center; 
  text-decoration: none; color: inherit;
  display: block; transition: transform 0.2s ease;
}
.book:hover { transform: translateY(-2px); }
.book img {
  width: 170px; height: 240px; object-fit: cover;
  border-radius: 10px; display: block; margin: 0 auto;
  box-shadow: 0 14px 28px rgba(0,0,0,.18);
  transition: transform .15s ease, box-shadow .15s ease;
}
.book:hover img { 
  transform: translateY(-2px); 
  box-shadow: 0 18px 34px rgba(0,0,0,.22); 
}

.no-cover {
  width: 170px; height: 240px; background: #f0f0f0; color: #888;
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 14px 28px rgba(0,0,0,.1);
  transition: transform .15s ease, box-shadow .15s ease;
}
.book:hover .no-cover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(0,0,0,.15);
}

/* Titre discret (plus petit que tout à l’heure) */
.book-title {
  margin: 8px 0 0;
  font-size: 0.85rem;
  color: #2c3e50;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ===== MEDIA QUERIES (mêmes repères que l’index) ===== */
@media (max-width: 768px) {
  .library-page { padding: 16px; }
  .library-section { margin: 28px 0; padding: 18px; }
  .section-header h2 { font-size: 1.3rem; }
  .book-row { gap: 1.2rem; padding: 0.5rem 0; margin-top: 15px; }
  .book { width: 140px; }
  .book img, .no-cover { width: 140px; height: 200px; }
  .book-title { font-size: 0.8rem; }
  .carousel-btn { width: 36px; height: 36px; font-size: 1.1rem; }
}

@media (max-width: 480px) {
  .book { width: 120px; }
  .book img, .no-cover { width: 120px; height: 170px; }
  .book-title { font-size: 0.78rem; }
}
</style>
