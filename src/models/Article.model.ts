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
import { User } from "./User.model";
import { Tag } from "./Tag.model";
import { ArticleLikes } from "./ArticleLikes.model";
import { ArticleView } from "./ArticleViews.model";

@Table
export class Article extends Model {
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

  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsToMany(() => Tag, () => ArticleTags)
  declare tags: Tag[];

  @HasMany(() => ArticleLikes)
  declare articleLikes: ArticleLikes[];

  @HasMany(() => ArticleView)
  declare articleViews: ArticleView[];

  @Column
  @Default(0)
  declare viewCount: number;

  @Column
  @Default(0)
  declare likeCount: number;

  @CreatedAt
  declare creationAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  declare deletionAt: Date;
}

@Table
export class ArticleTags extends Model {
  @ForeignKey(() => Article)
  @Column
  declare articleId: string;

  @ForeignKey(() => Tag)
  @Column
  declare tagId: string;
}
