const jwt = require('jsonwebtoken');



function verifyToken(req, res, next) {
	const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
	if (!token) return res.status(401).json({ message: 'No token provided' });

	try {
		const secret = process.env.JWT_SECRET;
		const decoded = jwt.verify(token, secret);
		req.user = { id: decoded.id, role: decoded.role };
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

function verifyAdmin(req, res, next) {
	// If req.user not populated, attempt to verify token
	if (!req.user) {
		const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
		if (!token) return res.status(401).json({ message: 'No token provided' });
		try {
			const secret = process.env.JWT_SECRET;
			const decoded = jwt.verify(token, secret);
			req.user = { id: decoded.id, role: decoded.role };
		} catch (err) {
			return res.status(401).json({ message: 'Invalid token' });
		}
	}

	if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied - admin only' });
	next();
}

module.exports = { verifyToken, verifyAdmin };
