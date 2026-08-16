import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { CommentController } from "./comment.controller";

const router = Router();

router.get("/:commentId", CommentController.getCommentById);
router.get("/author/:authorId", CommentController.getCommentsByAuthor);
router.post("/",
      auth(UserRole.ADMIN, UserRole.USER),
      CommentController.createComment
);
router.delete("/:commentId",
      auth(UserRole.ADMIN, UserRole.USER),
      CommentController.deleteComment
);
router.patch("/:commentId",
      auth(UserRole.ADMIN, UserRole.USER),
      CommentController.updateComment
);

export const commentRoutes = router