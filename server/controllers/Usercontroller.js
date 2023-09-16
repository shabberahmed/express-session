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
        req.session.regenerate((err) => {
          if (err) {
            return res.status(500).json({ error: 'Session reset error' });
          }

          req.session.user = {
            id: data._id,
            username: data.username,
            selectedProducts: [], 
          };

          res.cookie('sessionId', req.session.user, {
            maxAge: 1000 * 60 * 60 * 24 * 7, 
            httpOnly: true,
          });

          return res.status(201).json("Login successful");
        });
      } else {
        return res.status(401).json("Wrong password"); 
      }
    } else {
      return res.status(401).json({ message: "Wrong email" }); 
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

  export const getProducts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; 
      const pageSize = parseInt(req.query.pageSize) || 2; 
      const skip = (page - 1) * pageSize;
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
  const { productId } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.session.user.id; 

  try {
    let cartItem = await CartItem.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cartItem = new CartItem({
        productId,
        userId,
        quantity: 1,
      });
    }

    await cartItem.save();

    req.session.user.selectedProducts.push(productId);

    return res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return res.status(500).json({ error: 'Error adding product to cart' });
  }
};


export const getSelectedProductsFromSession = async (req, res) =>  {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;

  try {
    const selectedProducts = await CartItem.find({ userId });

    const productIdsWithQuantity = selectedProducts.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const productIds = productIdsWithQuantity.map((item) => item.productId);

    const data = await mongoose.connection.collection('products');
    const products = await data.find({ _id: { $in: productIds } }).toArray();

    const selectedProductsWithQuantity = products.map((product) => {
      const cartItem = productIdsWithQuantity.find((item) =>
        item.productId && product._id && item.productId.equals(product._id)
      );
      return {
        ...product,
        quantity: cartItem ? cartItem.quantity : 0,
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

 
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.session.user.id;

  try {

    const cartItem = await CartItem.findOne({ userId, productId });

    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
      } else {
        await CartItem.deleteOne({ userId, productId });
      }

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
    req.session.destroy((err) => {
      if (err) {
        console.error('Error ending session:', err);
        return res.status(500).json({ error: 'Session could not be ended' });
      }
      
      res.clearCookie('sessionId');
      
      return res.status(200).json({ message: 'Session ended successfully' });
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return res.status(500).json({ error: 'Session could not be ended' });
  }
};




