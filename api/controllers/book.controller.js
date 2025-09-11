import { Book, Genre } from '../models/index.js';
import { Op, fn, col, where } from 'sequelize';
import Joi from 'joi';
import { updateBookSchema } from '../schemas/book.schemas.js';
import { httpStatusCodes } from '../errors/http.errors.js';

export const bookController = { 
  // récupérer tous les livres avec leur(s) genre(s)
  async getAll(req, res) {
    try {
      const books = await Book.findAll({
        include: [
          {
            model: Genre,
            as: "genres",
            through: { attributes: [] },
          },
        ],
        order: [
          ["title", "ASC"],
          [{ model: Genre, as: "genres" }, "label", "ASC"],
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
      const { title } = req.params;
      const book = await Book.findOne({ where: { title } });
      if (!book) {
        return res.status(httpStatusCodes.NOT_FOUND).json("Book not found");
      }
      res.status(httpStatusCodes.OK).json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  },

  // recherche partielle par titre
  async searchByTitle(req, res) {
    try {
      const { query } = req.query;

      if (!query?.trim()) {
        return res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ error: "Query parameter is required" });
      }

      const books = await Book.findAll({
        where: {
          title: { [Op.iLike]: `%${query.trim()}%` },
        },
        include: [{ model: Genre, as: "genres", through: { attributes: [] } }],
        order: [["title", "ASC"]],
      });

      res.json(books);
    } catch (error) {
      console.error("Error searching books:", error);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  },

  // récupérer un livre par id avec ses genres
  async getById(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id, {
        include: [
          { model: Genre, as: "genres", through: { attributes: [] } },
        ],
      });
      if (!book) {
        return res
          .status(httpStatusCodes.NOT_FOUND)
          .json({ error: "Book not found" });
      }
      res.status(httpStatusCodes.OK).json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  },

  // créer un livre + associer un genre (via son label)
  async create(req, res) {
    try {
      const { title, author, summary, image, genre, publication_date } = req.body;

      if (!title || !author || !summary || !genre) {
        return res.status(400).json({
          error: "title, author, summary et genre sont requis",
        });
      }

      // vérifier doublon (title+author insensible à la casse)
      const exists = await Book.findOne({
        where: {
          [Op.and]: [
            where(fn("LOWER", col("title")), title.trim().toLowerCase()),
            where(fn("LOWER", col("author")), author.trim().toLowerCase()),
          ],
        },
      });
      if (exists) {
        return res.status(409).json({ error: "Ce livre existe déjà" });
      }

      // chercher le genre via son label (insensible à la casse)
      const genreRow = await Genre.findOne({
        where: where(fn("LOWER", col("label")), genre.trim().toLowerCase()),
      });
      if (!genreRow) {
        return res.status(httpStatusCodes.NOT_FOUND).json({ error: "Unknown genre" });
      }

      // créer le livre
      const newBook = await Book.create({
        title: title.trim(),
        author: author.trim(),
        summary: summary.trim(),
        image: image?.trim() || null,
        publication_date: publication_date ?? null,
      });

      // associer au genre
      await newBook.addGenre(genreRow);

      // recharger avec include
      const bookWithGenres = await Book.findByPk(newBook.id, {
        include: [{ model: Genre, as: "genres", through: { attributes: [] } }],
      });

      return res.status(201).json(bookWithGenres);
    } catch (e) {
      console.error(e);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  },

  // modifier un livre
  async updateById(req, res) {
    const { id } = req.params;
    const data = Joi.attempt(req.body, updateBookSchema);
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(httpStatusCodes.NOT_FOUND).json("livre non trouvé");
    }
    await book.update(data);
    res.status(httpStatusCodes.OK).json(book);
  },

  // supprimer un livre
  async deleteById(req, res) {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(httpStatusCodes.NOT_FOUND).json("Book not found");
    }
    await book.destroy();
    res.status(httpStatusCodes.NO_CONTENT).json();
  },
};
