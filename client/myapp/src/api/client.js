// src/api/client.js
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

export async function clientApi(path, init = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  
  if (response.status === 204 || response.status === 205) return null;

  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
