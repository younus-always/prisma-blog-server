import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
      content: string,
      userId: string,
      postId: string,
      parentId?: string
}) => {
      // checking post exist
      await prisma.post.findFirstOrThrow({
            where: { id: payload.postId }
      });
      // checking comment exist
      if (payload.parentId) {
            await prisma.comment.findFirstOrThrow({
                  where: { id: payload.parentId }
            });
      };

      return await prisma.comment.create({
            data: payload
      });
};

const getCommentById = async (id: string) => {
      return await prisma.comment.findUnique({
            where: { id },
            include: {
                  post: {
                        select: {
                              id: true,
                              title: true,
                              content: true,
                              views: true
                        }
                  }
            }
      });
};

const getCommentsByAuthor = async (authorId: string) => {
      return await prisma.comment.findMany({
            where: { userId: authorId },
            orderBy: { createdAt: "desc" },
            include: {
                  post: {
                        select: {
                              id: true,
                              title: true
                        }
                  }
            }
      });
};

const deleteComment = async (commentId: string, authorId: string) => {
      const commentData = await prisma.comment.findFirst({
            where: {
                  id: commentId,
                  userId: authorId
            },
            select: { id: true }
      });

      if (!commentData) {
            throw new Error("Your provided input is invalid!")
      };

      return await prisma.comment.delete({
            where: {
                  id: commentData.id
            }
      });
};

const updateComment = async (commentId: string, authorId: string, data: { content?: string, status?: CommentStatus }) => {
      const commentData = await prisma.comment.findFirst({
            where: {
                  id: commentId,
                  userId: authorId
            },
            select: { id: true }
      });

      if (!commentData) {
            throw new Error("Your provided input is invalid!")
      };

      return await prisma.comment.update({
            where: {
                  id: commentId,
                  userId: authorId
            },
            data
      });
};

export const CommentService = {
      createComment,
      getCommentById,
      getCommentsByAuthor,
      deleteComment,
      updateComment
};