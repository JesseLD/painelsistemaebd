export const config = {
  database: process.env.SEQUELIZE_DB_NAME || "yourdb",
  host: process.env.SEQUELIZE_DB_HOST || "localhost",
  db_user: process.env.SEQUELIZE_DB_USER || "root",
  db_password: process.env.SEQUELIZE_DB_PASSWORD || "",
  db_port: process.env.SEQUELIZE_DB_PORT || "3306",
  api_key: process.env.API_KEY || "morango10"
};
