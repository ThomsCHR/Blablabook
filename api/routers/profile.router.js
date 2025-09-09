
import { Router } from 'express';
import { profileController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

export const profileRouter = Router();

// Récupérer les infos de l'utilisateur connecté
profileRouter.get('/user/me', authenticate, profileController.getMe);
profileRouter.put('/user/me', authenticate, profileController.updateMe);