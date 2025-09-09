// accepte { user: {...} } ou direct { id, ... }
export function normalizeUser(data) {
  const u = data?.user ?? data;
  if (!u || typeof u !== "object") return null;

  const username = u.username ?? u.pseudo ?? u.name ?? null;
  if (!u.id || !username) return null;

  // email peut être absent → null
  return { id: u.id, username, email: u.email ?? null };
}
