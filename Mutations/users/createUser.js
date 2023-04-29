const { prisma } = require("../../db/prisma");

const hashPassword = require("../../utils/hashPassword");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const userRegisterSchema = require("../../validateSchemaJoi/userRegisterSchema");
async function createUser(_, { email, password, username }) {
  const { error, value } = userRegisterSchema.validate({
    email,
    password,
    username,
  });
  if (error) {
    throw new GraphQLError(
      "Bad request. Check again all the neccessary input",
      {
        code: "BAD_REQUEST",
      }
    );
  }
  const emailAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (emailAlreadyExists) {
    throw new GraphQLError("Email is already in use", {
      code: "EMAIL_USED",
    });
  }
  let user = await prisma.user.create({
    data: {
      email,
      password: hashPassword(password),
      username,
    },
  });
  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_KEY
  );
  user = {
    ...user,
    token: token,
  };
  return user;
}

module.exports = createUser;
