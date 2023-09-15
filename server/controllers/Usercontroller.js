// import { Products, User } from "../connection/conn.js"
import mongoose from "mongoose";
import CartItem  from "../model/Cart.js";

export const userData = async (req, res) => {
  const { username, password } = req.body;
  try {
    const User = mongoose.connection.collection('user');
    const data = await User.findOne({ username });

    if (data) {
      if (data.password === password) {
        // Reset the session when a new user logs in
        req.session.regenerate((err) => {
          if (err) {
            return res.status(500).json({ error: 'Session reset error' });
          }

          // Initialize the new user's session
          req.session.user = {
            id: data._id,
            username: data.username,
            selectedProducts: [], // Initialize the selectedProducts array
          };

          // Send the session cookie to the client
          res.cookie('sessionId', req.session.user, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // Session expiration time (e.g., 1 week)
            httpOnly: true,
          });

          return res.status(201).json("Login successful");
        });
      } else {
        return res.status(401).json("Wrong password"); // Use 401 Unauthorized status code
      }
    } else {
      // User with the provided username doesn't exist
      return res.status(401).json({ message: "Wrong email" }); // Use 401 Unauthorized status code
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

  // get products 
  export const getProducts = async (req, res) => {
    try {
      // Get page number and page size from query parameters
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
      const pageSize = parseInt(req.query.pageSize) || 2; // Default to 2 documents per page
  
      // Calculate skip value based on page number and page size
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination
      const data = await mongoose.connection.collection('products');
      const products = await data
        .find({})
        .skip(skip)
        .limit(pageSize)
        .toArray();
  
      res.json({ page, pageSize, products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


// 
export const addProductToSession = async (req, res) => {
  // Retrieve the productId from the URL parameters
  const { productId } = req.body;

  // Check if the user is authenticated and if their session data is initialized
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.session.user.id; // Get the user's ID from the session

  try {
    // Check if the product is already in the user's cart
    let cartItem = await CartItem.findOne({ userId, productId });

    if (cartItem) {
      // If the product is already in the cart, increment the quantity
      cartItem.quantity += 1;
    } else {
      // If the product is not in the cart, create a new cart item
      cartItem = new CartItem({
        productId,
        userId,
        quantity: 1, // You can set an initial quantity here
      });
    }

    // Save the cart item to the database
    await cartItem.save();

    // Add the selected product ID to the user's selectedProducts array in the session
    req.session.user.selectedProducts.push(productId);

    return res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ error: 'Error adding product to cart' });
  }
};


export const getSelectedProductsFromSession = async (req, res) =>  {
  // Check if the user is authenticated and if their session data is initialized
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Retrieve the user's ID from the session
  const userId = req.session.user.id;

  try {
    // Query the database to retrieve selected products associated with the user's ID
    const selectedProducts = await CartItem.find({ userId });

    // Extract the product IDs from the selectedProducts
    const productIdsWithQuantity = selectedProducts.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const productIds = productIdsWithQuantity.map((item) => item.productId);

    // Retrieve the product details based on the product IDs
    const data = await mongoose.connection.collection('products');
    const products = await data.find({ _id: { $in: productIds } }).toArray();

    // Combine product details with quantity
    const selectedProductsWithQuantity = products.map((product) => {
      const cartItem = productIdsWithQuantity.find((item) =>
        item.productId.equals(product._id)
      );
      return {
        ...product,
        quantity: cartItem ? cartItem.quantity : 0, // Default to 0 if not found
      };
    });

    return res.json({ selectedProducts: selectedProductsWithQuantity, m: "yes working" });
  } catch (error) {
    console.error('Error retrieving selected products:', error);
    return res.status(500).json({ error: 'Error retrieving selected products' });
  }
};



export const removeProductFromSession = async (req, res) => {
  const { productId } = req.body;

  // Check if the user is authenticated and if their session data is initialized
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.session.user.id; // Get the user's ID from the session

  try {
    // Check if the product is in the user's cart
    const cartItem = await CartItem.findOne({ userId, productId });

    if (cartItem) {
      if (cartItem.quantity > 1) {
        // If the product is in the cart and its quantity is greater than 1, decrement the quantity
        cartItem.quantity -= 1;
        await cartItem.save();
      } else {
        // If the product is in the cart and its quantity is 1, remove it from the cart and the database
        await CartItem.deleteOne({ userId, productId });
      }

      // Remove the selected product ID from the user's selectedProducts array in the session
      req.session.user.selectedProducts = req.session.user.selectedProducts.filter(
        (selectedProductId) => selectedProductId !== productId
      );

      return res.status(200).json({ message: 'Product removed from cart and database' });
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error('Error removing product from cart and database:', error);
    return res.status(500).json({ error: 'Error removing product from cart and database' });
  }
};
export const endSession = (req, res) => {
  try {
    // Destroy the user's session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error ending session:', err);
        return res.status(500).json({ error: 'Session could not be ended' });
      }
      
      // Clear the session cookie on the client-side
      res.clearCookie('sessionId');
      
      return res.status(200).json({ message: 'Session ended successfully' });
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return res.status(500).json({ error: 'Session could not be ended' });
  }
};




