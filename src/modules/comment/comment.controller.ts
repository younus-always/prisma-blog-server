import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
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
            res.status(500).json({
                  success: false,
                  errDetails: err
            });
      }
};


export const CommentController = {
      createComment,
};