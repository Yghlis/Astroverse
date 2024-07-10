import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        console.log('Token not present');
        return res.sendStatus(401); // Token non présent
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            console.log('Token invalid:', err);
            return res.sendStatus(403); // Token invalide
        }
        console.log('User authenticated:', user);
        req.user = user;

        // Ajout de logs pour vérifier le contenu de req.user
        console.log('User object in request:', req.user);

        // Vérification des 60 jours pour le changement de mot de passe
        try {
            const dbUser = await User.findByPk(user.userId); // Assurez-vous d'utiliser la bonne clé ici
            if (!dbUser) {
                console.log('User not found in database');
                return res.sendStatus(404); // Utilisateur non trouvé
            }

            // Ajoutez les rôles à req.user
            req.user.roles = dbUser.roles;
            console.log('Roles added to req.user:', req.user.roles);

            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

            console.log('Checking if password change is required');
            if (dbUser.lastPasswordChange < sixtyDaysAgo) {
                console.log('Password change required, updating mustChangePassword to true');
                await dbUser.update({ mustChangePassword: true });
            }

            next();
        } catch (error) {
            console.log('Error checking password change date:', error);
            return res.sendStatus(500); // Erreur serveur
        }
    });
}

export function requireRole(role) {
    return (req, res, next) => {
        console.log('Checking role for user:', req.user);
        if (!req.user || !req.user.roles) {
            console.log('Roles not present on user object');
            return res.status(403).json({ message: 'Accès refusé: Vous n\'avez pas les autorisations nécessaires.' });
        }
        if (!req.user.roles.includes(role)) {
            console.log('Access denied: insufficient permissions');
            return res.status(403).json({ message: 'Accès refusé: Vous n\'avez pas les autorisations nécessaires.' });
        }
        next();
    };
}
