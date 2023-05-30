import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export const dbConnection = async () => {
  const url = process.env.MONGODB_URL;
  try {
    await mongoose.connect(url);
    console.log("MONGODB CONNECTED SUCCESSFULLY!....");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
