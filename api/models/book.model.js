import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Book extends Model {}

Book.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "book",
    indexes: [{ unique: true, fields: ["title", "author"], name: "book_title_author" }]
  },
);
