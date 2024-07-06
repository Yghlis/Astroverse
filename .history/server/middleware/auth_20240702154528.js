import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (token == null) {
        console.log('Token not present');
        return res.sendStatus(401); // Token non présent
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token invalid');
            return res.sendStatus(403); // Token invalide
        }
        console.log('User authenticated:', user);
        req.user = user;
        next();
    });
}

export function requireRole(role) {
    return (req, res, next) => {
        console.log('Checking role for user:', req.user);
        if (!req.user || !req.user.roles.includes(role)) {
            console.log('Access denied: insufficient permissions');
            return res.status(403).json({ message: 'Accès refusé: Vous n\'avez pas les autorisations nécessaires.' });
        }
        next();
    };
}
