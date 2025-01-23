import { Article, ArticleTags } from "./Article.model";
import { BelongsToMany, Column, CreatedAt, DataType, Default, DeletedAt, Index, Model, PrimaryKey, UpdatedAt } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

export class Tag extends Model {
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
