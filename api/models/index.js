import { Book } from "./book.model.js";
import { Genre } from "./genre.model.js";
import { Status } from "./status.model.js";
import { User } from "./user.model.js";
import { UserBook } from "./userbook.model.js";
import { sequelize } from "./sequelize.client.js";

/**
 * USER <-> BOOK (many-to-many via UserBook)
 */
User.belongsToMany(Book, { 
  through: UserBook, 
  as: "books", 
  foreignKey: "user_id",   // champ dans user_book
  otherKey: "book_id"
});

Book.belongsToMany(User, { 
  through: UserBook, 
  as: "users", 
  foreignKey: "book_id", 
  otherKey: "user_id" 
});

/**
 * USER <-> BOOK (one-to-many, livres créés par un user)
 */
User.hasMany(Book, { 
  foreignKey: "user_id",   // champ dans book
  sourceKey: "id",         // PK de User
  as: "created_books"
});

Book.belongsTo(User, { 
  foreignKey: "user_id",   // champ dans book
  targetKey: "id",         // PK de User
  as: "creator"
});

/**
 * BOOK <-> GENRE (many-to-many via book_genre)
 */
Book.belongsToMany(Genre, { 
  through: "book_genre", 
  as: "genres", 
  foreignKey: "book_id", 
  otherKey: "genre_id"
});

Genre.belongsToMany(Book, { 
  through: "book_genre", 
  as: "books_per_genre", 
  foreignKey: "genre_id", 
  otherKey: "book_id"
});

/**
 * BOOK <-> STATUS (many-to-many via user_book)
 */


/**
 * USERBOOK <-> BOOK & STATUS (belongsTo nécessaires pour les includes)
 */
UserBook.belongsTo(Book, { foreignKey: "book_id", as: "book" });
UserBook.belongsTo(Status, { foreignKey: "status_id", as: "status" });
Book.hasMany(UserBook,     { foreignKey: "book_id",   as: "userBooks" });
Status.hasMany(UserBook,   { foreignKey: "status_id", as: "userBooksWithStatus" });

export {
  Book,
  Genre,
  Status,
  User,
  UserBook,
  sequelize
};
