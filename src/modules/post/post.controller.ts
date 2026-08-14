import { Request, Response } from "express";
import { PostService } from "./post.service";

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
            const result = await PostService.getAllPost({ search: searchString });
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