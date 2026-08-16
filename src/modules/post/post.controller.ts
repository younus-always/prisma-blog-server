import { NextFunction, Request, Response } from "express";
import { PostService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";


const createPost = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const user = req.user;

            if (!user) {
                  return res.status(401).json({
                        error: "Unauthorized user"
                  });
            };

            const result = await PostService.createPost(req.body, user.id);
            res.status(201).json({
                  success: true,
                  statusCode: 201,
                  message: "Post created successfully",
                  data: result
            });
      } catch (err) {
            next(err);
      }
};

const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
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
                  message: "Fetch all post successfully",
                  metadata: result.pagination,
                  data: result.allPost,
            });
      } catch (err) {
            next(err)
      }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const postId = req.params.postId as string;
            const result = await PostService.getPostById(postId);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Fetch post by id successfully",
                  data: result
            });
      } catch (err) {
            next(err)
      }
};

const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const authorId = req.user?.id as string;
            console.log(req.user);
            const result = await PostService.getMyPosts(authorId);
            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Fetch my posts successfully",
                  data: result
            });
      } catch (err) {
            next(err)
      }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const postId = req.params.postId as string;
            const authorId = req.user?.id as string;
            const isAdmin = req.user?.role === UserRole.ADMIN;

            const result = await PostService.updatePost(postId, authorId, isAdmin, req.body);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Post updated successfully",
                  data: result
            });
      } catch (err) {
            next(err)
      }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const postId = req.params.postId as string;
            const authorId = req.user?.id as string;
            const isAdmin = req.user?.role === UserRole.ADMIN;

            const result = await PostService.deletePost(postId, authorId, isAdmin);

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Post deleted successfully",
                  data: result
            });
      } catch (err) {
            next(err)
      }
};

const getStats = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const result = await PostService.getStats();

            res.status(200).json({
                  success: true,
                  statusCode: 200,
                  message: "Fetch statistics successfully",
                  data: result
            });
      } catch (err) {
            next(err)
      }
};


export const PostController = {
      createPost,
      getAllPost,
      getPostById,
      getMyPosts,
      updatePost,
      deletePost,
      getStats
};