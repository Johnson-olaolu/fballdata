import { Op } from "sequelize";

export const getDateRange = (range: string) => {
  const now = new Date();
  switch (range) {
    case "1week":
      return { [Op.gte]: new Date(now.setDate(now.getDate() - 7)) };
    case "2weeks":
      return { [Op.gte]: new Date(now.setDate(now.getDate() - 14)) };
    case "1month":
      return { [Op.gte]: new Date(now.setMonth(now.getMonth() - 1)) };
    case "6months":
      return { [Op.gte]: new Date(now.setMonth(now.getMonth() - 6)) };
    case "1year":
      return { [Op.gte]: new Date(now.setFullYear(now.getFullYear() - 1)) };
    case "all":
      return {}; // No date filter for all time
    default:
      throw new Error("Invalid date range");
  }
};

export function parseTag(str: string) {
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
