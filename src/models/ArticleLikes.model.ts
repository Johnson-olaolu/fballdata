import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, UpdatedAt } from "sequelize-typescript";
import { Article } from "./Article.model";
import { v4 as uuidv4 } from "uuid";
import { ArticleView } from "./ArticleViews.model";

export class ArticleLikes extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => Article)
  @Column
  declare articleId: string;

  @BelongsTo(() => Article)
  declare article: Article;

  @CreatedAt
  declare creationAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletionAt: Date;
}
