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

export function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.sendStatus(403);
        }
        // Assurez-vous que 'roles' est toujours un tableau
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        // Vérifie si le rôle de l'utilisateur est inclus dans les rôles autorisés
        if (!allowedRoles.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
}
