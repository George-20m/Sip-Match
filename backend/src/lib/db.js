import mangoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mangoose.connect(process.env.MONGO_URI);
    console.log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};