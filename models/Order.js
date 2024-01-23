import mongoose from "mongoose";

const schema = mongoose.Schema({
  shippingInfo: {
    //shipping info
    hNo: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
  },

  orderItems: {
    //order items
    cheeseBurger: {
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    vegCheeseBurger: {
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    burgerWithFries: {
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  },

  user: {
    //user
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  paymentMethod: {
    //payment method
    type: String,
    enum: ["COD", "Online"],
    default: "COD",
  },

  paymentInfo: {
    //payment info
    type: mongoose.Schema.ObjectId,
    ref: "Payment",
    required: true,
  },

  paidAt: Date,

  itemsPrice: {
    //sub total
    type: Number,
    default: 0,
  },

  taxPrice: {
    // tax
    type: Number,
    default: 0,
  },
  shippingCharges: {
    //shipping charges
    type: Number,
    default: 0,
  },
  totalAmount: {
    // total amount
    type: Number,
    default: 0,
  },

  orderStatus: {
    // order status
    type: String,
    enum: ["Preparing", "Shipped", "Delivered"],
    default: "Preparing",
  },

  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", schema);
