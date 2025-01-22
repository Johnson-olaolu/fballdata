// Import the Sequelize module from sequelize-typescript

import { Sequelize } from "sequelize";
import { DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from ".";
import logger from "./wiston.config";

// Import the Customer model from the ./models module

// Create a new Sequelize instance with the connection configuration
const database = new Sequelize(DB_NAME || "", DB_USERNAME || "", DB_PASSWORD || "", {
  host: "localhost",
  dialect: "postgres",
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  logging: (msg) => logger.debug(msg),
});

export const initDatabase = async () => {
  console.log({ DB_NAME, DB_USERNAME, DB_PASSWORD });
  await database.sync({ force: true, alter: true });
  console.log("Database loaded");
};

// Export the connection object as the default module
export default database;
