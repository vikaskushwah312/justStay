import express from "express";
import dashboardRoutes from "./dashboard.routes.js";
import guestsRoutes from "./guests.routes.js";


const router = express.Router();

router.use("/", dashboardRoutes); // /overview
router.use("/guests", guestsRoutes);


export default router;
