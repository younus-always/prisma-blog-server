import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string) => {
      const result = await prisma.post.create({
            data: {
                  ...data,
                  userId
            }
      });
      return result;
};


export const PostService = {
      createPost
};