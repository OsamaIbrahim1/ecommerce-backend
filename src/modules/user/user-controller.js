import User from "./../../../db/models/user-model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const createToken = (id) => {
  const ID = id.toString();

  return jwt.sign({ ID }, process.env.JWT_SECRET);
};

//================================ register user ==============================//
/**
 * * destructuring the request body
 * * check if the user already exists
 * * validating email format & strong password
 * * hash password
 * * create a new user
 * * save the user
 * * create a token
 */
export const registerUser = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { name, email, password } = req.body;

    // * check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // * validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter a strong password",
      });
    }

    // * hash password
    const hashedPassword = bcryptjs.hashSync(
      password,
      +process.env.SALT_ROUNDS
    );

    // * create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // * create a token
    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//================================ login user ==============================//
/**
 * * destructuring the request body
 * * check if the user already exists
 * * check if password is correct
 * * create a token
 * * return response
 */
export const loginUser = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { email, password } = req.body;

    // * check if the user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // * check if password is correct
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (isMatch) {
      // * create a token
      const token = createToken(user._id);

      // * return response
      res.status(200).json({
        success: true,
        message: "User logedIn successfully",
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//================================ login Admin ==============================//
/**
 * * destructuring the request body
 * * create a token
 * * return response
 */
export const loginAdmin = async (req, res, next) => {
  try {
    // * destructuring the request body
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // * create a token
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      // * return response
      res
        .status(200)
        .json({ success: true, message: "Admin logedIn successfully", token });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
