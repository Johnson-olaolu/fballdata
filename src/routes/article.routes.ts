import { Router } from "express";
import articleController from "../controllers/article.controller";

const articleRouter = Router();

// Public routes
articleRouter.get("/query", articleController.queryArticle);
articleRouter.get("/:articleId", articleController.viewArticleView);
articleRouter.post("/:articleId/like", articleController.likeArticle);

export default articleRouter;
