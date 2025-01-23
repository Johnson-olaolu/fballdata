import { BelongsToMany, Column, CreatedAt, DataType, Default, DeletedAt, Index, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import Article from "./Article.model";
import ArticleTags from "./ArticleTags.model";

@Table
export default class Tag extends Model {
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
  @Index
  declare name: string;

  @BelongsToMany(() => Article, () => ArticleTags)
  declare articles: Article[];

  @CreatedAt
  declare creationAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletionAt: Date;
}
