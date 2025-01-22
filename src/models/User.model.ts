import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { RoleEnum } from "../utils/constants";
import database from "../config/database.config";
import { Article } from "./Article.model";

// order of InferAttributes & InferCreationAttributes is important.
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<string>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare userName: string;
  declare password: string;
  declare role: RoleEnum;
  declare isVerified: boolean;
  declare profilePicture: string | null;
  declare verifyEmailToken: string | null;
  declare verifyEmailTokenTTL: Date | null;
  declare changePasswordToken: string | null;
  declare changePasswordTokenTTL: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM,
      defaultValue: RoleEnum.USER,
    },
    isVerified: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    verifyEmailToken: {
      type: DataTypes.STRING,
    },
    verifyEmailTokenTTL: {
      type: DataTypes.DATE,
    },
    changePasswordToken: {
      type: DataTypes.STRING,
    },
    changePasswordTokenTTL: {
      type: DataTypes.DATE,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["userName"] },
    ],
    sequelize: database,
  }
);

User.hasMany(Article);
