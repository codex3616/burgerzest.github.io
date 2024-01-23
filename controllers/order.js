import { asyncError } from "../middlewares/errorMiddleware.js";
import { Order } from "../models/Order.js";
import ErrorHandler from "../utils/ClassErrorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";

export const placeOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id; // getting user id ...

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  await Order.create(orderOptions);

  res.status(201).json({
    success: true,
    message: "Order Placed Successfully via Cash On Delivery",
  });
});

export const placeOrderOnline = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id; // getting user id ...

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };
  const options = {
    amount: Number(totalAmount) * 100, // as this amount is in pesa not rupee
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    order,
    orderOptions,
  });
});

// after payment vereification order details and payment details is stored in db...
export const paymentVerification = asyncError(async (req, res, next) => {
  const {
    razorpay_payment_id, // auto get
    razorpay_order_id, // auto get
    razorpay_signature, // auto get
    orderOptions, //mannually puted to get...
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature; //payment sucess
  if (isAuthentic) {
    const payment = await Payment.create({
      // storing payment info
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await Order.create({
      // storing order,payment details in db
      ...orderOptions,
      paidAt: new Date(Date.now()),
      paymentInfo: payment._id,
    });

    res.status(201).json({
      success: true,
      message: `Order Placed Successfully via Online... , Payment_ID : ${payment._id}`,
    });
  } else {
    return next(new ErrorHandler("Payment Failed...", 400));
  }
});

export const getMyOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("user", "name");

  res.status(200).json({
    success: true,
    orders,
  });
});

export const getOrderDetails = asyncError(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Invalid Order Id", 404));

    res.status(200).json({
      success: true,
      order,
    });
  } catch {
    return next(new ErrorHandler("Invalid Order Id", 404));
  }
});

export const getAdminOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "name");

  res.status(200).json({
    success: true,
    orders,
  });
});

export const processOrders = asyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name");
  if (!order) return next(new ErrorHandler("Invalid Order Id", 404));

  if (order.orderStatus === "Preparing") {
    console.log("runs");
    order.orderStatus = "Shipped";
  } else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date(Date.now());
  } else if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Food Already Delivered...", 400));
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Status Updated Successfully...",
  });
});
