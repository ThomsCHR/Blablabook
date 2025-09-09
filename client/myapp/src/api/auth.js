// src/api/auth.js
import { clientApi } from "../api/client.js";
const TOKEN_KEY = "token";

// À factoriser dans un utils commun si possible
function normalizeUser(data) {
  const u = data?.user ?? data;
  if (!u || typeof u !== "object") return null;
  const username = u.username ?? u.pseudo ?? u.name ?? null;
  if (!u.id || !username) return null;
  return { id: u.id, username, email: u.email ?? null };
}

export async function getMe() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    // ⚠️ pas de /api ici, ton BASE_URL l’a déjà
    const data = await clientApi("/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const u = normalizeUser(data);
    return u ?? null;
  } catch (e) {
    // 401 → token invalide/expiré = on purge
    if (String(e?.message || "").startsWith("401")) {
      localStorage.removeItem(TOKEN_KEY);
    }
    console.error("[getMe] failed:", e);
    return null;
  }
}
