import mongoose from "mongoose"
export const connectDb = async (dbUrl:string) => {
  try {
    await mongoose
      .connect(dbUrl, { dbName: "ChatApp" })
      .then((data) => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.log("here");

        throw error;
      });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};