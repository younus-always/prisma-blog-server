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
            res.status(201).json(result);
      } catch (err) {
            res.status(500).json({
                  error: "post creation failed",
                  details: err
            })
      }
};


export const PostController = {
      createPost
};