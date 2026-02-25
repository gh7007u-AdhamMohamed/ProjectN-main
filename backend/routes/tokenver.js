import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    
    if(!authHeader) {
        return res.status(401).json('token is required');
    }

    const token = authHeader.split(' ')[1];
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded=decoded;

        req.user = decoded; 

        next(); 

    } catch (err) {
        return res.status(401).json('invalid token');
    }
}

export default verifyToken;