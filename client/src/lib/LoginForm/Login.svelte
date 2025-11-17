<script>
 
  import { writable } from "svelte/store";
  import { push } from "svelte-spa-router";
  import { user as userStore } from "../../stores/user.js";
  import { normalizeUser } from "../../utils/normalizeUser.js";


  const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
  const REDIRECT_DELAY_MS = 1000; // durée d'affichage du message de succès

  // Données du formulaire
  let formData = { email: "", password: "" };

  // Stores Svelte pour l'UI
  const errorMessage = writable(null); // string | null
  const isSuccess = writable(false);   // bool
  const isLoading = writable(false);   // bool

  // Sert à lire la réponse JSON en gérant les erreurs
  async function readJsonSafe(response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  // Stocker le token d'authentification dans le localStorage
  function saveAuthToken(token) {
    localStorage.setItem("token", token);
  }

  // Appel /user/me pour récupérer les infos utilisateur
  async function fetchMeWith(token) {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await readJsonSafe(res);
    if (!res.ok) {
      throw new Error(data?.error || data?.message || `Erreur ${res.status}`);
    }
    return data;
  }

  // Formulaire soumis
  async function handleSubmit() {
    // reset UI
    errorMessage.set(null);
    isSuccess.set(false);
    isLoading.set(true);

    try {
      // 1) Appel /auth/login
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      // Lire la réponse JSON en gérant les erreurs
      const data = await readJsonSafe(res);
      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Erreur ${res.status}`);
      }

      // 2) Récupérer et stocker le token
      const token = data?.token;
      if (!token) throw new Error("Aucun token reçu.");
      saveAuthToken(token);

      // 3) Normaliser l'utilisateur depuis la réponse de login…
      let normalized = normalizeUser(data);

      // …ou retomber sur /user/me si besoin
      if (!normalized) {
        const meData = await fetchMeWith(token);
        normalized = normalizeUser(meData);
      }

      if (!normalized) {
        throw new Error("Utilisateur invalide dans la réponse.");
      }

      // 4) Mettre à jour le store utilisateur + feedback UI
      userStore.set(normalized);
      isSuccess.set(true);

      // 5) Nettoyer le formulaire + rediriger
      formData = { email: "", password: "" };
      setTimeout(() => {
        push("/");
      }, REDIRECT_DELAY_MS);
    } catch (err) {
      errorMessage.set(err?.message || "Erreur réseau. Veuillez réessayer.");
    } finally {
      isLoading.set(false);
    }
  }
</script>

<div class="login-container">
  <div class="form-section">
    <form on:submit|preventDefault={handleSubmit} aria-busy={$isLoading}>
      <h2>Connexion</h2>

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
          autocomplete="current-password"
          disabled={$isLoading}
        />
      </div>

      {#if $errorMessage}
        <p class="error" role="alert">{$errorMessage}</p>
      {/if}

      {#if $isSuccess}
        <p class="success">Connexion réussie !</p>
      {/if}

      <button type="submit" class="submit-btn" disabled={$isLoading}>
        {#if $isLoading}Connexion…{:else}Continuer{/if}
      </button>

      <div class="register-link">
        <p>Pas encore de compte ? <a href="#/register">Créer un compte</a></p>
      </div>
    </form>
  </div>
</div>