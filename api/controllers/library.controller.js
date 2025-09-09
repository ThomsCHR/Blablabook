import { Book, User, Status, UserBook } from '../models/index.js';
import { httpStatusCodes } from '../errors/http.errors.js';

export const libraryController = {
   
    async addBookToUser(req, res) {
      // ajouter un livre à un utilisateur avec un status
      const userId = req.params.id;
      const { title, status_id } = req.body;
    
      try {
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
    
        // Vérifier si le livre existe
        const book = await Book.findOne({ where: { title } });
        if (!book) {
          return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'Book not found' });
        }
    
        // Vérifier si le status existe
        const status = await Status.findByPk(status_id);
        if (!status) {
          return res.status(httpStatusCodes.NOT_FOUND).json({ message: 'Status not found' });
        }
    
        // Associer le livre à l’utilisateur via la table pivot avec le status
        await user.addBook(book, { through: { status_id: status.id } });
    
        res.status(httpStatusCodes.CREATED).json({
          message: 'Book added to library',
          data: {
            username: user.username,
            book_id: book.id,
            title: book.title,
            status: status.name
          }
        });
      } catch (error) {
        console.error('Error adding book to user:', error);
        res
           .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: 'Internal server error' });
      }
    },

    async getAllUserBooks(req, res) {
      // récupérer tous les livres d'un utilisateur (avec le status)
      const userId = req.params.id;
    
      try{
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(userId);
        if (!user) {
          return res
                    .status(httpStatusCodes.NOT_FOUND)
                    .json({ message: 'User not found' });
        }
        // Récupérer les livres avec leur status
        const userBooks = await UserBook.findAll({
          where: { user_id: userId },
          include: [
            {
              model: Book,
              as: 'book',
              attributes: ['id', 'title', 'image']
            },
            {
              model: Status,
              as: 'status',
              attributes: ['id', 'name']
            }
          ]
        }
        );
        res.json(userBooks.map(library => ({
          book_id: library.book.id,
          title: library.book.title,
          status: library.status,
          image: library.book.image
        })));     
      }
      catch (error) {
        console.error('Error fetching user books with status:', error);
        res
           .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
           .json({ message: 'Internal server error' });
      }
    },

    async removeBookFromUser(req, res) {
      const userId = Number(req.params.id);
      const bookId = Number(req.params.bookId);
  
      try {
        if (!userId) {
          return res
            .status(httpStatusCodes.BAD_REQUEST)
            .json({ message: "Missing userId" });
        }
        if (!bookId) {
          return res
            .status(httpStatusCodes.BAD_REQUEST)
            .json({ message: "Missing bookId" });
        }
  
        // Vérifier l'utilisateur
        const user = await User.findByPk(userId);
        if (!user) {
          return res
            .status(httpStatusCodes.NOT_FOUND)
            .json({ message: "User not found" });
        }
  
        // Vérifier le livre
        const book = await Book.findByPk(bookId);
        if (!book) {
          return res
            .status(httpStatusCodes.NOT_FOUND)
            .json({ message: "Book not found" });
        }
  
    
        await user.removeBook(book);
  
      
        return res.send(204);
      } catch (error) {
        console.error("Error removing book from user:", error);
        return res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal server error" });
      }
    },
  };
  


