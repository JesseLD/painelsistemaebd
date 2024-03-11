import { Sequelize } from "sequelize";
import { config } from "./config";
export const sequelize = new Sequelize(
  config.database,
  config.db_user,
  config.db_password,
  {
    dialect: "mysql",
    port: parseInt(config.db_port),
    dialectModule: require('mysql2'),
    host: config.host,
  },
);
