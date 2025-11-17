<script>
  
  import { onMount } from "svelte";

  
  // books: [{ id, title, image, created_at, tags?: string[], genres?: [{label}] }, ...]
  export let books = [];

  
  const FEATURED_STORAGE_KEY = "featuredBooks"; // clé localStorage
  const FEATURED_COUNT = 12;                    // nb de livres "Sélection du jour"
  const LATEST_FALLBACK_COUNT = 6;             // nb de livres en fallback si aucun "new"
  const CAROUSEL_SCROLL_STEP = 200;            // pas de scroll horizontal (px)
  const AUTO_SCROLL_FEATURED_MS = 3000;        // auto-scroll featured (ms)
  const AUTO_SCROLL_LATEST_MS = 3500;          // auto-scroll latest (ms)
  const TODAY = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  
  let featuredBooks = []; // Sélection du jour (12 max), persistée une fois par jour
  let latestBooks = [];   // Derniers ajouts (tag "new" sinon fallback aux + récents)

  // sécurité JSON.parse
  function safeParseJSON(text, fallback = null) {
    try { return JSON.parse(text); } catch { return fallback; }
  }

  // lire la sélection du jour dans localStorage
  function readFeaturedFromStorage() {
    if (typeof window === "undefined") return null;
    return safeParseJSON(localStorage.getItem(FEATURED_STORAGE_KEY), null);
  }

  // écrire la sélection du jour dans localStorage
  function writeFeaturedToStorage(ids) {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      FEATURED_STORAGE_KEY,
      JSON.stringify({ date: TODAY, books: ids })
    );
  }

  
  function pickRandomItems(list, count) {
    // Pioche "count" éléments distincts au hasard, sans modifier l'original
    const pool = list.slice();
    const result = [];
    for (let i = 0; i < count && pool.length > 0; i++) {
      const index = Math.floor(Math.random() * pool.length);
      result.push(pool.splice(index, 1)[0]);
    }
    return result;
  }

  // Trie décroissant selon created_at
  function sortByCreatedAtDesc(arr) {
    return arr
      .slice()
      .sort(
        (a, b) =>
          new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime()
      );
  }

  // Trouve un livre par son ID
  function byId(id) {
    return books.find((b) => b.id === id);
  }

  // Défilement manuel des carrousels
  function scrollCarousel(containerId, direction) {
    // direction: -1 (gauche) ou +1 (droite)
    const el = document.getElementById(containerId);
    if (!el) return;
    el.scrollBy({ left: direction * CAROUSEL_SCROLL_STEP, behavior: "smooth" });
  }

  // Sélection du jour 
  function ensureFeaturedForToday() {
    // 1) Essaye de lire la sélection du jour depuis localStorage
    const stored = readFeaturedFromStorage();

    if (stored?.date === TODAY && Array.isArray(stored.books)) {
      // 2) Si on a une sélection du jour, on "résout" les IDs vers les objets courants
      const resolved = stored.books.map(byId).filter(Boolean);

      // Si la résolution donne quelque chose, on garde
      if (resolved.length) {
        featuredBooks = resolved;
        return;
      }
      // Sinon, on retombe sur une nouvelle sélection (données des livres ont changé)
    }

    // 3) Sinon, on fabrique une nouvelle sélection aléatoire
    const selection = pickRandomItems(books, FEATURED_COUNT);
    featuredBooks = selection;
    writeFeaturedToStorage(selection.map((b) => b.id));
  }

  // Derniers ajouts
  function computeLatestBooks() {
    const taggedNew = books.filter((b) => b?.tags?.includes("new"));
    if (taggedNew.length) {
      latestBooks = sortByCreatedAtDesc(taggedNew);
      return;
    }
    // Fallback: les 6 derniers ajoutés (par created_at)
    latestBooks = sortByCreatedAtDesc(books).slice(0, LATEST_FALLBACK_COUNT);
  }

  // Réactions aux changements de "books"
  $: if (books && books.length) {
    computeLatestBooks();
    // Si on est dans le navigateur, on s'assure d'avoir une sélection du jour
    if (typeof window !== "undefined") ensureFeaturedForToday();
  }

  // Auto défilement des carrousels 
  onMount(() => {
    const featuredEl = document.getElementById("featured");
    const latestEl   = document.getElementById("latest");

    // Auto-scroll toutes les N secondes
    const auto1 = setInterval(() => {
      if (!featuredEl) return;
      const atEnd = featuredEl.scrollLeft + featuredEl.clientWidth >= featuredEl.scrollWidth;
      if (atEnd) featuredEl.scrollTo({ left: 0, behavior: "smooth" });
      else featuredEl.scrollBy({ left: CAROUSEL_SCROLL_STEP, behavior: "smooth" });
    }, AUTO_SCROLL_FEATURED_MS);

    
    const auto2 = setInterval(() => {
      if (!latestEl) return;
      const atEnd = latestEl.scrollLeft + latestEl.clientWidth >= latestEl.scrollWidth;
      if (atEnd) latestEl.scrollTo({ left: 0, behavior: "smooth" });
      else latestEl.scrollBy({ left: CAROUSEL_SCROLL_STEP, behavior: "smooth" });
    }, AUTO_SCROLL_LATEST_MS);

    return () => { clearInterval(auto1); clearInterval(auto2); };
  });
