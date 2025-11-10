import express from "express";
import dashboardRoutes from "./dashboard.routes.js";
import guestsRoutes from "./guests.routes.js";
import propertyRoutes from "./properties.routes.js";

const router = express.Router();

// Core routes
router.use("/", dashboardRoutes); // /overview
router.use("/guests", guestsRoutes);
router.use('/properties', propertyRoutes);

export default router;
