import { Request, Response } from "express";
import Article from "../models/Article.model";
import User from "../models/User.model";
import Tag from "../models/Tag.model";

class IndexController {
  public getHome = async (req: Request, res: Response) => {
    const { page } = req.query;
    const { count, rows } = await Article.findAndCountAll({
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
      limit: 12,
      offset: page ? parseInt(page as any) - 1 : 0,
    });
    const pages = Math.ceil(count / 12) || 1;
    res.render("pages/index", { user: req.user, page: page || 1, pages: pages, articles: rows });
  };
}

export default new IndexController();
