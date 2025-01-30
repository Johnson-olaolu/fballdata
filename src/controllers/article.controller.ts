import { Request, Response } from "express";
import Article from "../models/Article.model";
import Tag from "../models/Tag.model";
import User from "../models/User.model";
import ArticleView from "../models/ArticleViews.model";

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
      article: article.id,
    });

    article.viewCount = article.viewCount + 1;

    await article.save();

    res.status(201).render("pages/article/view-article", { article, user: req.user });
  };
}

export default new ArticleController();
