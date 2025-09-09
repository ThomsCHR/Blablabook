import { writable } from "svelte/store";

const LS_KEY = "library:v1";

function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || !Array.isArray(v.toRead) || !Array.isArray(v.read)) return null;
    return v;
  } catch {
    return null;
  }
}

function createLibraryStore() {
  const initial = loadFromLS() || { userId: null, toRead: [], read: [] };
  const { subscribe, set, update } = writable(initial);

  // Persist à chaque changement
  subscribe((val) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(val));
    } catch {}
  });

  // Remplace entièrement la bibliothèque (après fetch serveur, par ex.)
  function setLibrary(userId, toRead, read) {
    set({ userId, toRead: [...toRead], read: [...read] });
  }

  // Met à jour uniquement l'userId (après login)
  function setUserId(userId) {
    update((s) => ({ ...s, userId }));
  }

  // MàJ optimiste d’un livre
  function moveBookOptimistic(book, desired) {
    update((s) => {
      const rm = (arr, id) => {
        const i = arr.findIndex((b) => b.id === id);
        if (i !== -1) arr.splice(i, 1);
      };
      const addFront = (arr, x) => {
        rm(arr, x.id);
        arr.unshift(x);
      };
      if (desired === "read") {
        rm(s.toRead, book.id);
        addFront(s.read, book);
      } else {
        rm(s.read, book.id);
        addFront(s.toRead, book);
      }
      return { ...s, toRead: [...s.toRead], read: [...s.read] };
    });
  }

  // Annule le move optimiste
  function rollbackMove(book, desired) {
    moveBookOptimistic(book, desired === "read" ? "to_read" : "read");
  }

  // Recharge depuis le cache LS (utile au boot)
  function hydrateFromCache() {
    const cached = loadFromLS();
    if (cached) set(cached);
  }

  // Optionnel : lire l’état courant (ex. dans un handler non-réactif)
  function getState() {
    let value;
    const unsub = subscribe((v) => (value = v));
    unsub();
    return value;
  }

  return {
    subscribe,
    setLibrary,
    setUserId,
    moveBookOptimistic,
    rollbackMove,
    hydrateFromCache,
    getState
  };
}

export const libraryStore = createLibraryStore();
export const {
  setLibrary,
  setUserId,
  moveBookOptimistic,
  rollbackMove,
  hydrateFromCache,
  getState
} = libraryStore;
export default libraryStore;
