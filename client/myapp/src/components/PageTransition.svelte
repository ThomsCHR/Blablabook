<script>
  import { fly } from 'svelte/transition';
  
  export let key = '';
</script>

{#key key}
  <div in:fly={{y: 20, duration: 300}}>
    <slot />
  </div>
{/key}

<style>
  div {
    width: 100%;
  }
</style>