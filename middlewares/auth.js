import { User } from "../models/User.js";
import ErrorHandler from "../utils/ClassErrorHandler.js";
export const isAuthenticated = (req, res, next) => {
  const token = req.cookies["connect.sid"];
  //   console.log(token);

  if (!token) {
    return next(new ErrorHandler("Not logged In", 401));
  }
  next();
};

// authorize admin here
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Only Admin Allows...", 401));
  }
  next();
};
