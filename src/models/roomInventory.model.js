import mongoose from "mongoose";

const { Schema } = mongoose;

const roomInventorySchema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "PropertyRoom", required: true, index: true },
    date: { type: Date, required: true, index: true },
    allotment: { type: Number, default: 0, min: 0 },
    open: { type: Boolean, default: true },
    stopSell: { type: Boolean, default: false },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

roomInventorySchema.index({ roomId: 1, date: 1 }, { unique: true });

const RoomInventory = mongoose.model("RoomInventory", roomInventorySchema);
export default RoomInventory;
