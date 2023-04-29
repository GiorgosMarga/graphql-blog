const { GraphQLError } = require("graphql");
const { prisma } = require("../../db/prisma");

async function deletePost(_, { postId }, context) {
  const user = context;
  if (!user) {
    throw new GraphQLError("You are not authenticated.", {
      code: "NOT_AUTHENTICATED",
    });
  }
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) {
    throw new GraphQLError("Post does not exist", {
      code: "POST_NOT_FOUND",
    });
  }
  if (post.userId !== user.id) {
    throw new GraphQLError("You are not authorized.", {
      code: "NOT_AUTHORIZED_DELETE",
    });
  }
  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return deletedPost;
}

module.exports = deletePost;
