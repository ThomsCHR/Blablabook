import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class Status extends Model {}

Status.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Status",
    tableName: "status"
  },
);