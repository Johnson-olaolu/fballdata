import expressAsyncHandler from "express-async-handler";
import Article from "../models/Article.model";
import { AppError } from "../utils/errorHandler";
import { Request, Response } from "express";
import userController from "./user.controller";
import cloudinaryService from "../services/cloudinary.service";
import User from "../models/User.model";
import Tag from "../models/Tag.model";
import { Op } from "sequelize";
import ArticleView from "../models/ArticleViews.model";
import ArticleLike from "../models/ArticleLike.model";
import { getDateRange, parseTag } from "../utils/misc";

class DashboardController {
  public createArticleView = expressAsyncHandler(async (req: Request, res: Response) => {
    res.render("pages/dashboard/create-article", { user: (req as any).user, error: null });
  });

  private async getArticleById(articleId: string) {
    const article = await Article.findOne({
      where: { id: articleId },
      include: [
        {
          model: Tag,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });
    if (!article) {
      throw new AppError("Article not found");
    }
    return article;
  }

  public createArticle = expressAsyncHandler(async (req: Request, res: Response) => {
    const { text, title, userId, tagNames } = req.body;
    try {
      const user = await userController.getUserById(userId);

      const article = Article.build({
        text,
        title,
      });

      const articleImage = req.file;

      if (articleImage) {
        const articleImageDetails = await cloudinaryService.upload(articleImage);
        article.image = articleImageDetails.url;
        article.imageId = articleImageDetails.public_id;
        console.log(articleImageDetails);
      }

      article.authorId = user.id;

      const tags = [];
      for (const tagName of (tagNames as string).split(",")) {
        const tag = await Tag.findOrCreate({ where: { name: parseTag(tagName) } });
        tags.push(tag[0]);
      }

      await article.save();

      article.$set("tags", tags);

      await article.save();

      res.redirect(`/dashboard/view-article/${article.id}?success=Article Created successfully`);
    } catch (error) {
      console.log(error);
      res.status(500).render("pages/dashboard/create-article", { user: (req as any).user, error: "An error occured please try again" });
    }
  });

  public viewArticleView = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;
    const success = req.query.success;

    const article = await this.getArticleById(articleId);

    if (!article) {
      //TODO Show no article found error
      res.render("pages/dashboard/view-article", { article, user: (req as any).user, success: success || null });
    }

    res.render("pages/dashboard/view-article", { article, user: (req as any).user, success: success || null });
  };

  public editArticleView = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    const article = await this.getArticleById(articleId);

    if (!article) {
      //TODO Show no article found error
      res.render("pages/dashboard/edit-article", { article, user: (req as any).user, error: null, success: null });
    }

    res.render("pages/dashboard/edit-article", { article, user: (req as any).user, error: null, success: null });
  };

  public updateArticle = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;
    const { text, title, tagNames } = req.body;
    let article = await this.getArticleById(articleId);

    try {
      const articleImage = req.file;

      if (articleImage) {
        const articleImageDetails = await cloudinaryService.upload(articleImage);
        article.image = articleImageDetails.url;
        article.imageId = articleImageDetails.public_id;
        console.log(articleImageDetails);
      }
      article.text = text;
      article.title = title;

      const tags = [];
      for (const tagName of (tagNames as string).split(",")) {
        const tag = await Tag.findOrCreate({ where: { name: parseTag(tagName) } });
        tags.push(tag[0]);
      }
      article.$set("tags", tags);

      await article.save();

      article = await this.getArticleById(articleId);

      res
        .status(201)
        .render("pages/dashboard/edit-article", { article, user: (req as any).user, success: "Article updated successfully", error: null });
    } catch (error) {
      res
        .status(500)
        .render("pages/dashboard/edit-article", { article, user: (req as any).user, success: null, error: "An error occured please try again" });
    }
  };

  public deleteArticle = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    await Article.destroy({ where: { id: articleId } });

    res.redirect("/dashboard/home");
  };

  public getDashboardData = async (req: Request, res: Response) => {
    const { timeQuery } = req.query;
    // ["1week", "2weeks", "1month", "6months", "1year", "all"]
    const views = await ArticleView.findAll({
      where: {
        createdAt: getDateRange(timeQuery as string),
      },
      include: [
        {
          model: Article,
          where: { authorId: (req.user as any).id },
          attributes: ["id", "title"],
        },
      ],
    });

    const likes = await ArticleLike.findAll({
      where: {
        createdAt: {
          [Op.gte]: getDateRange(timeQuery as string),
        },
      },
      include: [
        {
          model: Article,
          where: { authorId: (req.user as any).id },
          attributes: ["id", "title"],
        },
      ],
    });

    res.status(200).json({
      data: {
        views,
        likes,
      },
      message: "Dashboard data fetched successfully",
      success: true,
    });
  };

  public getArticles = expressAsyncHandler(async (req: Request, res: Response) => {
    const articles = await Article.findAll({ include: [User] });
    res.status(200).json({
      data: articles,
      message: "Articles fetched succcessfully",
      status: true,
    });
  });

  public queryArticle = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId, search, orderBy, sortBy, limit, page } = req.query;

    // Build the where clause
    const whereClause: any = {};

    if (userId) {
      whereClause.authorId = userId;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } }, // Title matches search
        { "$author.fullName$": { [Op.iLike]: `%${search}%` } }, // Author's fullName matches search
        { "$tags.name$": { [Op.iLike]: `%${search}%` } }, // Tag's name matches search
      ];
    }

    const data = await Article.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User, // Include the author details
          as: "author", // Alias for the association
          attributes: ["id", "fullName", "email"], // Select specific fields
        },
        {
          model: Tag, // Include the tags
          as: "tags", // Alias for the association
          attributes: ["id", "name"], // Select specific fields
          through: { attributes: [] }, // Exclude the join table (ArticleTags) fields
        },
      ],
      distinct: true,
      limit: (limit as any) || 10,
      offset: page ? parseInt(page as any) - 1 : 0,
      subQuery: false,
    });

    res.status(200).json({
      data: data,
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
}

export default new DashboardController();
