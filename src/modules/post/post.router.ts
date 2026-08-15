import { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = Router();

router.get("/", PostController.getAllPost);
router.post("/", auth(UserRole.USER), PostController.createPost);
router.get("/:postId", PostController.getPostById);

export const postRoutes = router;