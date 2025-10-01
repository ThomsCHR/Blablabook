<script>
  
  import { user as userStore } from "../../stores/user.js";
  import { getAllUserBooks } from "../../api/book.js";

  // formulaire (lecture seule pour l'instant)
  let form = { email: "", username: "" };

  
  let isPageLoading = true;     // chargement initial (lecture du store)
  let pageError = "";           // message si non connecté

  
  let isStatsLoading = false;   // chargement des stats
  let readCount = 0;            // nb de livres "Lu"
  let toReadCount = 0;          // nb de livres "À lire"
  let totalCount = 0;           // total de livres de l'utilisateur

  // Contrôle si l'utilisateur est connecté ou pas
  function isLoggedOut(storeValue) {
    return storeValue === null;
  }
  // Contrôle si le store est prêt (valeur chargée, pas undefined)
  function isStoreNotReady(storeValue) {
    return storeValue === undefined;
  }

  // Normalise une chaîne (minuscule, sans accents, trim)
  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();
  }

  // Map toutes les variantes possibles vers "read" ou "to_read", sinon ""
  function normalizeStatus(raw) {
    const s = normalize(
      typeof raw === "string" ? raw : (raw?.name ?? "")
    );
    if (s === "lu" || s === "read") return "read";
    if (s === "a_lire" || s === "a lire" || s === "to_read" || s === "to read") return "to_read";
    return "";
  }

  // Charge les stats de l'utilisateur (nb de livres lus, à lire, total)
  async function loadStats(userId) {
    isStatsLoading = true;
    try {
      const resp = await getAllUserBooks(userId); // [{book_id,title,image,status}, ...]
      const list = Array.isArray(resp) ? resp : []; // sécurité

      let read = 0; // compteurs temporaires
      let toRead = 0; // compteurs temporaires

      for (const b of list) {
        const key = normalizeStatus(b?.status);
        if (key === "read") read++;
        else if (key === "to_read") toRead++;
      }

      readCount = read; // mise à jour des compteurs affichés
      toReadCount = toRead; // mise à jour des compteurs affichés
      totalCount = list.length; // mise à jour des compteurs affichés
    } catch (err) {
      console.error("[profile] loadStats failed:", err);
      // On ne bloque pas l'affichage si 401/erreur réseau
    } finally {
      isStatsLoading = false; // fin du chargement des stats
    }
  }

  // Déconnexion
  function logout() {
    localStorage.removeItem("token");
    userStore.set(null);
    window.location.hash = "#/login";
  }
 
  
  // Quand la valeur du store change, on met à jour l'état de la page
  $: {
    if (isStoreNotReady($userStore)) {
      // store pas encore résolu
      isPageLoading = true;
      pageError = "";
    } else if (isLoggedOut($userStore)) {
      // non connecté
      isPageLoading = false;
      pageError = "Utilisateur non connecté";
      form = { email: "", username: "" };
    } else {
      // connecté : on projette les infos dans le formulaire en lecture seule
      isPageLoading = false;
      pageError = "";
      form.email = $userStore?.email ?? "";
      form.username = $userStore?.username ?? "";
    }
  }

  // Charger/rafraîchir les stats quand l'utilisateur est prêt ou change
  $: if ($userStore?.id) {
    loadStats($userStore.id);
  }
</script>

{#if isPageLoading}
  <main class="profile-page"><p>Chargement…</p></main>
{:else if pageError}
  <main class="profile-page"><p style="color:#c00">{pageError}</p></main>
{:else}
  <main class="profile-page">
    <div class="profile-container">
      <div class="profile-left">
        <div class="profile-bio-section">
          <div class="bio-section"></div>

          <!-- Stats -->
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-number">{isStatsLoading ? "…" : readCount}</div>
              <div class="stat-label">Livres lus</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{isStatsLoading ? "…" : toReadCount}</div>
              <div class="stat-label">À lire</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{isStatsLoading ? "…" : totalCount}</div>
              <div class="stat-label">Total</div>
            </div>
          </div>
        </div>

        <div class="activity-section">
          <h3>Activité récente</h3>
          <div class="activity-item" style="opacity:.7">Bientôt disponible</div>
        </div>
      </div>

      <div class="profile-right">
        <div class="personal-info-section">
          <h2>Informations personnelles</h2>

          <div class="info-field">
            <input
              type="email"
              placeholder="Adresse mail"
              bind:value={form.email}
              disabled
              aria-label="Adresse mail"
            />
            <!-- <button class="edit-btn" on:click|preventDefault={saveProfile} disabled>✏️</button> -->
          </div>

          <div class="info-field">
            <input
              type="text"
              placeholder="Pseudo"
              bind:value={form.username}
              disabled
              aria-label="Pseudo"
            />
            <!-- <button class="edit-btn" on:click|preventDefault={saveProfile} disabled>✏️</button> -->
          </div>

          <div class="action-buttons">
            <button class="logout-btn" on:click={logout}>Se déconnecter</button>
          </div>
        </div>
      </div>
    </div>
  </main>
{/if}
