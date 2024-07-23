import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        try {
            const dbUser = await User.findByPk(user.userId);
            if (!dbUser) {
                return res.sendStatus(404);
            }

            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
            if (dbUser.lastPasswordChange < sixtyDaysAgo) {
                await dbUser.update({ mustChangePassword: true });
            }
            next();
        } catch (error) {
            return res.sendStatus(500);
        }
    });
}

export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.sendStatus(403);
        }
        if (req.user.role !== role) {
            console.log('Access denied: insufficient permissions');
            return res.status(403).json({ message: 'Accès refusé: Vous n\'avez pas les autorisations nécessaires.' });
        }
        next();
    };
}
