import express from "express";
import { getRevenueSummary, getRevenueFeed, getBookingRevenueDetail } from "../controllers/revenue.controller.js";

const router = express.Router();

router.get("/summary", getRevenueSummary);
router.get("/feed", getRevenueFeed);
router.get("/booking/:bookingId", getBookingRevenueDetail);

export default router;
