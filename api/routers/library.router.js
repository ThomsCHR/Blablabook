import { Router } from "express";
import { libraryController } from "../controllers/library.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

export const libraryRouter = Router();

 
libraryRouter.get("/user/:id/library", authenticate, libraryController.getAllUserBooks);
libraryRouter.post("/user/:id/library", authenticate, libraryController.addBookToUser);

