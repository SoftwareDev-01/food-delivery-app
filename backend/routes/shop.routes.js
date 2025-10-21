import express from "express";
import { 
    addShop, 
    getAllShops, 
    getCurrentShop, 
    getShopById, 
    getShopsByCity,
    getUniqueCities // Add this import (we'll add the function in controllers)
} from "../controllers/shop.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.get("/getall", isAuth, getAllShops);
shopRouter.get("/getcurrent", isAuth, getCurrentShop);
shopRouter.post("/editshop", isAuth, upload.single("image"), addShop);
shopRouter.get("/getshopsbycity/:city", isAuth, getShopsByCity);
shopRouter.get("/getshopbyid/:shopId", isAuth, getShopById);
shopRouter.get("/unique-cities", getUniqueCities); // New route: No auth, public

export default shopRouter;