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

export const adminrouter = Router();


adminrouter.use(authenticate);

adminrouter.use(isAdmin);

adminrouter.get('/stats', getAdminStats);

adminrouter.get('/users', getUsers);

adminrouter.get('/users/:id', getUserDetails);

adminrouter.delete('/users/:id', deleteUser);

adminrouter.patch('/users/:id/status', updateUserStatus);

adminrouter.patch('/users/:id/role', updateUserRole);

adminrouter.get('/activity', getRecentActivity);

adminrouter.get('/books', getBooks);

adminrouter.delete('/books/:id', deleteBook);

