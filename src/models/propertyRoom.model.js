import mongoose from "mongoose";

const { Schema } = mongoose;

// -----------------------------
// Enum definitions
// -----------------------------
const roomTypes = [
  "Standard",
  "Deluxe",
  "Super Deluxe",
  "Suite",
  "Executive Suite",
  "Family Room",
  "Presidential Suite"
];

// -----------------------------
// Property Room Schema
// -----------------------------
const propertyRoomSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "PropertyInfo",
      required: true,
    },

    type: {
      type: String,
      enum: roomTypes,
      required: true,
      default: "Standard",
    },

    area: { type: Number, required: true }, // in sq.ft (or sqm)
    bed: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    numberOfRooms: { type: Number, default: 1 },

    price: {
      oneNight: { type: Number, required: true },
      threeHours: { type: Number, default: 0 },
      sixHours: { type: Number, default: 0 },
    },

    photos: [{ type: String, default: [] }],

    amenities: [ { type: String, default: [] } ],
  },
  { timestamps: true }
);

// -----------------------------
// Export model
// -----------------------------
const PropertyRoom = mongoose.model("PropertyRoom", propertyRoomSchema);
export default PropertyRoom;
