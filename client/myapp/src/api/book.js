import { clientApi } from "./client.js";

export const allBooks = () => clientApi("/book", {});
export const getBookById = (id) => clientApi(`/book/${id}`, {});

export function getAllUserBooks(userId) {
  const token = localStorage.getItem("token") || "";
  return clientApi(`/${userId}/library`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function searchBooksByName(query) {
  if (!query?.trim()) return [];
  const res = await clientApi(
    `/book/search?query=${encodeURIComponent(query.trim())}`,
    {}
  );
  return res?.data || res || [];
}

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

export function addBookToUser(userId, { title, status_id }) {
  const token = localStorage.getItem("token") || "";
  return clientApi(`/${userId}/library`, {

    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ title, status_id }),
  });
}
export function removeBookFromUser(userId, bookId) {
  const token = localStorage.getItem("token") || "";
  return clientApi(`/${userId}/library/${bookId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}