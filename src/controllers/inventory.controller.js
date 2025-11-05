import mongoose from "mongoose";
import RoomInventory from "../models/roomInventory.model.js";

const parseISODate = (s) => new Date(`${s}T00:00:00.000Z`);
const formatISODate = (d) => d.toISOString().slice(0, 10);

export const getInventoryCalendar = async (req, res) => {
  try {
    const { month, roomId, propertyId } = req.query;
    if (!month) return res.status(400).json({ success: false, message: "month (YYYY-MM) is required" });

    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);

    const filter = { date: { $gte: start, $lt: end } };
    if (roomId) {
      const roomIds = Array.isArray(roomId) ? roomId : [roomId];
      filter.roomId = { $in: roomIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }
    // propertyId can be supported by joining with PropertyRoom if needed; omitted for brevity

    const rows = await RoomInventory.find(filter).sort({ roomId: 1, date: 1 });

    const map = new Map();
    for (const r of rows) {
      const key = String(r.roomId);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ date: formatISODate(r.date), allotment: r.allotment, open: r.open, stopSell: r.stopSell });
    }

    const data = Array.from(map.entries()).map(([rid, days]) => ({ roomId: rid, days }));

    res.status(200).json({ success: true, meta: { month, days: new Date(end - start).getUTCDate() }, data });
  } catch (error) {
    console.error("Error getInventoryCalendar:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const upsertInventoryDay = async (req, res) => {
  try {
    const { roomId, date } = req.params;
    const { allotment, open, stopSell, notes } = req.body;

    const doc = await RoomInventory.findOneAndUpdate(
      { roomId, date: parseISODate(date) },
      { $set: { allotment, open, stopSell, notes } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Inventory upserted", data: { roomId: doc.roomId, date, allotment: doc.allotment, open: doc.open, stopSell: doc.stopSell } });
  } catch (error) {
    console.error("Error upsertInventoryDay:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const bulkInventory = async (req, res) => {
  try {
    const { roomIds = [], dateFrom, dateTo, applyOn, allotment, open, stopSell } = req.body;
    if (!Array.isArray(roomIds) || roomIds.length === 0) return res.status(400).json({ success: false, message: "roomIds is required" });
    if (!dateFrom || !dateTo) return res.status(400).json({ success: false, message: "dateFrom and dateTo are required" });

    const start = parseISODate(dateFrom);
    const end = parseISODate(dateTo);
    const days = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getUTCDay()];
      if (!applyOn || applyOn.includes(dow)) days.push(new Date(d));
    }

    let affected = 0;
    for (const id of roomIds) {
      for (const d of days) {
        const resu = await RoomInventory.updateOne(
          { roomId: id, date: d },
          { $set: { allotment, open, stopSell } },
          { upsert: true }
        );
        affected += resu.matchedCount + resu.upsertedCount || 1;
      }
    }

    res.status(200).json({ success: true, message: "Inventory updated", data: { affected } });
  } catch (error) {
    console.error("Error bulkInventory:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const toggleOpenClose = async (req, res) => {
  try {
    const { roomIds = [], dateFrom, dateTo, open } = req.body;
    if (!Array.isArray(roomIds) || roomIds.length === 0) return res.status(400).json({ success: false, message: "roomIds is required" });
    if (!dateFrom || !dateTo) return res.status(400).json({ success: false, message: "dateFrom and dateTo are required" });

    const start = parseISODate(dateFrom);
    const end = parseISODate(dateTo);

    const resu = await RoomInventory.updateMany(
      { roomId: { $in: roomIds }, date: { $gte: start, $lte: end } },
      { $set: { open } }
    );

    res.status(200).json({ success: true, message: "Open/close updated", data: { matched: resu.matchedCount ?? resu.n, modified: resu.modifiedCount ?? resu.nModified } });
  } catch (error) {
    console.error("Error toggleOpenClose:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const saveBulkChanges = async (req, res) => {
  try {
    const { inventory = [], rates = [] } = req.body;

    let invCount = 0;
    for (const i of inventory) {
      const d = parseISODate(i.date);
      const u = await RoomInventory.updateOne(
        { roomId: i.roomId, date: d },
        { $set: { allotment: i.allotment, open: i.open, stopSell: i.stopSell } },
        { upsert: true }
      );
      invCount += u.matchedCount + u.upsertedCount || 1;
    }

    // rates saved in rates.controller via dedicated endpoints; included here only for inventory portion

    res.status(200).json({ success: true, message: "Changes saved", data: { inventoryUpserts: invCount, rateUpserts: 0 } });
  } catch (error) {
    console.error("Error saveBulkChanges:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
