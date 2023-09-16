import mongoose from "mongoose";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";

const MongoDBStoreSession = MongoDBStore(session);

const store = new MongoDBStoreSession({
  uri: process.env.CONNECTION, 
  collection: "CartItem", 
  expires: 1000 * 60 * 60 * 24 * 7, 

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