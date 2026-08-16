import { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = Router();

router.get("/", PostController.getAllPost);
router.get("/my-posts",
      auth(UserRole.ADMIN, UserRole.USER),
      PostController.getMyPosts
);
router.get("/:postId", PostController.getPostById);
router.post("/",
      auth(UserRole.ADMIN, UserRole.USER),
      PostController.createPost
);
router.patch("/:postId",
      auth(UserRole.ADMIN, UserRole.USER),
      PostController.updatePost
);


export const postRoutes = router;