</script>


<section class="banner">
  <h1>
    Bienvenue sur Blabla-book, votre bibliothèque en ligne<br />
    pour découvrir et gérer vos livres préférés.
  </h1>
  <p>
    Que vous soyez passionné de lecture, à la recherche de nouvelles recommandations ou simplement désireux d’organiser votre collection,
    notre plateforme vous accompagne pas à pas. Créez votre propre bibliothèque virtuelle, ajoutez vos coups de cœur, suivez vos lectures
    en cours et explorez de nouveaux univers littéraires grâce à notre système de recommandations.
  </p>
</section>

<main>
 
  <section class="library-section">
    <div class="section-header">
      <h2>Sélection du jour :</h2>
      <a href="#/Collections" class="voir-tout">Voir tout</a>
    </div>

    <div class="carousel-container">
      <button
        class="carousel-btn carousel-prev"
        on:click={() => scrollCarousel("featured", -1)}
        aria-label="Défiler vers la gauche"
        title="Défiler vers la gauche"
      >
        ‹
      </button>

      <div id="featured" class="book-row">
        {#each featuredBooks as book (book.id)}
          <a class="book" href={`#/BookDetail/${book.id}`} aria-label={`Voir ${book.title}`}>
            {#if book?.image}
              <img src={book.image} alt={book.title} />
            {:else}
              <div class="no-image" aria-hidden="true">Pas d’image</div>
            {/if}
            <p>{book?.title || "Titre inconnu"}</p>
          </a>
        {/each}
      </div>

      <button
        class="carousel-btn carousel-next"
        on:click={() => scrollCarousel("featured", 1)}
        aria-label="Défiler vers la droite"
        title="Défiler vers la droite"
      >
        ›
      </button>
    </div>
  </section>

 
  <section class="library-section">
    <div class="section-header">
      <h2>Derniers ajouts :</h2>
    </div>

    <div class="carousel-container">
      <div id="latest" class="book-row">
        {#each latestBooks as book (book.id)}
          <a class="book" href={`#/BookDetail/${book.id}`} aria-label={`Voir ${book.title}`}>
            {#if book?.image}
              <img src={book.image} alt={book.title} />
            {:else}
              <div class="no-image" aria-hidden="true">Pas d’image</div>
            {/if}
            <p>{book?.title || "Titre inconnu"}</p>
          </a>
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
.book {
  display: inline-block;          
  text-decoration: none;          
  color: inherit;                 
  cursor: pointer;                
}
.book-row {
  overflow-x: auto;               
  scrollbar-width: none;          
}
.book-row::-webkit-scrollbar {
  display: none;                  
}
</style>
