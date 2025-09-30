<script>
  import { createEventDispatcher } from 'svelte';
  import { user } from '../../stores/user.js';
  
  let isMenuOpen = false;
  let isSearchExpanded = false;
  let mobileSearchInput = '';
  
  const dispatch = createEventDispatcher();

  // Ouvrir le menu mobile
  function openMobileMenu() {
    isMenuOpen = true;
    document.body.style.overflow = 'hidden'; // Empêche le scroll
  }

  // Fermer le menu mobile
  function closeMobileMenu() {
    isMenuOpen = false;
    document.body.style.overflow = 'auto'; // Réactive le scroll
  }

  // Fermer en cliquant sur l'overlay
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  }

  // Gestion du formulaire de recherche mobile
  function toggleMobileSearch(e) {
    e.preventDefault();
    if (!isSearchExpanded) {
      isSearchExpanded = true;
    } else if (mobileSearchInput.trim()) {
      // Effectuer la recherche
      dispatch('search', mobileSearchInput.trim());
      mobileSearchInput = '';
      isSearchExpanded = false;
    } else {
      isSearchExpanded = false;
    }
  }

  // Gestion de la recherche desktop
  function handleDesktopSearch(e) {
    e.preventDefault();
    let searchInput;
    
    if (e.key === 'Enter') {
      searchInput = e.target.value.trim();
    } else {
      // Clic sur le bouton
      const input = e.target.previousElementSibling || e.target.parentElement.querySelector('input');
      searchInput = input.value.trim();
    }
    
    if (searchInput) {
      dispatch('search', searchInput);
      // Optionnel: vider le champ après recherche
      const input = e.target.tagName === 'INPUT' ? e.target : e.target.previousElementSibling || e.target.parentElement.querySelector('input');
      if (input) input.value = '';
    }
  }

  // Navigation
  function navigate(path) {
    dispatch('navigate', path);
    closeMobileMenu();
  }

  // Déconnexion
  function logout() {
    localStorage.removeItem("token");
    user.set(null);
    navigate('/');
  }
</script>

<header>
  <!-- Menu hamburger mobile overlay -->
  {#if isMenuOpen}
    <div 
      class="mobile-menu-overlay active"
      onclick={handleOverlayClick}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()}
      aria-label="Fermer le menu mobile"
    >
      <div class="mobile-menu active">
        <button 
          class="mobile-menu-close" 
          onclick={closeMobileMenu}
          aria-label="Fermer le menu"
        >
          &times;
        </button>
        <nav class="mobile-nav">
          <button onclick={() => navigate('/')}>Accueil</button>
          <button onclick={() => navigate('/My-library')}>Ma Bibliothèque</button>
          {#if $user}
            <button onclick={logout}>Se déconnecter</button>
          {:else}
            <button onclick={() => navigate('/login')}>Se connecter</button>
            <button onclick={() => navigate('/register')}>Créer un compte</button>
          {/if}
        </nav>
      </div>
    </div>
  {/if}

  <!-- Header principal -->
  <button 
    class="mobile-menu-btn" 
    onclick={openMobileMenu}
    aria-label="Ouvrir le menu mobile"
  >
    ☰
  </button>
  
  <h1>Blabla-book</h1>

  <!-- Formulaire de recherche mobile -->
  <div class="mobile-search-form" class:expanded={isSearchExpanded}>
    <input 
      type="text" 
      placeholder="Rechercher..." 
      bind:value={mobileSearchInput}
      onkeydown={(e) => e.key === 'Enter' && toggleMobileSearch(e)}
    >
    <button 
      type="button" 
      class="mobile-search-btn" 
      onclick={toggleMobileSearch}
      aria-label="Rechercher"
    >
      🔍
    </button>
  </div>

  <!-- Navigation desktop -->
  <nav class="desktop-nav">
    <ul>
      <li><button onclick={() => navigate('/')}>Accueil</button></li>
      <li><button onclick={() => navigate('/My-library')}>Ma Bibliothèque</button></li>
      <li>
        <div class="search-box">
          <input type="text" placeholder="Rechercher" onkeydown={(e) => e.key === 'Enter' && handleDesktopSearch(e)}>
          <button type="button" onclick={(e) => handleDesktopSearch(e)} aria-label="Rechercher">🔍</button>
        </div>
      </li>
      {#if $user}
        <li class="menu-deroulant">
          <button>{$user.username}</button>
          <ul class="sous-menu">
            <li><button onclick={logout}>Se déconnecter</button></li>
          </ul>
        </li>
      {:else}
        <li class="menu-deroulant">
          <button>Connexion</button>
          <ul class="sous-menu">
            <li><button onclick={() => navigate('/login')}>Se connecter</button></li>
            <li><button onclick={() => navigate('/register')}>Créer un compte</button></li>
          </ul>
        </li>
      {/if}
    </ul>
  </nav>
</header>

