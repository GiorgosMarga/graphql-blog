const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const { prisma } = require("../db/prisma");

const authenticateMiddleware = async (req, res, next) => {
  const headerToken = req.headers.authorization || "";
  const webToken = headerToken.split(" ")[1];
  if (!headerToken || !webToken) {
    return next();
  }
  let decodedUser;
  let user;
  try {
    decodedUser = jwt.decode(webToken, process.env.JWT_KEY);
    user = await prisma.user.findUnique({
      where: {
        id: decodedUser.id,
      },
    });
    if (!user) {
      throw new GraphQLError("You need to be authenticated.", {
        code: "NOT_AUTHENTICATED",
      });
    }
  } catch (err) {
    throw new GraphQLError("You need to be authenticated.", {
      code: "NOT_AUTHENTICATED",
    });
  }

  req.user = user;
  next();
};

module.exports = authenticateMiddleware;
