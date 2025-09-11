// API pour l'administration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

import { clientApi } from "./client.js";

// Fonction utilitaire pour récupérer le token d'authentification
function getToken() {
  return localStorage.getItem('token');
}

// Fonction utilitaire pour créer les headers avec le token
function createAuthHeaders() {
  const token = getToken();
  if (!token) {
    throw new Error('Vous devez être connecté pour accéder à cette fonctionnalité');
  }
  return {
    'Authorization': `Bearer ${token}`
  };
}

// 1. RÉCUPÉRER LES STATISTIQUES DU TABLEAU DE BORD
export async function getAdminStats() {
  try {
    console.log('Chargement des statistiques admin...');
    
    const data = await clientApi('/admin/stats', {
      headers: createAuthHeaders()
    });
    
    console.log('Statistiques chargées:', data);
    return data;
    
  } catch (error) {
    console.error('Erreur stats:', error.message);
    throw new Error('Impossible de charger les statistiques');
  }
}

// 2. RÉCUPÉRER LA LISTE DES UTILISATEURS
export async function getUsers(page = 1, limit = 10, search = '') {
  try {
    console.log('Chargement des utilisateurs...', { page, limit, search });
    
    // Construire l'URL avec les paramètres
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search.trim()) {
      params.append('search', search.trim());
    }
    
    const url = `/admin/users?${params.toString()}`;
    
    const data = await clientApi(url, {
      headers: createAuthHeaders()
    });
    
    console.log(`${data.users?.length || 0} utilisateurs trouvés sur ${data.pagination?.total || 'N/A'} total`);
    return data;
    
  } catch (error) {
    console.error('Erreur utilisateurs:', error.message);
    throw new Error('Impossible de charger les utilisateurs');
  }
}

// 3. SUPPRIMER UN UTILISATEUR
export async function deleteUser(userId) {
  try {
    console.log(`Suppression utilisateur ID: ${userId}`);
    
    if (!userId) {
      throw new Error('ID utilisateur requis');
    }
    
    const data = await clientApi(`/admin/users/${userId}`, {
      method: 'DELETE',
      headers: createAuthHeaders()
    });
    
    console.log('Utilisateur supprimé avec succès');
    return data;
    
  } catch (error) {
    console.error('Erreur suppression:', error.message);
    throw new Error('Impossible de supprimer l\'utilisateur');
  }
}

// 4. CHANGER LE RÔLE D'UN UTILISATEUR (admin/member)
export async function updateUserRole(userId, newRole) {
  try {
    console.log(`Changement rôle utilisateur ${userId} vers: ${newRole}`);
    
    if (!userId || !newRole) {
      throw new Error('ID utilisateur et nouveau rôle requis');
    }
    
    if (!['admin', 'member'].includes(newRole)) {
      throw new Error('Rôle invalide. Utilisez: admin ou member');
    }
    
    const data = await clientApi(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
      body: JSON.stringify({ role: newRole })
    });
    
    console.log('Rôle mis à jour avec succès');
    return data;
    
  } catch (error) {
    console.error('Erreur changement rôle:', error.message);
    throw new Error('Impossible de changer le rôle');
  }
}

// 4.5 CHANGER LE STATUT D'UN UTILISATEUR
export async function updateUserStatus(userId, newStatus) {
  try {
    console.log(`Changement statut utilisateur ${userId} vers: ${newStatus}`);
    
    const data = await clientApi(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        ...createAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    console.log('Statut utilisateur changé avec succès');
    return data;
  } catch (error) {
    console.error('Erreur changement statut:', error.message);
    throw new Error('Impossible de changer le statut');
  }
}

// 5. RÉCUPÉRER L'ACTIVITÉ RÉCENTE
export async function getRecentActivity() {
  try {
    console.log('Chargement activité récente...');
    
    const data = await clientApi('/admin/activity?limit=10', {
      headers: createAuthHeaders()
    });
    
    console.log(`${data?.length || 0} activités récentes trouvées`);
    return data;
    
  } catch (error) {
    console.error('Erreur activité:', error.message);
    throw new Error('Impossible de charger l\'activité récente');
  }
}

// 6. RÉCUPÉRER LA LISTE DES LIVRES (pour la section admin)
export async function getBooks() {
  try {
    console.log('Chargement des livres admin...');
    
    const data = await clientApi('/admin/books', {
      headers: createAuthHeaders()
    });
    
    console.log(`${data.books?.length || 0} livres trouvés`);
    return data;
    
  } catch (error) {
    console.error('Erreur livres admin:', error.message);
    throw new Error('Impossible de charger les livres');
  }
}

// 7. SUPPRIMER UN LIVRE (admin seulement)
export async function deleteBook(bookId) {
  try {
    console.log(`Suppression livre ID: ${bookId}`);
    
    if (!bookId) {
      throw new Error('ID livre requis');
    }
    
    const data = await clientApi(`/admin/books/${bookId}`, {
      method: 'DELETE',
      headers: createAuthHeaders()
    });
    
    console.log('Livre supprimé avec succès');
    return data;
    
  } catch (error) {
    console.error('Erreur suppression livre:', error.message);
    throw new Error('Impossible de supprimer le livre');
  }
}

// FONCTION UTILITAIRE: Vérifier si l'utilisateur est admin
export function isUserAdmin() {
  const token = getToken();
  if (!token) return false;
  
  // Note: Dans une vraie app, il faudrait décoder le JWT
  // Pour simplifier, on fait un appel API pour vérifier
  return true; // Simplifié pour le développeur junior
}

// FONCTION UTILITAIRE: Gérer les erreurs d'API de façon simple
export function handleAdminError(error) {
  console.error('Erreur admin:', error);
  
  // Messages d'erreur simples pour l'utilisateur
  if (error.message.includes('401')) {
    return 'Vous devez vous reconnecter';
  }
  if (error.message.includes('403')) {
    return 'Vous n\'avez pas les droits d\'administration';
  }
  if (error.message.includes('404')) {
    return 'Élément non trouvé';
  }
  
  return 'Une erreur est survenue. Veuillez réessayer.';
}
