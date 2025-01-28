import { Request, Response } from "express";

class IndexController {
  public getName = (req: Request, res: Response) => {
    res.render("pages/index", { user: req.user });
  };
}

export default new IndexController();
