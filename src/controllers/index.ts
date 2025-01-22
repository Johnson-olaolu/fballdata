import { Request, Response } from "express";

class IndexController {
  public getName = (req: Request, res: Response) => {
    var mascots = [
      { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
      { name: "Tux", organization: "Linux", birth_year: 1996 },
      { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
    ];
    var tagline = "No programming concept is complete without a cute animal mascot.";

    res.render("pages/index", {
      mascots: mascots,
      tagline: tagline,
    });
  };
}

export default new IndexController();
