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

<style>
  /* ===== HEADER ET NAVIGATION ===== */
  header {
    background: linear-gradient(to right, #d4ebf2, #d9c6e5);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 2rem;
    position: sticky;
    top: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #ccc;
    z-index: 1000;
  }

  header h1 {
    font-size: 1.8em;
    font-weight: 600;
  }

  /* Bouton menu mobile */
  .mobile-menu-btn {
    display: none;
    background: white;
    border: 3px solid #2c3e50;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    font-size: 1.5em;
    cursor: pointer;
    color: #2c3e50;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2);
    font-weight: bold;
    position: relative;
    overflow: hidden;
  }

  .mobile-menu-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(44, 62, 80, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .mobile-menu-btn:hover {
    background: #2c3e50;
    color: white;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(44, 62, 80, 0.3);
  }

  .mobile-menu-btn:hover::before {
    left: 100%;
  }

  .mobile-menu-btn:active {
    transform: scale(0.95);
    background: #34495e;
  }

  /* Formulaire de recherche mobile */
  .mobile-search-form {
    display: none;
    position: relative;
    background: white;
    border: 2px solid #2c3e50;
    padding: 0;
    margin: 0;
  }

  .mobile-search-form.expanded {
    /* Aucun style de conteneur quand expandé */
    background: white;
    box-shadow: none;
  }

  .mobile-search-form input {
    width: 40px;
    height: 40px;
    padding: 0 15px 0 15px;
    border: 3px solid #2c3e50;
    border-radius: 25px;
    font-size: 1rem;
    transition: all 0.4s ease;
    background: rgba(255, 255, 255, 0.9);
    color: #2c3e50;
  }

  .mobile-search-form.expanded input {
    width: 200px;
    padding-right: 50px;
    /* Supprime le background conteneur quand expandé */
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid #2c3e50;
    box-shadow: none;
  }

  .mobile-search-form input:focus {
    outline: none;
    border-color: #34495e;
    box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
    background: white;
  }

  .mobile-search-btn {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
    color: #2c3e50;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .mobile-search-btn:hover {
    background: rgba(44, 62, 80, 0.1);
    transform: translateY(-50%) scale(1.1);
  }

  /* Overlay du menu mobile */
  .mobile-menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 2000;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .mobile-menu-overlay.active {
    display: block;
  }

  .mobile-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background: linear-gradient(to right, #d4ebf2, #d9c6e5);
    padding: 2rem 1rem;
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 4px 0 25px rgba(0, 0, 0, 0.3);
    border-right: 3px solid #2c3e50;
  }

  .mobile-menu.active {
    transform: translateX(0);
  }

  .mobile-menu-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: #2c3e50;
    border: 2px solid #2c3e50;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 1.8em;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(44, 62, 80, 0.3);
  }

  .mobile-menu-close:hover {
    background: rgba(44, 62, 80, 0.8);
    border-color: #2c3e50;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(44, 62, 80, 0.4);
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
    margin-top: 5rem;
  }

  .mobile-nav button {
    text-decoration: none;
    color: #2c3e50;
    font-size: 1.2em;
    font-weight: 600;
    padding: 15px;
    border-radius: 25px;
    transition: all 0.3s ease;
    background: rgba(44, 62, 80, 0.2);
    border: 2px solid #2c3e50;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .mobile-nav button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(44, 62, 80, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .mobile-nav button:hover {
    background: #2c3e50;
    color: white;
    border-color: #2c3e50;
    transform: translateX(8px);
    box-shadow: 0 6px 20px rgba(44, 62, 80, 0.3);
  }

  .mobile-nav button:hover::before {
    left: 100%;
  }

  /* Navigation desktop */
  .desktop-nav {
    display: flex;
    gap: 25px;
    align-items: center;
  }

  .desktop-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 25px;
    align-items: center;
  }

  .desktop-nav button {
    background: none;
    border: none;
    color: #2c3e50;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 10px 15px;
    border-radius: 20px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .desktop-nav button:hover {
    background: rgba(44, 62, 80, 0.1);
    color: #2c3e50;
  }

  /* Search box desktop - utilise les styles de app.css */
  /* Les styles sont déjà définis dans app.css */

  /* Menu déroulant */
  .menu-deroulant {
    position: relative;
  }

  .sous-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 2px solid #ccc;
    border-radius: 10px;
    min-width: 200px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
  }

  .menu-deroulant:hover .sous-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .sous-menu button {
    width: 100%;
    text-align: left;
    padding: 12px 20px;
    border-radius: 0;
    background: transparent;
  }

  .sous-menu button:hover {
    background: rgba(44, 62, 80, 0.1);
  }

  /* Media queries pour le responsive */
  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }

    .mobile-menu-btn,
    .mobile-search-form {
      display: flex;
    }

    header {
      padding: 1rem;
      justify-content: space-between;
    }

    header h1 {
      font-size: 1.5em;
      text-align: center;
      margin: 0;
    }
  }

  @media (min-width: 769px) {
    .mobile-menu-btn,
    .mobile-search-form,
    .mobile-menu-overlay {
      display: none !important;
    }
  }
</style>