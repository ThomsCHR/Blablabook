<script>
  // Importation des modules nécessaires
  import Router, { push, location } from 'svelte-spa-router'; // Router pour la navigation
  import { onMount } from 'svelte'; // Hook pour exécuter du code après le montage du composant
  import { user } from './stores/user.js'; // Store pour gérer l'état de l'utilisateur

  // Importation des fonctions API
  import { getMe } from './api/auth.js'; // Fonction pour récupérer les informations de l'utilisateur connecté
  import { searchBooksByName } from './api/book.js'; // Fonction pour rechercher des livres

  // Composant pour les transitions de pages
  import PageTransition from './components/PageTransition.svelte';

  // Importation des pages
  import Login from './pages/auth/Login.svelte';
  import BookDetail from './pages/BookDetail.svelte';
  import Contact from './pages/Contact.svelte';
  import Error from './pages/Error.svelte';
  import Index from './pages/index.svelte';
  import Mentions from './pages/Mentions.svelte';
  import MyLibrary from './pages/My-library.svelte';
  import Politic from './pages/Politic.svelte';
  import Profil from './pages/profil.svelte';
  import Register from './pages/Register.svelte';
  import About from './pages/about.svelte';
  import Collections from './pages/Collections.svelte';
  import SearchResults from './pages/SearchResults.svelte';
  import Admin from './pages/Admin.svelte';

  // Configuration des routes
  const routes = {
    '/': Index, // Route pour la page d'accueil
    '/Politic': Politic, // Route pour la page Politique
    '/Mentions': Mentions, // Route pour les mentions légales
    '/Contact': Contact, // Route pour la page Contact
    '/My-library': MyLibrary, // Route pour la bibliothèque personnelle
    '/profil': Profil, // Route pour le profil utilisateur
    '/BookDetail/:id': BookDetail, // Route pour les détails d'un livre
    '/search': SearchResults, // Route pour les résultats de recherche
    '/login': Login, // Route pour la connexion
    '/register': Register, // Route pour l'inscription
    '/about': About, // Route pour la page À propos
    '/Collections': Collections, // Route pour les collections
    '/admin': Admin, // Route pour l'administration
    '*': Error // Route par défaut pour les erreurs
  };

  // Suivi de la route actuelle pour les transitions
  let currentRoute = '';
  $: currentRoute = $location || '/';

  // État de l'interface utilisateur
  let mobileMenuOpen = false; // État du menu mobile
  let mobileSearchOpen = false; // État de la recherche mobile
  const toggleMobileMenu = () => (mobileMenuOpen = !mobileMenuOpen); // Fonction pour ouvrir/fermer le menu mobile
  const toggleMobileSearch = () => (mobileSearchOpen = !mobileSearchOpen); // Fonction pour ouvrir/fermer la recherche mobile

  // Recherche (desktop + mobile)
  let searchQuery = ''; // Requête de recherche pour desktop
  let mobileSearchQuery = ''; // Requête de recherche pour mobile

  // Fonction pour effectuer une recherche sur desktop
  function onSearchDesktop() {
    const q = searchQuery.trim();

    if (!q) return;
    searchBooks(q);
    searchQuery = ''; // Vider le champ après recherche

  }

  // Fonction pour effectuer une recherche sur mobile
  function onSearchMobile() {
    const q = mobileSearchQuery.trim();

    if (!q) return;
    searchBooks(q);
    mobileSearchQuery = ''; // Vider le champ après recherche
    mobileSearchOpen = false;

  }

  // État de l'application après l'initialisation
  let appReady = false;

  // Charger l'utilisateur connecté au démarrage
  onMount(async () => {
    try {
      const me = await getMe(); // Récupérer les informations de l'utilisateur
      user.set(me ?? null); // Mettre à jour le store utilisateur
    } catch (e) {
      console.error('[App] getMe() failed:', e); // Afficher une erreur en cas d'échec
      user.set(null); // Réinitialiser l'utilisateur
    } finally {
      appReady = true; // Marquer l'application comme prête
    }
  });

  // Réinitialiser les menus quand on repasse en desktop
  onMount(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        mobileMenuOpen = false; // Fermer le menu mobile
        mobileSearchOpen = false; // Fermer la recherche mobile
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileSearchOpen) {
        mobileSearchOpen = false; // Fermer la recherche mobile avec Échap
      }
    };

    const handleClickOutside = (e) => {
      const mobileSearchForm = document.querySelector('.mobile-search-form');
      if (mobileSearchOpen && mobileSearchForm && !mobileSearchForm.contains(e.target)) {
        mobileSearchOpen = false; // Fermer la recherche mobile en cliquant à l'extérieur
      }
    };

    // Ajouter les gestionnaires d'événements
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    // Supprimer les gestionnaires d'événements lors du démontage
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  });

  // Fonction pour rechercher des livres
  async function searchBooks(query) {
    try {
      const books = await searchBooksByName(query); // Appeler l'API pour rechercher des livres

      if (books.length === 1) {
        const book = books[0];
        push(`/BookDetail/${book.id}`); // Aller directement au détail du livre si un seul résultat
      } else {

        // 0 ou plusieurs => page résultats (affichera "aucun résultat" si 0)
        // Force la navigation même si on est déjà sur /search
        const newUrl = `/search?q=${encodeURIComponent(query)}`;
        if ($location === '/search') {
          // Si on est déjà sur /search, forcer le rechargement en changeant l'URL
          push('/');
          setTimeout(() => push(newUrl), 10);
        } else {
          push(newUrl);
        }

      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error); // Afficher une erreur en cas d'échec
      alert('Erreur lors de la recherche'); // Alerte utilisateur
    }
  }

  // Fonction pour se déconnecter
  function logout() {
    localStorage.removeItem('token'); // Supprimer le token de connexion
    user.set(null); // Réinitialiser l'utilisateur
    push('/login'); // Rediriger vers la page de connexion
  }

  // Fonction pour naviguer et revenir en haut de la page
  const navigateAndScrollTop = async (route) => {
    push(route.replace('#/', '/')); // Naviguer vers la route
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Revenir en haut avec un délai
    }, 50);
  };

