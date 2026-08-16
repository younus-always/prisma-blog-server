import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middlewares/auth";

const createPost = async (data: Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string) => {
      const result = await prisma.post.create({
            data: {
                  ...data,
                  userId
            }
      });
      return result;
};

const getAllPost = async ({ search, tags, isFeatured, status, userId, page, limit, skip, sortBy, sortOrder }: {
      search: string | undefined,
      tags: string[] | [],
      isFeatured: boolean | undefined,
      status: PostStatus | undefined,
      userId: string | undefined,
      page: number,
      limit: number,
      skip: number,
      sortBy: string,
      sortOrder: string
}) => {

      const andConditions: PostWhereInput[] = [];

      if (search) {
            andConditions.push({
                  OR: [
                        {
                              title: {
                                    contains: search as string,
                                    mode: "insensitive"
                              }
                        },
                        {
                              content: {
                                    contains: search as string,
                                    mode: "insensitive"
                              }
                        },
                        {
                              tags: {
                                    has: search as string
                              }
                        }
                  ]
            })
      };

      if (tags.length > 0) {
            andConditions.push({
                  tags: {
                        hasEvery: tags
                  }
            })
      };

      if (typeof isFeatured === "boolean") {
            andConditions.push({
                  isFeatured
            })
      };

      if (status) {
            andConditions.push({
                  status
            })
      };

      if (userId) {
            andConditions.push({
                  userId
            })
      };

      const total = await prisma.post.count({
            where: {
                  AND: andConditions
            }
      });

      const allPost = await prisma.post.findMany({
            take: limit,
            skip,
            where: {
                  AND: andConditions
            },
            orderBy: {
                  [sortBy]: sortOrder
            },
            include: {
                  _count: {
                        select: { comments: true }
                  }
            }
      });

      return {
            allPost,
            pagination: {
                  total,
                  page,
                  limit,
                  totalPage: Math.ceil(total / limit)
            }
      };
};

const getPostById = async (postId: string) => {
      return await prisma.$transaction(async (tx) => {
            await tx.post.update({
                  where: { id: postId },
                  data: {
                        views: {
                              increment: 1
                        }
                  }
            });

            const postData = await tx.post.findUnique({
                  where: { id: postId },
                  include: {
                        comments: {
                              where: {
                                    parentId: null,
                                    status: CommentStatus.APPROVED
                              },
                              orderBy: { createdAt: "desc" },
                              include: {
                                    replies: {
                                          where: {
                                                status: CommentStatus.APPROVED
                                          },
                                          orderBy: { createdAt: "asc" },
                                          include: {
                                                replies: {
                                                      where: {
                                                            status: CommentStatus.APPROVED
                                                      },
                                                      orderBy: { createdAt: "asc" }
                                                }
                                          }
                                    }
                              }
                        },
                        _count: {
                              select: {
                                    comments: true
                              }
                        }
                  }
            });

            return postData;
      });
};

const getMyPosts = async (authorId: string) => {
      await prisma.user.findUniqueOrThrow({
            where: {
                  id: authorId,
                  status: "ACTIVE"
            },
            select: {
                  id: true
            }
      });

      const result = await prisma.post.findMany({
            where: {
                  userId: authorId
            },
            orderBy: { createdAt: "desc" },
            include: {
                  _count: {
                        select: {
                              comments: true
                        }
                  }
            }
      });

      return result;
};

const updatePost = async (postId: string, authorId: string, isAdmin: boolean, data: Partial<Post>) => {
      const postData = await prisma.post.findUniqueOrThrow({
            where: { id: postId },
            select: {
                  id: true,
                  userId: true
            }
      });

      if (!isAdmin && (postData.userId !== authorId)) {
            throw new Error(`You are not the owner/creator of this post!`)
      };

      if (!isAdmin) {
            delete data.isFeatured
      };

      return await prisma.post.update({
            where: { id: postId },
            data
      });
};

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
      const postData = await prisma.post.findUniqueOrThrow({
            where: { id: postId },
            select: {
                  id: true,
                  userId: true,
            }
      });

      if (!isAdmin && (postData.userId !== authorId)) {
            throw new Error("You are not owner/creator on this post!");
      };

      return await prisma.post.delete({
            where: { id: postId }
      });
};

const getStats = async () => {
      return await prisma.$transaction(async (tx) => {
            const [totalPosts, publishedPosts, draftPosts, archivedPosts, totalComments, approvedComments, rejectComments, totalUsers, adminCount, userCount, totalViews] = await Promise.all([
                  await tx.post.count(),
                  await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
                  await tx.post.count({ where: { status: PostStatus.DRAFT } }),
                  await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
                  await tx.comment.count(),
                  await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
                  await tx.comment.count({ where: { status: CommentStatus.REJECT } }),
                  await tx.user.count(),
                  await tx.user.count({ where: { role: UserRole.ADMIN } }),
                  await tx.user.count({ where: { role: UserRole.USER } }),
                  await tx.post.aggregate({ _sum: { views: true } }),
            ]);

            return {
                  totalPosts,
                  publishedPosts,
                  draftPosts,
                  archivedPosts,
                  totalComments,
                  approvedComments,
                  rejectComments,
                  totalUsers,
                  adminCount,
                  userCount,
                  totalViews: totalViews._sum.views
            }
      });

};


export const PostService = {
      createPost,
      getAllPost,
      getPostById,
      getMyPosts,
      updatePost,
      deletePost,
      getStats
};