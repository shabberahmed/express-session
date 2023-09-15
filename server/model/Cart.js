import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the User model
  },
  productId: mongoose.Schema.Types.ObjectId, // Direct reference to ObjectId
  quantity: {
    type: Number,
    default: 1, // You can adjust this default value as needed
  },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
