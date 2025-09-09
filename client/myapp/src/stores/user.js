import { writable } from 'svelte/store';

// était: writable(null)
export const user = writable(undefined); // undefined = pas encore résolu
