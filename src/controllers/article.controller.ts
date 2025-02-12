import { Request, Response } from "express";
import Article from "../models/Article.model";
import Tag from "../models/Tag.model";
import User from "../models/User.model";
import ArticleView from "../models/ArticleViews.model";
import ArticleLike from "../models/ArticleLike.model";
import { Op } from "sequelize";

class ArticleController {
  public viewArticleView = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    const article = await Article.findOne({
      where: { id: articleId },
      include: [
        {
          model: Tag,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
        {
          model: User, // Include the author details
          as: "author", // Alias for the association
          attributes: ["id", "fullName", "email"], // Select specific fields
        },
      ],
    });

    if (!article) {
      return;
    }
    ArticleView.create({
      articleId: article.id,
    });

    article.viewCount = article.viewCount + 1;

    await article.save();

    res.status(201).render("pages/article/view-article", { article, user: req.user });
  };

  public likeArticle = async (req: Request, res: Response) => {
    const articleId = req.params.articleId;

    const article = await Article.findOne({ where: { id: articleId } });

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    ArticleLike.create({
      articleId: article.id,
    });

    article.likeCount = article.likeCount + 1;

    await article.save();

    res.status(200).json({
      data: article,
      message: "Article updated successfully",
      success: true,
    });
  };

  public queryArticle = async (req: Request, res: Response) => {
    const { search } = req.query;

    // Build the where clause
    const whereClause: any = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } }, // Title matches search
        { "$author.fullName$": { [Op.iLike]: `%${search}%` } }, // Author's fullName matches search
        { "$tags.name$": { [Op.iLike]: `%${search}%` } }, // Tag's name matches search
      ];
    }

    const data = await Article.findAll({
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
    });

    res.status(200).json({
      data,
      message: " Artcicles fetched successfully",
      success: true,
    });
  };
}

export default new ArticleController();
