<script>
    import { writable } from "svelte/store"; // sert à créer des stores réactifs comme error et success 

  let formData = {
    username: "",
    email: "",
    password: "",
  };

  let error = writable(null);
  let success = writable(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    error.set(null);
    success.set(false);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        success.set(true);
        formData = { username: "", email: "", password: "" };
      } else {
        const data = await response.json().catch(() => ({}));
        error.set(data.error || data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      error.set("Erreur réseau. Veuillez réessayer.");
    }
  };
</script>

<main>
  <div class="login-container">
    <div class="form-section">
      <form on:submit|preventDefault={handleSubmit}>
        <h2>Créer un compte</h2>

        <div class="form-group">
          <input type="text" id="pseudo" placeholder="Pseudo :" bind:value={formData.username} required />
        </div>

        <div class="form-group">
          <input type="email" id="email" placeholder="Email :" bind:value={formData.email} required />
        </div>

        <div class="form-group">
          <input type="password" id="password" placeholder="Mot de passe :" bind:value={formData.password} required />
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" id="accept-terms" required />
            <span class="checkmark"></span>
            j'accepte les
            <a href="#/Mentions" target="_blank">conditions d'utilisations</a>
            et la
            <a href="#/Politic" target="_blank">politique de confidentialité</a>
          </label>
        </div>

        {#if $error}
          <p class="error">{$error}</p>
        {/if}

        {#if $success}
          <p class="success">Inscription réussie !</p>
        {/if}

        <button type="submit" class="submit-btn">Continuer</button>
      </form>
    </div>
  </div>
</main>
