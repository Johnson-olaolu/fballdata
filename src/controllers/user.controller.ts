import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.model";
import cloudinaryService from "../services/cloudinary.service";
import { AppError } from "../utils/errorHandler";
import { getDateRange } from "../utils/misc";
import ArticleView from "../models/ArticleViews.model";
import Article from "../models/Article.model";
import ArticleLike from "../models/ArticleLike.model";

class UserController {
  public getUserById = async (id: string) => {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new AppError(" user not found");
    }
    return user;
  };

  // public updateUser = expressAsyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.params.userId;
  //   const { username, bio } = req.body;

  //   const user = await this.getUserById(userId);

  //   const files = req.files as {
  //     [fieldname: string]: Express.Multer.File[];
  //   };

  //   const profilePicture = files.profilePicture?.[0];
  //   if (profilePicture) {
  //     if (user.profilePictureId) {
  //       await cloudinaryService.delete(user.profilePictureId);
  //     }
  //     const profileDetails = await cloudinaryService.upload(profilePicture);
  //     user.profilePicture = profileDetails.url;
  //     user.profilePictureId = profileDetails.public_id;
  //   }

  //   const bannerPicture = files.bannerPicture?.[0];
  //   if (bannerPicture) {
  //     if (user.bannerPictureId) {
  //       await cloudinaryService.delete(user.bannerPictureId);
  //     }
  //     const bannerDetails = await cloudinaryService.upload(profilePicture);
  //     user.bannerPicture = bannerDetails.url;
  //     user.bannerPictureId = bannerDetails.public_id;
  //   }

  //   user.bio = bio;

  //   await user.save();

  //   res.status(201).json({
  //     data: user,
  //     message: "User updated sucessfully",
  //     success: true,
  //   });
  // });

  public getUserData = expressAsyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user as User;
    const data = await this.getUserById(user.id);
    res.status(201).json({
      success: true,
      message: "User fetched successfully",
      data,
    });
  });

  public getUserViews = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { range } = req.query;
    const dateFilter = getDateRange((range as string) || "");

    const views = await ArticleView.findAll({
      where: {
        createdAt: dateFilter, // Filter views by date
      },
      include: [
        {
          model: Article,
          where: {
            authorId: userId, // Filter articles by authorId
          },
        },
      ],
    });

    res.status(201).json({
      data: views,
      message: "user views fetched successfully",
      success: true,
    });
  });

  public getUserLikes = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { range } = req.query;
    const dateFilter = getDateRange((range as string) || "");

    const likes = await ArticleLike.findAll({
      where: {
        createdAt: dateFilter, // Filter views by date
      },
      include: [
        {
          model: Article,
          where: {
            authorId: userId, // Filter articles by authorId
          },
        },
      ],
    });

    res.status(201).json({
      data: likes,
      message: "user likes fetched successfully",
      success: true,
    });
  });
}

export default new UserController();
