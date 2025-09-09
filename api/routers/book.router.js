import { Router } from "express";
import { bookController } from "../controllers/book.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

export const bookRouter = Router();

// routes publiques 
bookRouter.get("/book", bookController.getAll);
bookRouter.get("/book/search", bookController.searchByTitle); // nouvelle route de recherche
bookRouter.get("/book/title/:title", bookController.getByTitle);
bookRouter.get("/book/:id", bookController.getById);



// routes protégées - authentification requise
bookRouter.post("/book", authenticate, bookController.create);
bookRouter.put("/book/:id", authenticate, isAdmin, bookController.updateById);
bookRouter.delete("/book/:id", authenticate, isAdmin, bookController.deleteById);
