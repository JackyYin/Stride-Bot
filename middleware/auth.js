const jwtUtil = require('jwt-simple');

const getContextInfo = function(decodedJWT) {
  return { 
      conversationId:decodedJWT.context.resourceId,
      cloudId:decodedJWT.context.cloudId,
      resource:decodedJWT.context.resourceType,
      userId: decodedJWT.sub 
    };
};

const authMiddleware = secret => (req, res, next) => {
  const reqPath = req.path;

  if ( req.method === 'OPTIONS') {
    next();
  } else {
    try {
     
      const encodedJwt =
        req.query['jwt'] ||
        req.headers['authorization'].substring(7) ||
        req.headers['Authorization'].substring(7);

      // extract jwt token from req param or from auth header.
      // Decode the base64-encoded token, which contains the context of the apiCall
      const decodedJwt = jwtUtil.decode(encodedJwt, null, true);

      // Validate the token signature using the app's OAuth secret (created in DAC App Management)
      jwtUtil.decode(encodedJwt, secret);

      // store context information in context locals context object
      let context = getContextInfo(decodedJwt);
      res.locals.context = context;
      req.locals = context;
      next();
    } catch (err) {
      if (err.message.indexOf('substring') > 0)
        res.status(400).json({ message: `JWT token not found` });
      else res.status(403).json({ message: `unable to authenticate: ${err}` });
      throw err;
    }
  }
};

module.exports = authMiddleware;