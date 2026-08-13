import { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = Router();

router.post("/", auth(UserRole.USER), PostController.createPost);


export const postRoutes = router;