import { writable } from 'svelte/store';
import { 
  getAdminStats, 
  getUsers, 
  deleteUser as apiDeleteUser,
  updateUserStatus as apiUpdateUserStatus,
  getRecentActivity,
  deleteBook as apiDeleteBook
} from '../api/admin.js';

// Store pour les données d'administration
export const adminStats = writable({
  totalUsers: 0,
  activeUsers: 0,
  totalBooks: 0,
  totalBooksInLibraries: 0,
  pendingReports: 0
});

// Store pour les utilisateurs
export const adminUsers = writable([]);

// Store pour l'activité récente
export const recentActivity = writable([]);

// Store pour la section active
export const activeSection = writable('dashboard');

// Fonctions pour mettre à jour les stores
export function updateStats(stats) {
  adminStats.set(stats);
}

export function updateUsers(users) {
  adminUsers.set(users);
}

export function updateActivity(activity) {
  recentActivity.set(activity);
}

export function setActiveSection(section) {
  activeSection.set(section);
}

// Fonctions API pour l'administration
export async function fetchAdminStats() {
  try {
    const stats = await getAdminStats();
    updateStats(stats);
    return stats;
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    throw error;
  }
}

export async function fetchUsers(page = 1, limit = 10, search = '') {
  try {
    const result = await getUsers(page, limit, search);
    updateUsers(result.users || result);
    return result;
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    throw error;
  }
}

export async function fetchRecentActivity(limit = 10) {
  try {
    const activity = await getRecentActivity(limit);
    updateActivity(activity);
    return activity;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'activité:', error);
    throw error;
  }
}

// Fonction pour supprimer un utilisateur
export async function deleteUser(userId) {
  try {
    await apiDeleteUser(userId);
    // Mettre à jour le store local
    adminUsers.update(users => users.filter(user => user.id !== userId));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return false;
  }
}

// Fonction pour changer le statut d'un utilisateur
export async function toggleUserStatus(userId, newStatus) {
  try {
    await apiUpdateUserStatus(userId, newStatus);
    // Mettre à jour le store local
    adminUsers.update(users => 
      users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    return true;
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    return false;
  }
}

// Fonction pour supprimer un livre (ADMIN SEULEMENT)
export async function deleteBook(bookId) {
  try {
    console.log(`🗑️ Suppression du livre ID: ${bookId}`);
    await apiDeleteBook(bookId);
    console.log(`✅ Livre supprimé avec succès`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du livre:', error);
    return false;
  }
}
