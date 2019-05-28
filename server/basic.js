const {authenticate} = require('./services');


module.exports = basicAuth;

async function basicAuth(req, res, next) {
   
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
	const user = await authenticate({ email:username, password })
									.catch((err) => res.status(400).json(err));
    req.user = user

    next();
}