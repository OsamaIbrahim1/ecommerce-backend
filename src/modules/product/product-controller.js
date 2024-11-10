import { v2 as cloudinary } from "cloudinary";
import Product from "../../../db/models/product-model.js";
//======================= add product =======================//
/**
 * * destructuring the request body
 * * checking if the request has images
 * * uploading the images to cloudinary
 * * creating the product data
 * * saving the product to the database
 * * response success message
 */
export const addProduct = async (req, res, next) => {
  try {
    // * destructuring the request body
    const {
      name,
      price,
      description,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // * checking if the request has images
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    // * uploading the images to cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      })
    );
    console.log(typeof bestseller);
    console.log(bestseller);
    // * creating the product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(typeof productData.bestseller);
    console.log("productData: ", productData);

    // * saving the product to the database
    const product = new Product(productData);
    console.log(product);
    await product.save();

    // * response success message
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//======================= list products =======================//
/**
 * * finding all products
 * * response success message
 */
export const listProducts = async (req, res, next) => {
  try {
    // * finding all products
    const products = await Product.find();

    // * response success message
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//======================= remove product =======================//
/**
 * * finding the product by id and deleting it
 * * response success message
 */
export const removeProduct = async (req, res, next) => {
  try {
    // * finding the product by id and deleting it
    await Product.findByIdAndDelete(req.body.id);
    // * response success message
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//======================= single product =======================//
/**
 * * destructuring data from body
 * * finding the product by id
 * * response success message
 */
export const singleProduct = async (req, res, next) => {
  try {
    // * destructuring data from body
    const { productId } = req.body;
    // * finding the product by id
    const product = await Product.findById(productId);

    // * response success message
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
