import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        console.log('Token not present');
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }
        // Vérification des 60 jours pour le changement de mot de passe
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
            return res.status(403).json({ message: 'Accès refusé: Vous n\'avez pas les autorisations nécessaires.' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Accès refusé: Vous n\'avez pas les autorisations nécessaires.' });
        }
        next();
    };
}
