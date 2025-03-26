import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      // `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
      `${process.env.MONGODB_URI}`
    );

    // const connectionInstance = await mongoose.connect(
    //   `mongodb://localhost:27017/mydb`
    // );
    console.log(
      `\n MongoDB connected on host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongo connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDatabase;
