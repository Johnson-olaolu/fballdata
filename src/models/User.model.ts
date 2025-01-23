import { Column, CreatedAt, DataType, Default, DeletedAt, HasMany, Index, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { RoleEnum } from "../utils/constants";
import { Article } from "./Article.model";

@Table
export class User extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @Column({
    allowNull: false,
  })
  declare fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @Index
  declare userName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @Index
  declare email: string;

  @Column({
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(RoleEnum)),
    allowNull: false,
  })
  @Default(RoleEnum.USER)
  declare role: RoleEnum;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @Default(false)
  declare isVerified: boolean;

  @Column
  declare profilePicture: string;

  @Column
  declare bannerPicture: string;

  @Column
  declare verifyEmailToken: string;

  @Column
  declare verifyEmailTokenTTL: string;

  @Column
  declare chnagePasswordToken: string;

  @Column
  declare chnagePasswordTokenTTL: string;

  @HasMany(() => Article)
  declare articles: Article[];

  @CreatedAt
  declare creationAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletionAt: Date;
}
