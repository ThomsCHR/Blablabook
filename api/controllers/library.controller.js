// controllers/library.controller.js
import { Book, User, Status, UserBook } from '../models/index.js';
import { httpStatusCodes } from '../errors/http.errors.js';

export const libraryController = {
  // POST /api/:id/library   body: { book_id? , title? , status_id }
  async addBookToUser(req, res) {
    const userId = Number(req.params.id);
    const { book_id, title, status_id } = req.body || {};

    try {
      if (!userId) return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Missing userId' });
      if (!status_id) return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Missing status_id' });

      const user = await User.findByPk(userId);
      if (!user) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'User not found' });

      let book = null;
      if (book_id) book = await Book.findByPk(Number(book_id));
      else if (title) book = await Book.findOne({ where: { title } });

      if (!book) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'Book not found' });

      const status = await Status.findByPk(Number(status_id));
      if (!status) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'Status not found' });

      // Upsert dans la table pivot (évite les doublons, met à jour le statut si déjà présent)
      const row = { user_id: user.id, book_id: book.id, status_id: status.id };
      await UserBook.upsert(row);

      return res.status(httpStatusCodes.CREATED).json({
        message: 'Book added to library',
        data: { username: user.username, book_id: book.id, title: book.title, status: status.name }
      });
    } catch (error) {
      console.error('Error adding book to user:', error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  },

  // GET /api/:id/library
  async getAllUserBooks(req, res) {
    const userId = Number(req.params.id);

    try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'User not found' });

      const userBooks = await UserBook.findAll({
        where: { user_id: userId },
        include: [
          { model: Book, as: 'book', attributes: ['id', 'title', 'image'] },
          { model: Status, as: 'status', attributes: ['id', 'name'] }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.json(
        userBooks.map((row) => ({
          book_id: row.book?.id,
          title: row.book?.title,
          image: row.book?.image,
          status: row.status ? { id: row.status.id, name: row.status.name } : null
        }))
      );
    } catch (error) {
      console.error('Error fetching user books with status:', error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  },

  // DELETE /api/:id/library/:bookId
  async removeBookFromUser(req, res) {
    const userId = Number(req.params.id);
    const bookId = Number(req.params.bookId);

    try {
      if (!userId) return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Missing userId' });
      if (!bookId) return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Missing bookId' });

      const user = await User.findByPk(userId);
      if (!user) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'User not found' });

      const book = await Book.findByPk(bookId);
      if (!book) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'Book not found' });

      await user.removeBook(book); // supprime la ligne pivot user_books
      return res.sendStatus(204);
    } catch (error) {
      console.error('Error removing book from user:', error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  },

  // PATCH /api/:id/library/:bookId/status   body: { status_id }
  async updateBookStatus(req, res) {
    const userId = Number(req.params.id);
    const bookId = Number(req.params.bookId);
    const { status_id } = req.body || {};

    try {
      if (!userId) return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Missing userId' });
      if (!bookId) return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Missing bookId' });
      if (!status_id) return res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Missing status_id' });

      const user = await User.findByPk(userId);
      if (!user) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'User not found' });

      const book = await Book.findByPk(bookId);
      if (!book) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'Book not found' });

      const status = await Status.findByPk(Number(status_id));
      if (!status) return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'Status not found' });

      const [updatedRows] = await UserBook.update(
        { status_id: status.id },
        { where: { user_id: userId, book_id: bookId } }
      );

      if (updatedRows === 0) {
        // Si l’association n’existe pas encore, on la crée (optionnel, sinon 404)
        await UserBook.create({ user_id: userId, book_id: bookId, status_id: status.id });
      }

      return res.json({
        message: 'Book status updated',
        data: { username: user.username, book_id: book.id, title: book.title, status: status.name }
      });
    } catch (error) {
      console.error('Error updating book status:', error);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
};
