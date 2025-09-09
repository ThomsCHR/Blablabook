<script>
  import { writable } from "svelte/store";
  import { push } from "svelte-spa-router";
  import { user } from "../../stores/user.js";
  import { normalizeUser } from "../../utils/normalizeUser.js";

  let form = { email: "", password: "" };
  const error = writable(null);
  const success = writable(false);
  const loading = writable(false);

  async function jsonOrEmpty(res) {
    try { return await res.json(); } catch { return {}; }
  }

  async function handleLogin() {
    error.set(null); success.set(false); loading.set(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await jsonOrEmpty(res);
      if (!res.ok) throw new Error(data?.error || data?.message || `Erreur ${res.status}`);

      const token = data?.token;
      if (!token) throw new Error("Aucun token reçu.");
      localStorage.setItem("token", token);

      let u = normalizeUser(data); // ← d'abord depuis la réponse de login
      if (!u) {
        const meRes = await fetch("http://localhost:3000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const meData = await jsonOrEmpty(meRes);
        if (!meRes.ok) throw new Error(meData?.error || meData?.message || `Erreur ${meRes.status}`);
        u = normalizeUser(meData);
      }
      if (!u) throw new Error("Utilisateur invalide dans la réponse.");

      user.set(u);
      success.set(true);
      form = { email: "", password: "" };
      
      // Redirection automatique vers la page d'accueil après connexion réussie
      setTimeout(() => {
        push('/');
      }, 1000); // Attendre 1 seconde pour que l'utilisateur voie le message de succès
      
    } catch (e) {
      error.set(e?.message || "Erreur réseau. Veuillez réessayer.");
    } finally {
      loading.set(false);
    }
  }
</script>


<div class="login-container">
  <div class="form-section">
    <form on:submit|preventDefault={handleLogin} aria-busy={$loading}>
      <h2>Connexion</h2>

      <div class="form-group">
        <input
          type="email"
          id="email"
          placeholder="Email :"
          bind:value={form.email}
          required
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <input
          type="password"
          id="password"
          placeholder="Mot de passe :"
          bind:value={form.password}
          required
          autocomplete="current-password"
        />
      </div>

      {#if $error}<p class="error">{$error}</p>{/if}
      {#if $success}<p class="success">Connexion réussie !</p>{/if}

      <button type="submit" class="submit-btn" disabled={$loading}>
        {#if $loading}Connexion…{/if}
        {#if !$loading}Continuer{/if}
      </button>

      <div class="register-link">
        <p>Pas encore de compte ? <a href="#/register">Créer un compte</a></p>
      </div>
    </form>
  </div>
</div>

<style>
.register-link {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(44, 62, 80, 0.1);
}

.register-link p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.register-link a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #34495e;
  text-decoration: underline;
}
</style>
