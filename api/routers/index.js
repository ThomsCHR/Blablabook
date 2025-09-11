import { Router } from "express";
import { bookRouter } from "./book.router.js";
import { libraryRouter } from "./library.router.js";
import { authRouter } from "./auth.router.js";
import { profileRouter } from "./profile.router.js";
import { adminRouter } from "./admin.router.js";


export const apiRouter = Router();

apiRouter.use("/", bookRouter);
apiRouter.use("/", libraryRouter);
apiRouter.use("/", authRouter);
apiRouter.use("/", profileRouter);
apiRouter.use("/admin", adminRouter);

