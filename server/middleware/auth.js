import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer Token
  if (token == null) return res.sendStatus(401); // Aucun token fourni

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token invalide ou expiré
    req.user = user;
    next(); // Passe au prochain middleware ou route handler
  });
}
