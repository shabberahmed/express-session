import mongoose from "mongoose";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";

const MongoDBStoreSession = MongoDBStore(session);

// Initialize MongoDBStore with your MongoDB connection
const store = new MongoDBStoreSession({
  uri: process.env.CONNECTION, // Replace with your MongoDB URI
  collection: "CartItem", // Collection name to store sessions
  expires: 1000 * 60 * 60 * 24 * 7, // Session expiration time (e.g., 1 week)

});

export const initSession = session({
  secret: "ahmed8897",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie:{
    maxAge: Date.now() + 100000 * 60 * 60 * 24 * 7,
    httpOnly:true
  }

   
});

export const connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to mongoose');
  } catch (err) {
    console.error(`Mongoose error: ${err}`);
  }
};