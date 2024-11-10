import User from "../../../db/models/user-model.js";

//================ add products to user cart =================//
/**
 * * destructuring the request body
 * * check if the user already exists
 * * check if the item already exists in the cart
 * * updating the user cart data
 * * response success message
 */
export const addToCart = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { userId, itemId, size } = req.body;

    // * check if the user already exists
    const userData = await User.findById(userId);

    const cartData = await userData.cartData;

    // * check if the item already exists in the cart
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // * updating the user cart data
    await User.findByIdAndUpdate(userId, { cartData });

    // * response success message
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//=========================== update cart =======================//
/**
 * * destructuring the request body
 * * check if the user already exists
 * * updating the user cart data
 * * response success message
 */
export const updateCart = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { userId, itemId, size, quantity } = req.body;

    // * check if the user already exists
    const userData = await User.findById(userId);
    const cartData = await userData.cartData;

    
    // * updating the user cart data
    cartData[itemId][size] = quantity;

    // * updating the user cart data
    await User.findByIdAndUpdate(userId, { cartData });

    // * response success message
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//=========================== get user cart data =======================//
/**
 * * destructuring the request body
 * * check if the user already exists
 * * response success message
 */
export const getUserCart = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { userId } = req.body;

    // * check if the user already exists
    const userData = await User.findById(userId);
    const cartData = await userData.cartData;

    // * response success message
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};
