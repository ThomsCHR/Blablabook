<script>
  import { writable } from "svelte/store";
  import { push } from "svelte-spa-router";
  import { user as userStore } from "../../stores/user.js";
  import { normalizeUser } from "../../utils/normalizeUser.js";

  
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
  const REDIRECT_DELAY_MS = 1500;

  // Formulaire 
  let formData = {
    username: "", 
    email: "",
    password: "",
    acceptTerms: false, // on stocke l’acceptation pour un contrôle clair
  };

  
  const errorMessage = writable(null); // string | null
  const isSuccess = writable(false);   // boolén
  const isLoading = writable(false);   // boolén  

  // 
  async function readJsonSafe(res) {
    try { return await res.json(); } catch { return {}; }
  }
  // Sauvegarde le token dans le localStorage
  function saveToken(token) {
    localStorage.setItem("token", token);
  }

   // Sert à gérer la soumission du formulaire
  async function handleSubmit(event) {
    event.preventDefault();
    errorMessage.set(null);
    isSuccess.set(false);

    // 0) Validation ultra simple
    if (!formData.acceptTerms) {
      errorMessage.set("Tu dois accepter les conditions d’utilisation et la politique de confidentialité.");
      return;
    }

    isLoading.set(true);
    try {
      // 1) Appel /auth/register
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await readJsonSafe(res);

      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Erreur ${res.status}`);
      }

      // 2) Auto-connexion si un token est renvoyé
      if (data?.token) {
        saveToken(data.token);

        // On normalise l’utilisateur : on tente d’abord data.user, sinon data
        const normalized = normalizeUser(data.user || data);
        if (normalized) userStore.set(normalized);
      }

      // 3) Feedback UI + reset
      isSuccess.set(true);
      formData = { username: "", email: "", password: "", acceptTerms: false };

      // 4) Redirection
      setTimeout(() => push("/"), REDIRECT_DELAY_MS);
    } catch (err) {
      errorMessage.set(err?.message || "Erreur réseau. Veuillez réessayer.");
    } finally {
      isLoading.set(false);
    }
  }
</script>

<main>
  <div class="login-container">
    <div class="form-section">
      <form on:submit|preventDefault={handleSubmit} aria-busy={$isLoading}>
        <h2>Créer un compte</h2>

        <div class="form-group">
          <input
            type="text"
            id="pseudo"
            placeholder="Pseudo :"
            bind:value={formData.username}
            required
            autocomplete="username"
            disabled={$isLoading}
          />
        </div>

        <div class="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email :"
            bind:value={formData.email}
            required
            autocomplete="email"
            disabled={$isLoading}
            aria-invalid={$errorMessage ? "true" : "false"}
          />
        </div>

        <div class="form-group">
          <input
            type="password"
            id="password"
            placeholder="Mot de passe :"
            bind:value={formData.password}
            required
            autocomplete="new-password"
            disabled={$isLoading}
          />
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              id="accept-terms"
              bind:checked={formData.acceptTerms}
              required
              disabled={$isLoading}
            />
            <span class="checkmark"></span>
            J'accepte les
            <a href="#/Mentions" target="_blank" rel="noopener">conditions d'utilisation</a>
            et la
            <a href="#/Politic" target="_blank" rel="noopener">politique de confidentialité</a>
          </label>
        </div>

        <div class="login-redirection-link">
          <span>Déjà un compte ? <a href="#/login">Se connecter</a></span>
        </div>

        {#if $errorMessage}
          <p class="error" role="alert">{$errorMessage}</p>
        {/if}

        {#if $isSuccess}
          <p class="success">Compte créé avec succès ! Vous êtes maintenant connecté. Redirection…</p>
        {/if}

        <button type="submit" class="submit-btn" disabled={$isLoading}>
          {#if $isLoading}Création…{:else}Continuer{/if}
        </button>
      </form>
    </div>
  </div>
</main>