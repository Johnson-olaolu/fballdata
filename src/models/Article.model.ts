import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import User from "./User.model";
import ArticleTags from "./ArticleTags.model";
import Tag from "./Tag.model";
import ArticleLike from "./ArticleLike.model";
import ArticleView from "./ArticleViews.model";

@Table
export default class Article extends Model {
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
  declare title: string;

  @Column({
    allowNull: false,
  })
  declare text: string;

  @Column
  declare image: string;

  @Column
  declare imageId: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare authorId: string;

  @BelongsTo(() => User)
  declare author: User;

  @BelongsToMany(() => Tag, () => ArticleTags)
  declare tags: Tag[];

  @HasMany(() => ArticleLike)
  declare articleLikes: ArticleLike[];

  @HasMany(() => ArticleView)
  declare articleViews: ArticleView[];

  @Default(0)
  @Column
  declare viewCount: number;

  @Default(0)
  @Column
  declare likeCount: number;

  @CreatedAt
  declare creationAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletionAt: Date;
}
