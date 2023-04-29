const bcrypt = require("bcrypt");

const comparePasswords = (hashedPassword, inputPassword) => {
  const isMatch = bcrypt.compareSync(inputPassword, hashedPassword);
  return isMatch;
};

module.exports = comparePasswords;
