// accepte { user: {...} } ou direct { id, ... }
export function normalizeUser(data) {
  const u = data?.user ?? data;
  if (!u || typeof u !== "object") return null;

  const username = u.username ?? u.name ?? u.email ?? null;
  if (!u.id || !username) return null;

  const role = u.role ?? (u.isAdmin ? "admin" : "member");

  return {
    id: u.id,
    username,
    email: u.email ?? null,
    role,
    isAdmin: role === "admin" || !!u.isAdmin
  };
}
