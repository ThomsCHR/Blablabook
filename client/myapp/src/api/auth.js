import { clientApi } from "./client.js";
import { user } from "../stores/user.js";

// Clé pour stocker le token dans le navigateur
const TOKEN_KEY = "token";

// 1. FONCTION DE CONNEXION
export async function login(email, password) {
  try {
    console.log('Tentative de connexion pour:', email);
    
    // Vérifier que les champs sont remplis
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }
    
    // Appeler l'API de connexion
    const response = await clientApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    
    // Vérifier qu'on a bien reçu un token
    if (!response.token) {
      throw new Error('Erreur de connexion - token manquant');
    }
    
    // Sauvegarder le token dans le navigateur
    localStorage.setItem(TOKEN_KEY, response.token);
    console.log('Token sauvegardé avec succès');
    
    // Récupérer les infos de l'utilisateur connecté
    const userInfo = await getMe();
    
    // Mettre à jour le store utilisateur (pour Svelte)
    user.set(userInfo);
    
    console.log('Connexion réussie pour:', userInfo?.username);
    return {
      token: response.token,
      user: userInfo
    };
    
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
    // Nettoyer en cas d'erreur
    localStorage.removeItem(TOKEN_KEY);
    user.set(null);
    throw new Error('Email ou mot de passe incorrect');
  }
}

// 2. FONCTION DE DÉCONNEXION
export async function logout() {
  try {
    console.log('Déconnexion en cours...');
    
    // Supprimer le token du navigateur
    localStorage.removeItem(TOKEN_KEY);
    
    // Nettoyer le store utilisateur
    user.set(null);
    
    console.log('Déconnexion réussie');
    return true;
    
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return false;
  }
}

// 3. RÉCUPÉRER LES INFOS DE L'UTILISATEUR CONNECTÉ
export async function getMe() {
  const token = localStorage.getItem(TOKEN_KEY);
  
  // Pas de token = pas connecté
  if (!token) {
    console.log('Aucun token trouvé - utilisateur non connecté');
    return null;
  }
  
  try {
    console.log('Récupération des infos utilisateur...');
    
    const data = await clientApi("/user/me", {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
    
    // Transformer les données en format simple
    const userInfo = createUserObject(data);
    
    console.log('Infos utilisateur récupérées:', userInfo.username);
    return userInfo;
    
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error.message);
    
    // Si le token est invalide (erreur 401), on nettoie
    if (error.message.includes('401')) {
      console.log('Token invalide - nettoyage automatique');
      localStorage.removeItem(TOKEN_KEY);
      user.set(null);
    }
    
    return null;
  }
}

// 4. VÉRIFIER SI UN UTILISATEUR EST CONNECTÉ
export function isLoggedIn() {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token; // Convertit en boolean (true si token existe)
}

// 5. VÉRIFIER SI L'UTILISATEUR EST ADMIN
export function isAdmin() {
  // On pourrait stocker le rôle dans localStorage aussi pour simplifier
  // Mais pour la sécurité, il vaut mieux vérifier côté serveur
  return false; // Simplifié pour le moment
}

// 6. RÉCUPÉRER LE TOKEN ACTUEL
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// FONCTION UTILITAIRE: Créer un objet utilisateur propre
function createUserObject(data) {
  // Gérer les différents formats de réponse de l'API
  const userdata = data?.user || data;
  
  if (!userdata || !userdata.id) {
    throw new Error('Données utilisateur invalides');
  }
  
  return {
    id: userdata.id,
    username: userdata.username || userdata.name || 'Utilisateur',
    email: userdata.email || null,
    role: userdata.role || 'member',
    isAdmin: userdata.role === 'admin'
  };
}

// FONCTION UTILITAIRE: Nettoyer toutes les données d'auth
export function clearAuthData() {
  console.log('Nettoyage complet des données d\'authentification');
  localStorage.removeItem(TOKEN_KEY);
  user.set(null);
}

// FONCTION UTILITAIRE: Vérifier si le token existe et semble valide
export function hasValidToken() {
  const token = getToken();
  if (!token) return false;
  
  // Vérification basique: le token doit avoir une taille minimale
  if (token.length < 20) {
    console.warn('Token trop court - probablement invalide');
    clearAuthData();
    return false;
  }
  
  return true;
}