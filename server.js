import app from "./app.js";
import connectDB from "./config/database.js";
const port = process.env.PORT || 4000;
import Razorpay from "razorpay";

connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.get("/", (req, res) => {
  res.send("working..");
});

app.listen(port, () => {
  console.log(
    `server is working on PORT: ${port}, in ${process.env.NODE_ENV} MODE`
  );
});
