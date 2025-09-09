<script>
  import { onMount } from 'svelte'; // Import de la fonction onMount pour exécuter du code après le rendu du composant
  export let books = [];            // Prop "books" passée au composant, contient tous les livres

  // === RANDOM FEATURED UNE FOIS PAR JOUR SIMPLIFIÉ ===
  const today = new Date().toISOString().slice(0, 10); // Date du jour au format YYYY-MM-DD
  let featured = [];                                  // Tableau pour stocker les livres mis en avant

  $: {
    // Vérifie si une sélection de livres pour aujourd'hui existe déjà dans localStorage
    const stored = JSON.parse(localStorage.getItem('featuredBooks') || '{}');

    if (stored.date === today) {
      // Si la sélection du jour existe, on la récupère
      featured = stored.books
        .map(id => books.find(b => b.id === id)) // On transforme les IDs en objets livres
        .filter(Boolean);                        // On supprime les entrées nulles ou indéfinies
    } else {
      // Sinon, on sélectionne 12 livres aléatoires
      const copy = books.slice(); // Copie du tableau pour ne pas modifier l'original
      const selection = [];
      for (let i = 0; i < 12 && copy.length > 0; i++) {
        const index = Math.floor(Math.random() * copy.length); // Choix aléatoire
        selection.push(copy.splice(index, 1)[0]);             // Ajoute le livre et l'enlève de la copie pour éviter les doublons
      }
      featured = selection;
      // Stocke la sélection du jour dans localStorage
      localStorage.setItem('featuredBooks', JSON.stringify({
        date: today,
        books: featured.map(b => b.id)
      }));
    }
  }

  // === DERNIERS AJOUTS ===
  $: latest = books
    .filter(b => b.tags?.includes('new')) // Filtre les livres avec le tag "new"
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Tri par date décroissante

  $: if (!latest.length) {
    // Si aucun livre n'a le tag "new", on prend les 6 derniers livres ajoutés
    latest = books
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }

  // === BOUTON CAROUSEL ===
  function scrollCarousel(id, dir) {
    // Fait défiler le carousel horizontalement
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: 'smooth' }); // Défiler de 200px à gauche ou à droite
  }

  // === AUTO DÉFILEMENT SIMPLE ===
  onMount(() => {
    const feat = document.getElementById('featured'); // Carousel "featured"
    const late = document.getElementById('latest');   // Carousel "latest"

    const auto1 = setInterval(() => {
      if (feat) {
        // Si on arrive au bout, revient au début, sinon avance de 200px
        if (feat.scrollLeft + feat.clientWidth >= feat.scrollWidth)
          feat.scrollTo({ left: 0, behavior: 'smooth' });
        else
          feat.scrollBy({ left: 200, behavior: 'smooth' });
      }
    }, 3000); // Toutes les 3 secondes

    const auto2 = setInterval(() => {
      if (late) {
        if (late.scrollLeft + late.clientWidth >= late.scrollWidth)
          late.scrollTo({ left: 0, behavior: 'smooth' });
        else
          late.scrollBy({ left: 200, behavior: 'smooth' });
      }
    }, 3500); // Toutes les 3,5 secondes

    return () => { clearInterval(auto1); clearInterval(auto2); }; // Nettoyage lors du démontage du composant
  });
</script>

<!-- ========================= SECTION HTML ========================= -->

<section class="banner">
  Bienvenue sur Blabla-book, votre bibliothèque en ligne<br>
  pour découvrir et gérer vos livres préférés.
</section>

<main>
  <!-- SECTION 1 : Mis en avant -->
  <section class="library-section">
    <div class="section-header">
      <h2>Séléction du jour :</h2>
      <a href="#/Collections" class="voir-tout">voir tout</a>
    </div>

    <div class="carousel-container">
      <button class="carousel-btn carousel-prev" on:click={() => scrollCarousel('featured', -1)}>‹</button>

      <div id="featured" class="book-row">
        {#each featured as book (book.id)}
          <!-- Affichage de chaque livre mis en avant -->
          <a class="book" href={`#/BookDetail/${book.id}`}>
            <img src={book.image} alt={book.title} />
            <p>{book.title}</p>
          </a>
        {/each}
      </div>

      <button class="carousel-btn carousel-next" on:click={() => scrollCarousel('featured', 1)}>›</button>
    </div>
  </section>

  <!-- SECTION 2 : Derniers ajouts -->
  <section class="library-section">
    <div class="section-header">
      <h2>Derniers ajouts :</h2>
    </div>

    <div class="carousel-container">


      <div id="latest" class="book-row">
        {#each latest as book (book.id)}
          <!-- Affichage de chaque dernier livre ajouté -->
          <a class="book" href={`#/BookDetail/${book.id}`}>
            <img src={book.image} alt={book.title}/>
            <p>{book.title}</p>
          </a>
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
.book {
  display: inline-block;          /* Affichage en ligne pour le carousel */
  text-decoration: none;          /* Supprime le soulignement */
  color: inherit;                 /* Hérite de la couleur du texte parent */
  cursor: pointer;                /* Curseur pointeur pour indiquer un lien cliquable */
}
.book-row {
  overflow-x: auto;               /* Scroll horizontal si dépassement */
  scrollbar-width: none;          /* Cache la scrollbar sur Firefox */
}
.book-row::-webkit-scrollbar {
  display: none;                  /* Cache la scrollbar sur Chrome, Safari et Edge */
}
</style>
