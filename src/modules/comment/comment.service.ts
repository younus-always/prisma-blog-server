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


export const CommentService = {
      createComment,
};