import Order from "../../../db/models/order-model.js";
import User from "../../../db/models/user-model.js";
import Stripe from "stripe";

// * global variables
const currency = "EGP";
const deliveryCharges = 10;

//====================== Placing orders Useing COD Method ======================//
/**
 * * destructuring the request body
 * * creating new order
 * * updating the user cart data
 * * response success message
 */
export const placeOrder = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { userId, items, amount, address } = req.body;

    // * creating new order
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // * updating the user cart data
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // * response success message
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//====================== Placing orders Useing stripe Method ======================//
/**
 * * destructuring the request body
 * * destructuring the request headers
 * * creating new order
 * * create line items
 * * create stripe session
 * * response success message
 */
export const placeOrderStripe = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { userId, items, amount, address } = req.body;
    // * destructuring the request headers
    const { origin } = req.headers;

    // * creating new order
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // * create line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    // * create stripe session
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // * create stripe session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    // * response success message
    res.json({
      success: true,
      message: "Order Placed",
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//====================== verify Stripe ======================//
/**
 *
 */
export const verifyStripe = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { success, orderId, userId } = req.body;

    if (success === "true") {
      // * updating the order payment status
      await Order.findByIdAndUpdate(orderId, { payment: true });
      // * clearing the user cart data
      await User.findByIdAndUpdate(userId, { cartData: {} });
      // * response success message
      res.json({ success: true, message: "Payment Success" });
    } else {
      // * deleting the order
      await Order.findByIdAndDelete(orderId);
      // * response success message
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//====================== Placing orders Useing Razorpay Method ======================//
export const placeOrderRazorpay = async (req, res, next) => {};

//======================= All orders data for Admin panel ========================//
/**
 * * getting all orders
 * * response success message
 */
export const allOrders = async (req, res, next) => {
  try {
    // * getting all orders
    const orders = await Order.find({});

    // * response success message
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//===================== User Order Data For Frontend ======================//
/**
 * * destructuring the request body
 * * getting all orders of the user
 * * response success message
 */
export const userOrders = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { userId } = req.body;

    // * getting all orders of the user
    const orders = await Order.find({ userId });

    // * response success message
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//===================== Update Order Status from admin ======================//
/**
 * * destructuring the request body
 * * updating the order status
 * * response success message
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { orderId, status } = req.body;

    // * updating the order status
    await Order.findByIdAndUpdate(orderId, { status });

    // * response success message
    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
