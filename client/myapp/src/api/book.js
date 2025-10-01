import { clientApi } from "./client.js";

// Récupère tous les livres ou un livre par ID
export const allBooks = () => clientApi("/book", {});
export const getBookById = (id) => clientApi(`/book/${id}`, {});

// Récupère tous les livres d’un utilisateur
export function getAllUserBooks(userId) {
  const token = localStorage.getItem("token") || "";
  return clientApi(`/user/${userId}/library`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Recherche des livres par nom (titre, auteur, etc.)
export async function searchBooksByName(query) {
  if (!query?.trim()) return [];
  const res = await clientApi(
    `/book/search?query=${encodeURIComponent(query.trim())}`,
    {}
  );
  return res?.data || res || [];
}

// Crée un nouveau livre
export async function createBook(bookData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token manquant");
  return clientApi("/book", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify(bookData),
  });

}

// Ajoute un livre à la bibliothèque d’un utilisateur
export function addBookToUser(userId, { title, status_id }) {
  const token = localStorage.getItem("token") || "";
  return clientApi(`/user/${userId}/library`, {

    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ title, status_id }),
  });
}

// Retire un livre de la bibliothèque d’un utilisateur
export function removeBookFromUser(userId, bookId) {
  const token = localStorage.getItem("token") || "";
  return clientApi(`/${userId}/library/${bookId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Met à jour le statut d’un livre dans la bibliothèque d’un utilisateur
export function updateBookStatus(userId, bookId, status_id) {
  const token = localStorage.getItem("token") || "";
  return clientApi(`/${userId}/library/${bookId}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status_id }),
  });
}
