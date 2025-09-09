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
    publication_date: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 0 }
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "book"
  },
);
