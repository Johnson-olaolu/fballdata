import { Router } from "express";
import articleController from "../controllers/article.controller";

const articleRouter = Router();

// Public routes
articleRouter.get("/:articleId", articleController.viewArticleView);

export default articleRouter;