// darktheme
let dark = false;

onMount(() => {
  // Vérifie si déjà en dark mode via localStorage
  dark = localStorage.getItem("theme") === "dark";
  updateTheme();
});

function toggleTheme() {
  dark = !dark;
  localStorage.setItem("theme", dark ? "dark" : "light");
  updateTheme();
}

function updateTheme() {
  document.body.classList.toggle("dark", dark);

}
</script>

{#if appReady}
  <header>
     <!-- svelte-ignore a11y-click-events-have-key-events -->
     <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- Menu mobile overlay -->
    {#if mobileMenuOpen}
    <div class="mobile-menu-overlay active" on:click={toggleMobileMenu}>
      <div class="mobile-menu active" on:click|stopPropagation={() => {}}>
        <!-- bouton pour le there dark -->
         <button on:click={toggleTheme} style="position:absolute; top:33px; left:16px; z-index:1000;">
          {dark ? "🌙" : "☀️"} </button>
        <button class="mobile-menu-close" on:click={toggleMobileMenu}>&times;</button>
        <nav class="mobile-nav">
          <a href="#/" on:click={toggleMobileMenu}>Accueil</a>
          <a href="#/Collections" on:click={toggleMobileMenu}>Notre Collection</a>
          <a href="#/My-library" on:click={toggleMobileMenu}>Ma Bibliothèque</a>
          {#if $user}
          <a href="#/profil" on:click={toggleMobileMenu}>Mon profil</a>
            {#if $user.role === 'admin' || $user.isAdmin}
              <a href="#/admin" on:click={toggleMobileMenu}>Administration</a>
            {/if}
            <a href="#/" on:click|preventDefault={() => { logout(); toggleMobileMenu(); }}>Se déconnecter</a>
          {:else}
            <a href="#/login" on:click={toggleMobileMenu}>Se connecter</a>
            <a href="#/register" on:click={toggleMobileMenu}>Créer un compte</a>
          {/if}
        </nav>
      </div>
    </div>
  {/if}

  

    <!-- Bouton hamburger pour ouvrir le menu mobile -->
    <button class="mobile-menu-btn" on:click={toggleMobileMenu}>☰</button>

    <!-- Logo et titre du site test -->
    <a href="#/" class="logo-container">
      <img src="/logo.png" alt="Blabla-book" class="logo" />
      <h1>Blabla-book</h1>
    </a>

    <!-- Formulaire de recherche mobile -->
    <div class="mobile-search-form {mobileSearchOpen ? 'expanded' : ''}">
      <input
        type="text"
        placeholder="Rechercher..."
        bind:value={mobileSearchQuery}
        on:keydown={(e) => {
          if (e.key === 'Enter') onSearchMobile(); // Lancer la recherche
          if (e.key === 'Escape') { // Fermer la recherche
            mobileSearchOpen = false;
            e.target;
          }
        }}
        on:focus={() => mobileSearchOpen = true}
        on:blur={() => {
          // Délai pour permettre le clic sur le bouton
          setTimeout(() => {
            if (!mobileSearchQuery.trim()) {
              mobileSearchOpen = false;
            }
          }, 150);
        }}
      />
      <button type="button" class="mobile-search-btn" on:click={() => {
        if (!mobileSearchOpen) {
          mobileSearchOpen = true;
          // Focus l'input après l'expansion
          setTimeout(() => {
            document.querySelector('.mobile-search-form input');
          }, 100);
        } else if (mobileSearchQuery.trim()) {
          onSearchMobile();
        }
      }}>
        🔍
      </button>
    </div>

    <!-- Navigation desktop -->
    <nav class="desktop-nav">
      <a href="#/">Accueil</a>
      <a href="#/Collections">Notre Collection</a>
      <a href="#/My-library">Ma Bibliothèque</a>

      <div class="search-box">
        <input
          type="text"
          placeholder="Rechercher"
          bind:value={searchQuery}
          on:keydown={(e) => e.key === 'Enter' && onSearchDesktop()}
        />
        <button type="button" on:click={onSearchDesktop}>🔍</button>
      </div>

      {#if $user}
        <li class="menu-deroulant">
          <p>{$user.username}</p>
          <ul class="sous-menu">
            <li><a href="#/profil">Mon profil</a></li>
            {#if $user.role === 'admin' || $user.isAdmin}
              <li><a href="#/admin">Administration</a></li>
            {/if}
            <li><a href="#/" on:click|preventDefault={logout}>Se déconnecter</a></li>
          </ul>
        </li>
      {:else}
        <li class="menu-deroulant">
          <p>Connexion</p>
          <ul class="sous-menu">
            <li><a href="#/login">Se connecter</a></li>
            <li><a href="#/register">Créer un compte</a></li>
          </ul>
        </li>
      {/if}
      <!-- Bouton pour basculer entre le mode clair et sombre -->
    <button on:click={toggleTheme}>
      {dark ? "🌙" : "☀️"}
    </button>
    </nav>

    

  </header>

  <main class:admin-main={$location === '/admin'}>
    <PageTransition key={currentRoute}>
      <Router {routes} />
    </PageTransition>
  </main>

  <footer>
    <a href="#/Politic" on:click|preventDefault={() => navigateAndScrollTop('#/Politic')}>
      Politique
    </a>
    <a href="#/Mentions" on:click|preventDefault={() => navigateAndScrollTop('#/Mentions')}>
      Mentions Légales
    </a>
    <a href="#/Contact" on:click|preventDefault={() => navigateAndScrollTop('#/Contact')}>
      Contact
    </a>
  </footer>
{:else}
  <main style="padding:16px">Chargement…</main>
{/if}

<style>
/* theme dark */
button {
  border-radius: 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  padding: 8px 12px;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #e0e0e0;
}
header p {
  cursor: pointer;
}
</style>