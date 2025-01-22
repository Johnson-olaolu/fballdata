import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import database from "../config/database.config";
import { Article } from "./Article.model";

export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<string>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Tag.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: database }
);

Tag.belongsToMany(Article, { through: "ArticleTags" });
