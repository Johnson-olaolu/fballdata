import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Article from "./Article.model";
import Tag from "./Tag.model";

@Table
export default class ArticleTags extends Model {
  @ForeignKey(() => Article)
  @Column(DataType.UUID)
  declare articleId: string;

  @ForeignKey(() => Tag)
  @Column(DataType.UUID)
  declare tagId: string;
}
