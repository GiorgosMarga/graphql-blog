const { prisma } = require("../../db/prisma");

const { GraphQLError } = require("graphql");
const comparePasswords = require("../../utils/comparePasswords");
const jwt = require("jsonwebtoken");
async function login(_, { email, password }, context) {
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new GraphQLError("Invalid credentials.", {
      code: "INVALID_CREDENTIALS",
    });
  }
  const isPasswordCorrect = comparePasswords(user.password, password);
  if (!isPasswordCorrect) {
    throw new GraphQLError("Invalid Credentials", {
      code: "INVALID_CREDENTIALS",
    });
  }
  const token = jwt.sign(user, process.env.JWT_KEY);
  user = {
    ...user,
    token,
  };

  return user;
}

module.exports = login;
