import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
const connectDB = async () => {
  const { connection } = await mongoose.connect(uri);
  console.log(`Database is connected with ${connection.host} `);
};

// mongoose
//   .connect(uri)
//   .then(() => {
//     console.log("connection created...");
//   })
//   .catch((err) => {
//     console.log(`error = ${err}`);
//   });

export default connectDB;
