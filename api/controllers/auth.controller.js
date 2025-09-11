// controllers/auth.controller.js
import argon2 from 'argon2'; // sert à hasher les mots de passe
import { Op } from 'sequelize'; // sert à faire des requêtes avec des opérateurs (OR, AND, etc.) via sequelize
import { User } from '../models/index.js'; // importe le modèle User
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { registerSchema } from '../schemas/auth.schemas.js';
import { HttpBadRequestError, HttpConflictError, httpStatusCodes } from '../errors/http.errors.js';
import { loginSchema } from '../schemas/auth.schemas.js';

export const authController = {
  async register(req, res) {
    try {
      const { username, email, password } = Joi.attempt(req.body, registerSchema); // récupère les données du corps de la requête

      // champs requis
      if (!username || !email || !password) {
        throw new HttpBadRequestError(httpStatusCodes.BAD_REQUEST); // 400 = bad request
      }

      // doublons username/email ?
      const exists = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] }, // savoir si l'username OU l'email existe déjà
        attributes: ['username','email'] 
      });
      if (exists) {
        const field = exists.username === username ? 'username' : 'email'; // savoir quel champ est en doublon
        throw new HttpConflictError(`${field} already in use`); // 409 = conflict
      }

      // hash du mot de passe

      const hash = await argon2.hash(password);




      // création
      const user = await User.create({ username, email, password: hash }); // on stocke le hash en base de données, pas le mot de passe en clair

      // Créer un token JWT pour connecter automatiquement l'utilisateur
      const token = jwt.sign(
        { user_id: user.id }, // informations à stocker dans le token
        process.env.JWT_SECRET, // secret pour le chiffrement
        { expiresIn: "1h" } // délai d'expiration
      );

      // réponse avec le token pour connexion automatique
      return res.status(httpStatusCodes.CREATED).json({
        token, // token pour connexion automatique
        user: {
          id: user.id, // retourne l'id de l'utilisateur créé
          username: user.username, // retourne l'username de l'utilisateur créé
          email: user.email, // retourne l'email de l'utilisateur créé
          role: user.role, // retourne le rôle de l'utilisateur
          status: user.status, // retourne le statut de l'utilisateur (Actif par défaut)
          created_at: user.createdAt, // retourne la date de création de l'utilisateur
        }
      });
    } catch (e) {
      // gère le cas unique constraint si jamais
      if (e.name === 'SequelizeUniqueConstraintError') { // vérifie si l'erreur est une erreur de contrainte d'unicité, comme par exemple un doublon d'email ou d'username
        throw new HttpConflictError(`${e.errors?.[0]?.path} already in use`); // retourne le champ en doublon
      }
      console.error(e);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  },

  async login(req, res) {
    const { email, password } = Joi.attempt(req.body, loginSchema);

    try {
      // On va chercher si l'utilisateur existe...
      const user = await User.findOne({ where: { email } });
  
      // je vais vérifier si l'utilisateur possède bien le même mot
      // de passe haché que celui qui a été renseigné dans le formulaire
      // de connexion
      const passwordVerify = await argon2.verify(user.password, password);
      console.log(user);
      console.log(passwordVerify);
  
      // Si l'utilisateur n'a pas le bon mot de passe
      // OU si l'utilisateur n'existe pas en BDD
      // je retourne l'erreur équivalente
      if (!user || !passwordVerify) {
        return res
          .status(httpStatusCodes.UNAUTHORIZED)
          .json({ error: "Email ou mot de passe invalide" });
      }

      // Pour vérifier si l'utilisateur est actif MAJ
      if (user.status !== 'Actif') {
        return res
          .status(httpStatusCodes.UNAUTHORIZED)
          .json({ error: "Compte désactivé. Contactez l'administrateur." });
      }
  
      // Je suis certain d'avoir le bon utilisateur
      // et le bon mot de passe. Ici, je vais créer un token
      const token = jwt.sign(
        { user_id: user.id }, // Ici, j'indique les informations à stocker dans le token
        process.env.JWT_SECRET, // Le secret pour le chiffrement
        { expiresIn: "1h" } // Options du token comme le délai d'expiration
      );
  
      // Si tout marche bien, on va l'indiquer à notre utilisateur
      res.status(200).json({ token });
    } catch (error) {
      // S'il s'agit d'une erreur côté serveur
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur de serveur interne" });
    }
},
};
