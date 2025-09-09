import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Genre extends Model {}

Genre.init(
  {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Genre",
    tableName: "genre"
  },
);