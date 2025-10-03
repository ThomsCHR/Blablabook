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


router.use(authenticate);
router.use(isAdmin);


router.get('/stats', getAdminStats);

router.get('/users', getUsers);


router.get('/users/:id', getUserDetails);


router.delete('/users/:id', deleteUser);

router.patch('/users/:id/status', updateUserStatus);


router.patch('/users/:id/role', updateUserRole);


router.get('/activity', getRecentActivity);


router.get('/books', getBooks);


router.delete('/books/:id', deleteBook);

export { router as adminRouter };
