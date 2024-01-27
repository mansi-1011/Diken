import mysql from "mysql";
import "dotenv/config";

var connection = mysql.createConnection({
  host: `${process.env.DATABSE_HOST}`,
  user: `${process.env.DATABASE_USERNAME}`,
  password: "",
  database: `${process.env.DATABASE_NAME}`,
});
connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Database Connected Successfully..!!");
  }
});

import util from "util";
const queryAsync = util.promisify(connection.query).bind(connection);

export default queryAsync;
