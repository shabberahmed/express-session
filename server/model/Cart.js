import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
  },
  productId: mongoose.Schema.Types.ObjectId, 
  quantity: {
    type: Number,
    default: 1, 
  },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
