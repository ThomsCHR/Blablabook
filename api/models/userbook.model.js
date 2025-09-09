import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class UserBook extends Model {}

UserBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: false
    }
  },
  {
    sequelize,
    tableName: "user_book",
    modelName: "UserBook"
  }
);
