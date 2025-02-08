import { connect } from "mongoose";
import { config } from "dotenv";

config();

const { MONGO_URL, MONGO_URL_LOCAL, DB_NAME } = process.env;

export const connectDB = async () => {
  try {
    const connection = await connect(`${MONGO_URL_LOCAL}/${DB_NAME}`);
    console.log(`Mongo connected successfull: ${connection.connection.host}`);
  } catch (err) {
    console.log(`Mongo Error: ${err}`);
    process.exit(1);
  }
};
