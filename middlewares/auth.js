const jwt = require('jsonwebtoken');
const { User, Session } = require('../models');
const { JWT_ACCESS_SECRET_KEY } = process.env;
const auth = async (req, res, next) => {
  const authorizationHeader = req.get('Authorization');
  console.log("authorizationHeader: ", authorizationHeader);
  if (authorizationHeader) {
    const accessToken = authorizationHeader.replace('Bearer ', '');
    let payload = {};
    try {
      payload = jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY);
    } catch (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    console.log("payload: ", payload);
    const user = await User.findById(payload.uid);
    const session = await Session.findById(payload.sid);

    if (!user) {
      return res.status(404).send({ message: 'Invalid user' });
    }
    if (!session) {
      return res.status(404).send({ message: 'Invalid session' });
    }
    console.log("user: ", user);
    req.user = user;
    req.session = session;
    next();
  } else return res.status(400).send({ message: 'No token provided' });
};

module.exports = auth;
