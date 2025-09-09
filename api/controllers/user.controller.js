import { User } from '../models/index.js';
import { httpStatusCodes } from '../errors/http.errors.js';

export const profileController = {
 
  async getMe(req, res) {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        return res.status(401).json({ error: 'Token invalide' });
      }
      const user = await User.findByPk(userId, {
        
        attributes: ['id', 'username', 'email'],
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
  
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateMe(req, res) {
    try {
      const { username, email, password } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(httpStatusCodes.NOT_FOUND).json({ error: 'Utilisateur introuvable' });
      }

      // si l'utilisateur envoie un username, on le change
      if (username) user.username = username;

      // si l'utilisateur envoie un email, on le change
      if (email) user.email = email;

      // si l'utilisateur envoie un password, on le hash et on le change
      if (password) {
        user.password = await argon2.hash(password);
      }

      await user.save();

      return res.status(httpStatusCodes.OK).json({
        message: 'Informations mises à jour',
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      console.error(err);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erreur interne du serveur' });
    }
  },
};

