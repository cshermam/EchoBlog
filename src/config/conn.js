import "dotenv/config";
import { Sequelize } from "sequelize";

const conn = new Sequelize( "postagens", "root", "Sen@iDev77!.", {
    host: process.env.MYSQL_HOST,
    dialect: "mysql"
});

const authenticateDB = async () => {
    try {
        await conn.authenticate();
        console.log("Connection to MYSQL successful");
    } catch (error) {
        console.error("Error: ", error);
    }
};

authenticateDB();

export default conn;