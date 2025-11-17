<script>
  import { push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  import { user } from '../stores/user.js';
  
  let isAuthorized = false;
  let isLoading = true;
  
  onMount(() => {
    // Vérifier si l'utilisateur est connecté et a les permissions d'admin
    const unsubscribe = user.subscribe((currentUser) => {
      if (!currentUser) {
        // Utilisateur non connecté, rediriger vers login
        push('/login');
        return;
      }
      
      // Vérifier les permissions d'admin
      // Adaptez cette condition selon votre structure de données utilisateur
      if (currentUser.role === 'admin' || currentUser.isAdmin) {
        isAuthorized = true;
      } else {
        // Pas les permissions, rediriger vers l'accueil
        push('/');
        return;
      }
      
      isLoading = false;
    });
    
    return unsubscribe;
  });
</script>

{#if isLoading}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Vérification des permissions...</p>
  </div>
{:else if isAuthorized}
  <slot />
{:else}
  <div class="unauthorized">
    <h2>Accès non autorisé</h2>
    <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
    <button on:click={() => push('/')}>Retour à l'accueil</button>
  </div>
{/if}

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .unauthorized {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
    padding: 2rem;
  }
  
  .unauthorized h2 {
    color: #e74c3c;
    margin-bottom: 1rem;
  }
  
  .unauthorized p {
    color: #7f8c8d;
    margin-bottom: 2rem;
  }
  
  .unauthorized button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .unauthorized button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
</style>
