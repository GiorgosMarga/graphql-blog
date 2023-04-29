const { prisma } = require("../../db/prisma");
const { GraphQLError } = require("graphql");
const postSchema = require("../../validateSchemaJoi/postSchema");
async function createPost(_, { text, title }, context) {
  const user = context;
  if (!user) {
    throw new GraphQLError("You are not authenticated.", {
      code: "NOT_AUTHENTICATED",
    });
  }
  const { error, value } = postSchema.validate({ text, title });
  if (error) {
    throw new GraphQLError("Bad request. Check all neccesaary inputs", {
      code: "BAD_REQUEST",
    });
  }
  let post;
  try {
    post = await prisma.post.create({
      data: {
        userId: user.id,
        text,
        title,
      },
    });
  } catch (error) {
    throw new GraphQLError("Internal server error.", {
      code: "DB_ERROR",
    });
  }

  return post;
}

module.exports = createPost;
