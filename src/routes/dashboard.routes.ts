import { Router } from "express";
import userController from "../controllers/user.controller";
import dashboardController from "../controllers/dashboard.controller";
import upload from "../config/multer.config";

const dashboardRouter = Router();

dashboardRouter.get("/home", userController.homeView);
dashboardRouter.get("/create-article", dashboardController.createArticleView);
dashboardRouter.post("/create-article", upload.single("articleImage"), dashboardController.createArticle);
dashboardRouter.get("/edit-article/:articleId", dashboardController.editArticleView);
dashboardRouter.post("/edit-article/:articleId", upload.single("articleImage"), dashboardController.updateArticle);
dashboardRouter.get("/view-article/:articleId", dashboardController.viewArticleView);
dashboardRouter.get("/delete-article/:articleId", dashboardController.deleteArticle);
dashboardRouter.get("/dashboard-data", dashboardController.getDashboardData);

export default dashboardRouter;
