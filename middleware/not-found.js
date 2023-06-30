const { MESSAGES } = require('../constants/messages');

const notFound = (req, res) => res.status(404).send(MESSAGES.invalidRoute);

module.exports = notFound;
