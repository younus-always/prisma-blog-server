import { Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";

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
            // searching
            const { search } = req.query;
            const searchString = typeof search === "string" ? search : undefined;
            const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

            // filtering
            const isFeatured = req.query.isFeatured
                  ? req.query.isFeatured === "true"
                        ? true
                        : req.query.isFeatured === "false"
                              ? false
                              : undefined
                  : undefined;
            const status = req.query.status as PostStatus | undefined;
            const userId = req.query.userId as string | undefined;

            // pagination & sorting
            const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

            const result = await PostService.getAllPost({ search: searchString, tags, isFeatured, status, userId, page, limit, skip, sortBy, sortOrder });

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

const getPostById = async (req: Request, res: Response) => {
      try {
            const postId = req.params.postId as string;
            const result = await PostService.getPostById(postId);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Post retrieved by ID successfully",
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
      getAllPost,
      getPostById,
};