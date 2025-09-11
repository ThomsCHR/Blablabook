// @ts-check

/**
 * @typedef {"S"|"M"|"L"} CoverSize
 * @typedef {{ title: string; author?: string; size?: CoverSize }} FetchCoverParams
 */

/**
 * @param {FetchCoverParams} params
 * @returns {Promise<string|null>}
 */
export async function fetchOpenLibraryCover(params) {
  // on donne un fallback sûr à TS et on extrait proprement
  const { title, author = "", size = "L" } = params ?? /** @type {FetchCoverParams} */({ title: "" });
  if (!title?.trim()) return null;

  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    title.trim()
  )}&author=${encodeURIComponent(author.trim())}&limit=1&fields=cover_i,isbn`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const doc = data?.docs?.[0];
    if (!doc) return null;

    if (doc.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-${size}.jpg`;
    }
    if (Array.isArray(doc.isbn) && doc.isbn.length > 0) {
      return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-${size}.jpg?default=false`;
    }
    return null;
  } catch (err) {
    console.error("fetchOpenLibraryCover error:", err);
    return null;
  }
}
