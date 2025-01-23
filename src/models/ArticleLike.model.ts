import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import Article from "./Article.model";

@Table
export default class ArticleLike extends Model {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => Article)
  @Column(DataType.UUID)
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
