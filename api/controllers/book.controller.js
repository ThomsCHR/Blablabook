import { Book, Genre, Status, User } from '../models/index.js';
import { Op } from 'sequelize';
import Joi from 'joi';
import { updateBookSchema } from '../schemas/book.schemas.js'
import { httpStatusCodes } from '../errors/http.errors.js';

export const bookController = { 
  // récupérer tous les livres de la base de donnée avec leur genre
  async getAll(req, res) {
    try {
      const books = await Book.findAll({
        include: [
          {
            model: Genre,
            as: "genres",             // correspond à l'alias défini dans index.js
            through: { attributes: [] },
          },
        ],
        order: [
          ["title", "ASC"],
          [{ model: Genre, as: "genres" }, "label", "ASC"], // alias obligatoire ici aussi
        ],
      });

      res.json(books);
    } catch (error) {
      console.error("Error fetching books with genres:", error);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  },
  



  // récupérer un livre par son titre 
  async getByTitle(req, res) {
    try {
      const {title} = req.params
      const book = await Book.findOne({where: {title}})
      if (!title) {
        res.status(httpStatusCodes.NOT_FOUND).json('Book not found')
      }
      res.status(httpStatusCodes.OK).json(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error'});
    }
  },

  // rechercher des livres par titre (recherche partielle) -- Ludovic --
  async searchByTitle(req, res) {
  try {
    const { query } = req.query;

    if (!query?.trim()) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({ error: 'Query parameter is required' });
    }

    const books = await Book.findAll({
      where: {
        title: { [Op.iLike]: `%${query.trim()}%` }
      },
      include: [{
        model: Genre,
        as: "genres",
        through: { attributes: [] }
      }],
      order: [["title", "ASC"]]
    });

    res.json(books); // renvoyer la liste des livres trouvés
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
},

  // récupérer un livre par son id avec son genre
  async getById(req,res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, {
        include: [
          {
            model: Genre,
            as: "genres",             // correspond à l'alias défini dans index.js
            through: { attributes: [] },
          },
        ],
        order: [
          ["title", "ASC"],
          [{ model: Genre, as: "genres" }, "label", "ASC"], // alias obligatoire ici aussi
        ],
      });
      if (!book) {
        return res.status(httpStatusCodes.NOT_FOUND).json({ error: 'Book not found' });
      }
      res.status(httpStatusCodes.OK).json(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error'});
    }
  },


  async create(req, res) {
  // créer un livre dans la base de donnée
    try {
      const { title, author, summary, image, genre, publication_date} = req.body;
      if (!title || !author || !summary || !image || !genre ) { // Vérification des champs requis
        return res.status(400).json({ error: 'title, author, summary, image, genre are required' });
      }

      // Résoudre le genre via son label
      const genreRow = await Genre.findOne({ where: { label: genre } });
      if (!genreRow) return res.status(httpStatusCodes.NOT_FOUND).json({ error: 'Unknown genre' });


      // Créer le livre
      const newBook = await Book.create({ title, author, summary, image, publication_date});
      
      // Associer le livre au genre
      if (newBook.addGenre) await newBook.addGenre(genreRow);
      res.status(201).json({
        ...newBook.toJSON(),   // <-- ici on récupère juste les données du livre
        genre: genreRow.label  // on ajoute le genre
      });
      

    } catch (e) {
      console.error(e);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
  },

  
    
  async updateById(req, res) {
  // modifier un livre par son id
    // récuperer le titre de la liste souhaitée
    const { id } = req.params;

    // récupérer et valider les données du corps de la requête
    const data = Joi.attempt(req.body, updateBookSchema);

    // récupérer le livre qui porte ce titre
    const book = await Book.findByPk(id);

    // si le livre n'existe pas
    if (!book) {
      // il faut envoyer une erreur explicite au client
      res.status(httpStatusCodes.NOT_FOUND).json("livre non trouvé");
    }

    // mettre à jour les données du livre avec les données du corps de la requête
    await book.update(data);

    // envoyer la liste mise à jour au client en json
    res.status(httpStatusCodes.OK).json(book);
  },


  async deleteById(req, res) {
  // supprimer un livre par son id
    const { id } = req.params; // ecriture déstructurée (destructuring)

    // récupérer le livre qui porte cet id
    const book = await Book.findByPk(id);

    // si le livre n'existe pas
    if (!book) {
      // il faut envoyer une erreur explicite au client
      res.status(httpStatusCodes.NOT_FOUND).json("Book not found");
    }

    // supprimer ce livre
    book.destroy();

    // réponse standard REST : status 204 no content
    res.status(httpStatusCodes.NO_CONTENT).json();
  },
}


