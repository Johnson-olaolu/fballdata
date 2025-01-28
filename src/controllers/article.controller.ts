import expressAsyncHandler from "express-async-handler";
import Article from "../models/Article.model";
import { AppError } from "../utils/errorHandler";
import { Request, Response } from "express";
import { CreateArticleDto } from "../dto/create-article.dto";
import userController from "./user.controller";
import cloudinaryService from "../services/cloudinary.service";
import User from "../models/User.model";
import { QueryArticleDto } from "../dto/query-article.dto";
import Tag from "../models/Tag.model";
import { Op } from "sequelize";
import { UpdateArticleDto } from "../dto/update-article.dto";
import ArticleView from "../models/ArticleViews.model";
import ArticleLike from "../models/ArticleLike.model";

class ArticleController {
  public createArticleView = expressAsyncHandler(async (req: Request, res: Response) => {
    res.render("pages/dashboard/create-article", { user: (req as any).user });
  });

  private async getArticleById(articleId: string) {
    const article = await Article.findOne({ where: { id: articleId } });
    if (!article) {
      throw new AppError("Article not found");
    }
    return article;
  }

  public createArticle = expressAsyncHandler(async (req: Request<{}, {}, CreateArticleDto>, res: Response) => {
    const { text, title, userId, tagNames } = req.body;

    const user = await userController.getUserById(userId);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const article = Article.build({
      text,
      title,
    });

    const articleImage = files.articleImage?.[0];

    if (articleImage) {
      const articleImageDetails = await cloudinaryService.upload(articleImage);
      article.image = articleImageDetails.url;
      article.imageId = articleImageDetails.public_id;
    }

    article.authorId = user.id;

    const tags = [];
    for (const tagName of tagNames) {
      const tag = await Tag.findOrCreate({ where: { name: tagName } });
      tags.push(tag[0]);
    }
    article.$set("tags", tags);

    await article.save();

    res.status(201).json({
      data: article,
      message: "Article created succcessfully",
      status: true,
    });
  });

  public getArticles = expressAsyncHandler(async (req: Request, res: Response) => {
    const articles = await Article.findAll({ include: [User] });
    res.status(200).json({
      data: articles,
      message: "Articles fetched succcessfully",
      status: true,
    });
  });

  public queryArticle = expressAsyncHandler(async (req: Request<{}, QueryArticleDto, {}>, res: Response) => {
    const { userId, title, tagNames, orderBy, sortBy } = req.query as QueryArticleDto;

    // Build the where clause
    const whereClause: any = {};

    if (userId) {
      whereClause.authorId = userId; // Filter by user ID
    }

    if (title) {
      whereClause.title = {
        [Op.iLike]: `%${title}%`, // Case-insensitive title search
      };
    }

    // Build the include clause for tags
    const includeClause = [];
    if (tagNames && tagNames.length > 0) {
      includeClause.push({
        model: Tag,
        where: {
          name: {
            [Op.in]: tagNames, // Filter by tag names
          },
        },
        required: true, // Ensures only articles with these tags are returned
      });
    }

    // Determine sorting
    const order: any[] = [];
    if (sortBy) {
      if (sortBy === "tagName") {
        includeClause.push({
          model: Tag,
          attributes: [], // Exclude tag fields from being fetched
        });
        order.push([{ model: Tag, as: "tags" }, "name", orderBy ?? "ASC"]);
      } else {
        order.push([sortBy, orderBy ?? "ASC"]); // Sort by Article fields
      }
    }

    // Fetch articles
    const articles = await Article.findAll({
      where: whereClause,
      include: includeClause,
      order,
    });

    res.status(200).json({
      data: articles,
      message: "Articles queried successfully",
      success: true,
    });
  });

  public getArticlesByUser = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId;

    const articles = await Article.findAll({ where: { authorId: userId } });

    res.status(200).json({
      data: articles,
      message: "Articles queried successfully",
      success: true,
    });
  });

  public getSingleArticle = expressAsyncHandler(async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    const article = this.getArticleById(articleId);

    res.status(200).json({
      data: article,
      message: "Article fetched successfully",
      success: true,
    });
  });

  public updateArticles = expressAsyncHandler(async (req: Request<any, {}, UpdateArticleDto>, res: Response) => {
    const articleId = req.params.articleId;
    const { text, title, tagNames } = req.body;

    const article = await this.getArticleById(articleId);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const articleImage = files.articleImage?.[0];

    if (articleImage) {
      if (article.imageId) {
        await cloudinaryService.delete(article.imageId);
      }
      const articleImageDetails = await cloudinaryService.upload(articleImage);
      article.image = articleImageDetails.url;
      article.imageId = articleImageDetails.public_id;
    }

    article.text = text;
    article.title = title;

    const tags = [];
    for (const tagName of tagNames) {
      const tag = await Tag.findOrCreate({ where: { name: tagName } });
      tags.push(tag[0]);
    }
    article.$set("tags", tags);

    await article.save();

    res.status(200).json({
      data: article,
      message: "Article updated successfully",
      success: true,
    });
  });

  public viewArticle = expressAsyncHandler(async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    const article = await this.getArticleById(articleId);

    ArticleView.create({
      article: article.id,
    });

    article.viewCount = article.viewCount + 1;

    res.status(200).json({
      data: article,
      message: "Article updated successfully",
      success: true,
    });
  });

  public likeArticle = expressAsyncHandler(async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    const article = await this.getArticleById(articleId);

    ArticleLike.create({
      article: article.id,
    });

    article.likeCount = article.likeCount + 1;

    res.status(200).json({
      data: article,
      message: "Article updated successfully",
      success: true,
    });
  });

  public deleteArticle = expressAsyncHandler(async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    await Article.destroy({ where: { id: articleId } });

    res.status(200).json({
      message: "Article deleted successfully",
      success: true,
    });
  });
}

export default new ArticleController();
