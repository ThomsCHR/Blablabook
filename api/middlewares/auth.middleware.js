
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { httpStatusCodes } from '../errors/http.errors.js';


export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    const token = authHeader.slice(7).trim(); 
    if (!token) return res.status(401).json({ error: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id ?? decoded.user_id; 
    if (!userId) return res.status(401).json({ error: 'Invalid token payload' });

    req.user = { id: userId }; 
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

 // Autorise uniquement les admins

export async function isAdmin(req, res, next) {
  try {
    if (!req.user?.id) { // vérifie que l'utilisateur est authentifié
      return res.status(httpStatusCodes.UNAUTHORIZED).json({ error: 'Unauthenticated' }); // 401 = unauthorized
    }

    const user = await User.findByPk(req.user.id, { // cherche l'utilisateur en BDD
      attributes: ['id', 'role'], // ne récupère que l'id et le rôle
    });

    if (!user) {
      return res.status(httpStatusCodes.NOT_FOUND).json({ error: 'Utilisateur introuvable' });
    }

    if (user.role !== 'admin') {
      return res.status(httpStatusCodes.FORBIDDEN).json({ error: 'Accès réservé aux administrateurs' });
    }

    next();
  } catch {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
}
