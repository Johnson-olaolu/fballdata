import { Router } from "express";
import userController from "../controllers/user.controller";
import articleController from "../controllers/article.controller";

const dashboardRouter = Router();

dashboardRouter.get("/home", userController.homeView);
dashboardRouter.get("/create-article", articleController.createArticleView);
dashboardRouter.post("/create-article", articleController.createArticle);

export default dashboardRouter;
