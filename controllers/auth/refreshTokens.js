const { User, Session } = require('../../models');
const { Unauthorized, NotFound, BadRequest } = require('http-errors');
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = process.env;

const refreshTokens = async (req, res) => {
  const authorizationHeader = req.get('Authorization');
  console.log("REFRESHTOKENFUNC:authorizationHeader: ", authorizationHeader)
  console.log("REFRESHTOKENFUNC:req.body.sid: ", req.body.sid);
  if (authorizationHeader) {
    const activeSession = await Session.findById(req.body.sid);
    if (!activeSession) {
      throw new NotFound('Invalid session');
    }

    const reqRefreshToken = authorizationHeader.replace('Bearer ', '');

    let payload = {};
    try {
      payload = jwt.verify(reqRefreshToken, JWT_REFRESH_SECRET_KEY);
    } catch (err) {
      await Session.findByIdAndDelete(req.body.sid);
      throw new Unauthorized('Not authorized');
    }

    const user = await User.findById(payload.uid);
    const session = await Session.findById(payload.sid);
    if (!user) {
      throw new NotFound('Invalid user');
    }
    if (!session) {
      throw new NotFound('Invalid session');
    }

    await Session.findByIdAndDelete(payload.sid);
    const newSession = await Session.create({
      uid: user._id,
    });

    const accessToken = jwt.sign({ uid: user._id, sid: newSession._id }, JWT_ACCESS_SECRET_KEY, { expiresIn: '1m' });
    const refreshToken = jwt.sign({
      uid: user._id,
      sid: newSession._id,
    }, JWT_REFRESH_SECRET_KEY, { expiresIn: '30d' });
    console.log("NEWREFRESH: ", refreshToken)
    console.log("NEWACCESS: ", accessToken)

    res.json(
      {
        status: 'success',
        code: 200,
        data: {
          sid: newSession._id,
          accessToken,
          refreshToken,
        },
      },
    );
  }
  throw new BadRequest('No token provided');
};

module.exports = refreshTokens;