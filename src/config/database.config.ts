// Import the Sequelize module from sequelize-typescript

import { Sequelize } from "sequelize-typescript";
import { DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from ".";
import logger from "./wiston.config";
import path from "path";

// Import the Customer model from the ./models module

// Create a new Sequelize instance with the connection configuration
const database = new Sequelize(DB_NAME || "", DB_USERNAME || "", DB_PASSWORD || "", {
  host: "localhost",
  dialect: "postgres",
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  logging: (msg) => logger.debug(msg),
  models: [path.resolve(__dirname, "../**/*.model.ts")],
});

// Export the connection object as the default module
export default database;
