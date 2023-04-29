const { prisma } = require("./db/prisma");
const { GraphQLError } = require("graphql");
const login = require("./Mutations/users/login");
const createUser = require("./Mutations/users/createUser");
const createPost = require("./Mutations/posts/createPost");
const deletePost = require("./Mutations/posts/deletePost");
const updatePost = require("./Mutations/posts/updatePost");
const resolvers = {
  Query: {
    users: async () => {
      const users = await prisma.user.findMany({});
      return users;
    },
    user: async (_, { id }) => {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          posts: true,
        },
      });
      if (!user) {
        throw new GraphQLError("User does not exist.", {
          code: "USER_DOES_NOT_EXIST",
        });
      }
      return user;
    },
    post: async (_, { id }) => {
      let post;
      try {
        post = await prisma.post.findUnique({
          where: {
            id,
          },
        });
      } catch (err) {
        throw new GraphQLError("There was an internal error", {
          code: "DB_ERROR",
        });
      }
      if (!post) {
        throw new GraphQLError("Post does not exist.", {
          code: "POST_NOT_FOUND",
        });
      }
      return post;
    },
    posts: async () => {
      const posts = await prisma.post.findMany({});
      return posts;
    },
  },
  Mutation: {
    createUser,
    login,
    createPost,
    deletePost,
    updatePost,
  },
};

module.exports = resolvers;
