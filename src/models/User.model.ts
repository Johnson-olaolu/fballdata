import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import { RoleEnum } from "../utils/constants";
import Article from "./Article.model";
import bcrypt from "bcryptjs";

@Table
export default class User extends Model {
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
  declare email: string;

  @Column({
    allowNull: false,
  })
  declare password: string;

  @Default(RoleEnum.USER)
  @Column({
    type: DataType.ENUM(...Object.values(RoleEnum)),
    allowNull: false,
  })
  declare role: RoleEnum;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isVerified: boolean;

  @HasMany(() => Article)
  declare articles: Article[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletedAt: Date;

  // Instance method to compare passwords
  async comparePassword(plainPassword: string): Promise<boolean> {
    const ismatch = await bcrypt.compare(plainPassword, this.password);
    return ismatch;
  }

  // Hook to hash the password before saving
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    // user.password = await bcrypt.hash(user.password, 10);
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
}
