// Import the Sequelize module from sequelize-typescript

import { Sequelize } from "sequelize-typescript";
import { DB_CA_CERTIFICATE, DB_DIALECT, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_SSL_MODE, DB_USERNAME } from ".";
import logger from "./wiston.config";
import path from "path";
import { Dialect } from "sequelize";

// Import the Customer model from the ./models module

// Create a new Sequelize instance with the connection configuration
const database = new Sequelize(DB_NAME || "", DB_USERNAME || "", DB_PASSWORD || "", {
  host: DB_HOST,
  database: DB_NAME,
  dialect: (DB_DIALECT as Dialect) || "postgres",
  password: DB_PASSWORD,
  port: DB_PORT ? parseInt(DB_PORT) : 5432,
  dialectOptions:
    DB_SSL_MODE === "require"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
            ca: DB_CA_CERTIFICATE,
          },
        }
      : {},
  logging: (msg) => logger.debug(msg),
  models: [path.resolve(__dirname, "../**/*.model.{ts,js}")],
});

// Export the connection object as the default module
export default database;
