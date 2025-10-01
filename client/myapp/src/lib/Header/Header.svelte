<script>
  
  import { createEventDispatcher } from "svelte";
  import { user as userStore } from "../../stores/user.js";

  
  // On envoie des événements "navigate" et "search" au parent
  const dispatch = createEventDispatcher();

  
  let isMobileMenuOpen = false;     // état du menu hamburger
  let isMobileSearchOpen = false;   // état du champ de recherche mobile (déplié/replié)
  let mobileSearchText = "";        // texte saisi en mobile

 
  function lockScroll() {
    // Empêche le scroll de la page quand le menu mobile est ouvert
    document.body.style.overflow = "hidden";
  }

  // Rétablit le scroll
  function unlockScroll() {
    document.body.style.overflow = "auto";
  }

  // mobile : ouvrir/fermer le menu hamburger
  function openMobileMenu() {
    isMobileMenuOpen = true;
    lockScroll();
  }

  // mobile : fermer le menu hamburger
  function closeMobileMenu() {
    isMobileMenuOpen = false;
    unlockScroll();
  }

  // mobile : clic sur l’overlay (en dehors du panneau)
  function handleOverlayClick(e) {
    // Ferme si on clique en dehors du panneau
    if (e.target === e.currentTarget) closeMobileMenu();
  }


  // recherche (mobile + desktop)
  function doSearch(query) {
    const q = String(query || "").trim();
    if (!q) return;
    dispatch("search", q);
  }

  // Mobile : clic sur loupe / Enter dans l’input
  function toggleOrSearchMobile(e) {
    e?.preventDefault?.();
    if (!isMobileSearchOpen) {
      // 1er clic : on ouvre le champ
      isMobileSearchOpen = true;
      return;
    }

    if (mobileSearchText.trim()) {
      // 2e clic ou Enter : on cherche
      doSearch(mobileSearchText);
      mobileSearchText = "";
    }
    // On replie le champ après l'action
    isMobileSearchOpen = false;
  }

  // Desktop : Enter dans l’input OU clic sur le bouton
  function handleDesktopSearch(e) {
    e?.preventDefault?.();

    // Cas 1 : Enter dans l'input
    if (e.type === "keydown" && e.key === "Enter") {
      doSearch(e.currentTarget.value);
      e.currentTarget.value = ""; // optionnel : vider après recherche
      return;
    }

    // Cas 2 : clic sur le bouton
    // On récupère l'input voisin
    const input =
      e.currentTarget.previousElementSibling ||
      e.currentTarget.parentElement.querySelector("input");
    if (input) {
      doSearch(input.value);
      input.value = ""; // optionnel : vider après
    }
  }

  // Navigation (mobile + desktop)
  function navigate(path) {
    dispatch("navigate", path);
    closeMobileMenu(); // sur mobile, on ferme le menu après navigation
  }

  // déconnexion
  function logout() {
    localStorage.removeItem("token");
    userStore.set(null);
    navigate("/");
  }
  // Valeur du store utilisateur : $userStore
  // Sert à afficher "Mon compte / Déconnexion" ou "Connexion / S'inscrire"

</script>

<header>
  <!--  Menu mobile (overlay + panneau) -->
  {#if isMobileMenuOpen}
    <div
      class="mobile-menu-overlay active"
      on:click={handleOverlayClick}
      role="button"
      tabindex="0"
      aria-label="Fermer le menu mobile"
      on:keydown={(e) => e.key === "Escape" && closeMobileMenu()}
    >
      <div class="mobile-menu active" role="dialog" aria-modal="true">
        <button
          class="mobile-menu-close"
          on:click={closeMobileMenu}
          aria-label="Fermer le menu"
        >
          &times;
        </button>

        <nav class="mobile-nav">
          <button on:click={() => navigate("/")}>Accueil</button>
          <button on:click={() => navigate("/My-library")}>Ma Bibliothèque</button>

          {#if $userStore}
            <button on:click={logout}>Se déconnecter</button>
          {:else}
            <button on:click={() => navigate("/login")}>Se connecter</button>
            <button on:click={() => navigate("/register")}>Créer un compte</button>
          {/if}
        </nav>
      </div>
    </div>
  {/if}

  <!-- Barre du haut  -->
  <button
    class="mobile-menu-btn"
    on:click={openMobileMenu}
    aria-label="Ouvrir le menu mobile"
  >
    ☰
  </button>

  <h1>Blabla-book</h1>

  <!--Recherche mobile-->
  <div class="mobile-search-form" class:expanded={isMobileSearchOpen}>
    <input
      type="text"
      placeholder="Rechercher..."
      bind:value={mobileSearchText}
      on:keydown={(e) => e.key === "Enter" && toggleOrSearchMobile(e)}
      aria-label="Rechercher un livre (mobile)"
    />
    <button
      type="button"
      class="mobile-search-btn"
      on:click={toggleOrSearchMobile}
      aria-label="Rechercher"
      title="Rechercher"
    >
      🔍
    </button>
  </div>

  <!--Navigation & recherche desktop -->
  <nav class="desktop-nav">
    <ul>
      <li><button on:click={() => navigate("/")}>Accueil</button></li>
      <li><button on:click={() => navigate("/My-library")}>Ma Bibliothèque</button></li>

      <li>
        <div class="search-box">
          <input
            type="text"
            placeholder="Rechercher"
            on:keydown={handleDesktopSearch}
            aria-label="Rechercher un livre (desktop)"
          />
          <button
            type="button"
            on:click={handleDesktopSearch}
            aria-label="Rechercher"
            title="Rechercher"
          >
            🔍
          </button>
        </div>
      </li>

      {#if $userStore}
        <li class="menu-deroulant">
          <button aria-haspopup="menu" aria-expanded="false">{$userStore.username}</button>
          <ul class="sous-menu" role="menu">
            <li><button on:click={logout} role="menuitem">Se déconnecter</button></li>
          </ul>
        </li>
      {:else}
        <li class="menu-deroulant">
          <button aria-haspopup="menu" aria-expanded="false">Connexion</button>
          <ul class="sous-menu" role="menu">
            <li><button on:click={() => navigate("/login")} role="menuitem">Se connecter</button></li>
            <li><button on:click={() => navigate("/register")} role="menuitem">Créer un compte</button></li>
          </ul>
        </li>
      {/if}
    </ul>
  </nav>
</header>