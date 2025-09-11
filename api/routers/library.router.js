import { Router } from "express";
import { libraryController } from "../controllers/library.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

export const libraryRouter = Router();

 
libraryRouter.get("/user/:id/library", authenticate, libraryController.getAllUserBooks);
libraryRouter.post("/user/:id/library", authenticate, libraryController.addBookToUser);

libraryRouter.delete("/:id/library/:bookId", authenticate, libraryController.removeBookFromUser);
libraryRouter.put("/:id/library/:bookId/status", authenticate, libraryController.updateBookStatus);


