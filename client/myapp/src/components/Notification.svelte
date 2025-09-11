<script>
  import { onMount } from 'svelte';
  
  export let message = '';
  export let type = 'success'; // success, error, warning, info
  export let duration = 3000;
  export let show = false;
  
  let visible = false;
  let timeout;
  
  $: if (show && message) {
    showNotification();
  }
  
  function showNotification() {
    visible = true;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      visible = false;
      // Permettre au parent de réinitialiser le show après l'animation
      setTimeout(() => {
        show = false;
      }, 300);
    }, duration);
  }
  
  function hideNotification() {
    visible = false;
    show = false;
    if (timeout) {
      clearTimeout(timeout);
    }
  }
  
  onMount(() => {
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div 
    class="notification {type}" 
    class:visible
    on:click={hideNotification}
    role="alert"
    aria-live="polite"
  >
    <div class="notification-content">
      <div class="notification-icon">
        {#if type === 'success'}
          ✅
        {:else if type === 'error'}
          ❌
        {:else if type === 'warning'}
          ⚠️
        {:else if type === 'info'}
          ℹ️
        {/if}
      </div>
      <span class="notification-message">{message}</span>
      <button class="notification-close" on:click|stopPropagation={hideNotification}>
        ×
      </button>
    </div>
  </div>
{/if}

<style>
  .notification {
    position: fixed;
    top: 120px; /* Juste en dessous du header (hauteur header ~60-80px) */
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    min-width: 300px;
    max-width: 500px;
    cursor: pointer;
  }
  
  .notification.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  .notification.success {
    background: #4caf50;
    color: white;
  }
  
  .notification.error {
    background: #f44336;
    color: white;
  }
  
  .notification.warning {
    background: #ff9800;
    color: white;
  }
  
  .notification.info {
    background: #2196f3;
    color: white;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .notification-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .notification-message {
    flex: 1;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }
  
  .notification-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 480px) {
    .notification {
      top: 70px; /* Ajuster pour mobile */
      right: 10px;
      left: 10px;
      min-width: auto;
      max-width: none;
    }
  }
</style>
