import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
      try {
            const user = req.user;

            if (!user) {
                  return res.status(401).json({
                        error: "Unauthorized"
                  })
            };

            const result = await PostService.createPost(req.body, user.id);
            res.status(201).json({
                  success: true,
                  statusCode: 201,
                  message: "Post created successfully",
                  data: result
            });
      } catch (err) {
            res.status(500).json({
                  error: "Post creation failed",
                  details: err
            })
      }
};

const getAllPost = async (req: Request, res: Response) => {
      try {
            const { search } = req.query;
            const searchString = typeof search === "string" ? search : undefined;
            const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
            // true or false
            const isFeatured = req.query.isFeatured
                  ? req.query.isFeatured === "true"
                        ? true
                        : req.query.isFeatured === "false"
                              ? false
                              : undefined
                  : undefined;

            const status = req.query.status as PostStatus | undefined;
            const userId = req.query.userId as string | undefined;

            const result = await PostService.getAllPost({ search: searchString, tags, isFeatured, status ,userId});

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "All post retrieved successfully",
                  data: result
            });
      } catch (err) {
            res.status(500).json({
                  error: "post creation failed",
                  details: err
            })
      }
};

export const PostController = {
      createPost,
      getAllPost
};