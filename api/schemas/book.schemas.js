import Joi from "joi";

// ici on stocke tous les schemas de validation pour les livres

export const createBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(), // le title doit etre une chaine de caractere et est obligatoire
  image: Joi.string().trim().required(), //l'image doit être une chaine de caractère et est obligatoire
  author: Joi.string().trim().required(), 
  publication_date: Joi.number().integer().min(0).max(2025),
  summary: Joi.string().trim().min(5).max(500).required(),
});

export const updateBookSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200), // le title doit etre une chaine de caractere et est obligatoire
    image: Joi.string().trim(), //l'image doit être une chaine de caractère et est obligatoire
    author: Joi.string().trim(), 
    publication_date: Joi.number().integer().min(0).max(2025),
    summary: Joi.string().trim().min(5).max(250),
  }).or("title", "image", "author", "publication_date", "summary"); // au moins un champ doit être renseigné pour la mise à jour