import express from "express";
import {
  getInventoryCalendar,
  upsertInventoryDay,
  bulkInventory,
  toggleOpenClose,
  saveBulkChanges,
} from "../controllers/inventory.controller.js";

const router = express.Router();

// Calendar
router.get("/calendar", getInventoryCalendar);

// Single day upsert
router.put("/day/:roomId/:date", upsertInventoryDay);

// Bulk range updates
router.patch("/bulk", bulkInventory);
/**
 * {
  "roomIds": ["6720r1..."],
  "dateFrom": "2025-09-27",
  "dateTo": "2025-09-30",
  "applyOn": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  "allotment": 5,
  "open": true,
  "stopSell": false
}
 */
router.post("/toggle", toggleOpenClose);

// Save combined changes (inventory portion)
router.post("/save", saveBulkChanges);
/*
{
  "inventory": [
    { "roomId": "6720r1...", "date": "2025-09-27", "allotment": 5, "open": true },
    { "roomId": "6720r1...", "date": "2025-09-28", "allotment": 5, "open": true }
  ],
  "rates": []
}
*/

export default router;
