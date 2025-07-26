import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        // Remove 'Bearer ' prefix if present
        const tokenParts = token.split(' ');
        if (tokenParts.length > 1) {
            req.token = tokenParts[1];
        } else {
            req.token = token;
        }
    }
    if (!req.token) {
        return res.status(403).json({message: 'No token provided'});
    }

    jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        req.user = decoded;
        next();
    });
}

export default verifyToken;