import mongoose from "mongoose";

const { Schema } = mongoose;

// -----------------------------------------
// ENUMS
// -----------------------------------------
const bookingTypes = ["Online", "Manual"];
const bookingStatuses = ["Booked", "CheckIn", "CheckOut", "Cancel"];

// -----------------------------------------
// SUB-SCHEMAS
// -----------------------------------------

const guestDetailsSchema = new Schema({
  name: { type: String, required: true },
  fatherOrSpouseName: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  age: { type: Number },
  address: { type: String },
  pincode: { type: String },
  city: { type: String },
  state: { type: String },
  phone: { type: String },
  email: { type: String },
});

const identificationProofSchema = new Schema({
  type: { type: String },
  number: { type: String },
  documentUrl: { type: String },
});

const stayDetailsSchema = new Schema({
  roomNumber: { type: String },
  roomType: { type: String },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  checkInDate: { type: Date },
  checkInTime: { type: String },
  expectedCheckOutDate: { type: Date },
  expectedCheckOutTime: { type: String },
  purposeOfVisit: { type: String },
});

const coGuestDetailsSchema = new Schema({
  name: { type: String },
  idType: { type: String },
  idUrl: { type: String },
});

const foodSchema = new Schema({
  name: { type: String },
  quantity: { type: Number, default: 1 },
});

const priceSummarySchema = new Schema({
  roomPrice: { type: Number, default: 0 },
  foodPrice: { type: Number, default: 0 },
  taxAndServiceFees: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
});

// -----------------------------------------
// MAIN SCHEMA
// -----------------------------------------
const roomBookingSchema = new Schema(
  {
    //online =customer books via website
    //manual= Hotelire does the booking for customer
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
      enum: bookingTypes,
      required: true,
      default: "Online",
    },

    status: {
      type: String,
      enum: bookingStatuses,
      required: true,
      default: "Booked",
    },

    guestDetails: guestDetailsSchema,

    identificationProof: identificationProofSchema,

    stayDetails: stayDetailsSchema,

    coGuestDetails: [coGuestDetailsSchema],

    checkOutDate: { type: Date },
    time: { type: String },

    food: [foodSchema],

    priceSummary: priceSummarySchema,
  },
  { timestamps: true }
);

// -----------------------------------------
// MODEL EXPORT
// -----------------------------------------
const RoomBooking = mongoose.model("RoomBooking", roomBookingSchema);
export default RoomBooking;
