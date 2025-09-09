<script>
  import { user as userStore } from "../../stores/user.js";
  import { getAllUserBooks } from "../../api/book.js";

  // formulaire (inchangé)
  let form = { email: "", username: "" };
  let loading = true;
  let error = "";

  // stats
  let statsLoading = false;
  let readCount = 0;
  let toReadCount = 0;
  let totalCount = 0;

  // état selon le store
  $: if ($userStore === undefined) {
    loading = true;  error = "";
  } else if ($userStore === null) {
    loading = false; error = "Utilisateur non connecté";
  } else {
    loading = false; error = "";
    form.email = $userStore.email ?? "";
    form.username = $userStore.username ?? "";
  }

  async function loadStats(userId) {
    statsLoading = true;
    try {
      const resp = await getAllUserBooks(userId);     // renvoie [{book_id,title,image,status}, ...]
      const arr = Array.isArray(resp) ? resp : [];

      let r = 0, t = 0;
      for (const b of arr) {
        const raw = typeof b.status === "string" ? b.status : (b.status?.name || "");
        const s = raw.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
        if (s === "lu" || s === "read") r++;
        else if (s === "a_lire" || s === "a lire" || s === "to_read" || s === "to read") t++;
      }
      readCount = r;
      toReadCount = t;
      totalCount = arr.length;
    } catch (e) {
      console.error("[profil] loadStats failed:", e);
      // on ne bloque pas la page profil si l'API renvoie 401
    } finally {
      statsLoading = false;
    }
  }

  // charger/rafraîchir les stats quand l'utilisateur est prêt ou change
  $: if ($userStore?.id) {
    loadStats($userStore.id);
  }

  function logout() {
    localStorage.removeItem("token");
    userStore.set(null);
    window.location.hash = "#/login";
  }

  async function saveProfile() {
    alert("Sauvegarde à venir (PATCH /api/me).");
  }
</script>

{#if loading}
  <main class="profile-page"><p>Chargement…</p></main>
{:else if error}
  <main class="profile-page"><p style="color:#c00">{error}</p></main>
{:else}
<main class="profile-page">
  <div class="profile-container">
    <div class="profile-left">
      <div class="profile-bio-section">
        <div class="bio-section"></div>

        <!-- Stats -->
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-number">{statsLoading ? "…" : readCount}</div>
            <div class="stat-label">Livres lus</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{statsLoading ? "…" : toReadCount}</div>
            <div class="stat-label">À lire</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{statsLoading ? "…" : totalCount}</div>
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
          <input type="email" placeholder="Adresse mail" bind:value={form.email} disabled />
          <button class="edit-btn" on:click|preventDefault={saveProfile} disabled>✏️</button>
        </div>

        <div class="info-field">
          <input type="text" placeholder="Pseudo" bind:value={form.username} disabled />
          <button class="edit-btn" on:click|preventDefault={saveProfile} disabled>✏️</button>
        </div>

        <div class="action-buttons">
          <button class="logout-btn" on:click={logout}>Se déconnecter</button>
        </div>
      </div>
    </div>
  </div>
</main>
{/if}

<style>
  .stats-container{
    display:flex; gap:16px; margin:12px 0 0; flex-wrap:wrap;
  }
  .stat-item{
    min-width:120px; padding:12px; border:1px solid #eee; border-radius:10px; background:#fff;
    text-align:center;
  }
  .stat-number{ font-size:28px; font-weight:700; line-height:1; }
  .stat-label{ color:#666; margin-top:6px; }
</style>
