require("dotenv").config("../.env");
module.exports = {
  host: process.env.DEV_DB_HOST,
  dialect: process.env.DEV_DB_DIALECT,
  username: process.env.DEV_DB_USER,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_DATABASE_NAME,
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamp: false,
    underscored: true,
  },
  dialectOptions: {
    bigNumberStrings: true,
    // it must be decomment for production's mode
    // ssl: {
    //   ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
    // },
  },
};
