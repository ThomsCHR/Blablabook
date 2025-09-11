import { Router } from "express";
import {
  getAdminStats,
  getUsers,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  getRecentActivity,
  getUserDetails,
  getBooks,
  deleteBook
} from "../controllers/admin.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Toutes les routes nécessitent une authentification et des permissions admin
router.use(authenticate);
router.use(isAdmin);

// GET /api/admin/stats - Récupérer les statistiques d'administration
router.get('/stats', getAdminStats);

// GET /api/admin/users - Récupérer la liste des utilisateurs (avec pagination et recherche)
router.get('/users', getUsers);

// GET /api/admin/users/:id - Récupérer les détails d'un utilisateur
router.get('/users/:id', getUserDetails);

// DELETE /api/admin/users/:id - Supprimer un utilisateur
router.delete('/users/:id', deleteUser);

// PATCH /api/admin/users/:id/status - Mettre à jour le statut d'un utilisateur
router.patch('/users/:id/status', updateUserStatus);

// PATCH /api/admin/users/:id/role - Mettre à jour le rôle d'un utilisateur
router.patch('/users/:id/role', updateUserRole);

// GET /api/admin/activity - Récupérer l'activité récente
router.get('/activity', getRecentActivity);

// GET /api/admin/books - Récupérer tous les livres (avec pagination et recherche)
router.get('/books', getBooks);

// DELETE /api/admin/books/:id - Supprimer un livre
router.delete('/books/:id', deleteBook);

export { router as adminRouter };
