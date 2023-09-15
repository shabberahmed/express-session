import  Router from "express";
import { addProductToSession, endSession, getProducts, getSelectedProductsFromSession, removeProductFromSession, userData } from "../controllers/Usercontroller.js";
const route=Router()
route.post('/users',userData)

route.get('/getproducts',getProducts)
route.post("/addproduct", addProductToSession);
route.get('/get-added-products-from-session', getSelectedProductsFromSession);
route.delete("/remove-item", removeProductFromSession);
route.post('/logout', endSession);
export default route