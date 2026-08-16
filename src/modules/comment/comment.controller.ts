import { NextFunction, Request, Response } from "express";
import { CommentService } from "./comment.service";


const createComment = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = req.user;
            req.body.userId = user?.id;
            const result = await CommentService.createComment(req.body);

            res.status(201).json({
                  success: true,
                  statusCode: 201,
                  message: "Comment created successfully",
                  data: result
            })
      } catch (err) {
            next(err)
      }
};

const getCommentById = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const commentId = req.params.commentId as string;
            const result = await CommentService.getCommentById(commentId);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Comment fetch by Id successfully",
                  data: result
            })
      } catch (err) {
            next(err)
      }
};

const getCommentsByAuthor = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const authorId = req.params.authorId as string;
            const result = await CommentService.getCommentsByAuthor(authorId);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Fetch author comments successfully",
                  data: result
            })
      } catch (err) {
            next(err)
      }
};

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = req.user;
            const commentId = req.params.commentId as string;

            const result = await CommentService.deleteComment(commentId, user?.id as string);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Comment deleted successfully",
                  data: result
            })
      } catch (err) {
            next(err)
      }
};

const updateComment = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = req.user;
            const commentId = req.params.commentId as string;

            const result = await CommentService.updateComment(commentId, user?.id as string, req.body);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Comment updated successfully",
                  data: result
            })
      } catch (err) {
            next(err)
      }
};

const moderateComment = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const commentId = req.params.commentId as string;
            const result = await CommentService.moderateComment(commentId, req.body);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Comment updated successfully",
                  data: result
            })
      } catch (err) {
            next(err)
      }
};


export const CommentController = {
      createComment,
      getCommentById,
      getCommentsByAuthor,
      deleteComment,
      updateComment,
      moderateComment
};