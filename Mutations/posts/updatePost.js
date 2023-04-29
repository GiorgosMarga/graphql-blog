const { prisma } = require("../../db/prisma");
const { GraphQLError } = require("graphql");
const postSchema = require("../../validateSchemaJoi/postSchema");
async function updatePost(_, { postId, text, title }, context) {
  const user = context;
  if (!user) {
    throw new GraphQLError("You are not authenticated.", {
      code: "NOT_AUTHENTICATED",
    });
  }
  const { error, value } = postSchema.validate({ title, text });
  if (error) {
    throw new GraphQLError("Invalid input", {
      code: "BAD_INPUT",
    });
  }
  let post;
  try {
    post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
  } catch (error) {
    throw new GraphQLError("Internal server error", {
      code: "DB_ERROR",
    });
  }

  if (!post) {
    throw new GraphQLError("Post does not exist", {
      code: "POST_NOT_FOUND",
    });
  }
  if (post.userId !== user.id) {
    throw new GraphQLError("You are not authorized.", {
      code: "NOT_AUTHORIZED_UPDATE",
    });
  }
  const newPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      title,
      text,
    },
  });
  return newPost;
}

module.exports = updatePost;
