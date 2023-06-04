const createTokenUser = (user) => {
  return { name: user.name, usrId: user._id, role: user.role };
};

module.exports = createTokenUser;
