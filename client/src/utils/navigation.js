import { push } from 'svelte-spa-router';

// Aller à une page
export function goTo(route) {
  push(route);
}

// Aller à une page ET remonter en haut
export function goToAndScrollTop(route) {
  push(route);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
}