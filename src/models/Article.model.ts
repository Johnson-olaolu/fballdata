import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import database from "../config/database.config";
import { User } from "./User.model";
import { ArticleView } from "./ArticleViews.model";
import { Tag } from "./Tag.model";

// order of InferAttributes & InferCreationAttributes is important.
export class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<string>;
  declare title: string;
  declare image: string;
  declare text: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Article.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { indexes: [{ unique: true, fields: ["title"] }], sequelize: database }
);

Article.hasOne(User);
Article.hasMany(ArticleView);
Article.belongsToMany(Tag, { through: "ArticleTags" });
