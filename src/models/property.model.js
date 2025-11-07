import mongoose from "mongoose";

const { Schema } = mongoose;

// -----------------------------
// Enum definitions
// -----------------------------
const propertyTypes = [
  "Villa",
  "Homestay",
  "Cottage",
  "Apartment",
  "Entire Property",
  "Private Room",
];

const documentTypes = ["Electricity", "Phone", "Aadhar", "Pan"];

const statusTypes = ["Under Review", "Accepted", "Rejected"];

// -----------------------------
// PropertyInfo Schema
// -----------------------------
const propertySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    propertyType: {
      type: String,
      enum: propertyTypes,
      required: true,
    },
    screenNumber: {
      type: Number,
      required: true,
    },
    basicPropertyDetails: {
      name: { type: String, required: true, trim: true },
      builtYear: { type: Number },
      bookingSince: { type: Number },
    },

    contactDetails: {
      email: { type: String, lowercase: true, trim: true },
      mobile: { type: String, trim: true },
      landline: { type: String, trim: true },
    },

    location: {
      house: { type: String, trim: true },
      area: { type: String, trim: true },
      pincode: { type: Number, min: 100000, max: 999999 },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    documents: [
      {
        documentType: { type: String, enum: documentTypes, required: true },
        documentUrl: { type: String, required: true },
      },
    ],

    status: {
      type: String,
      enum: statusTypes,
      default: "Under Review",
    },

    photos: {
        type: [String],
        default: [],
    },
    // PAN
    pan: {
        number: { type: String, trim: true },
        front: { type: String, trim: true },
        back: { type: String, trim: true },
    },

    // Aadhar
    aadhar: {
      number: { type: String, trim: true },
      front: { type: String, trim: true },
      back: { type: String, trim: true },
    },

    // Bank Details
    bankDetails: {
      name: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, trim: true },
    },

    // GST
    gst: {
      number: { type: String, trim: true },
      front: { type: String, trim: true },
      back: { type: String, trim: true },
    },

    // Business License
    businessLicense: {
      number: { type: String, trim: true },
      front: { type: String, trim: true },
      back: { type: String, trim: true },
    },

    trainingAndGuidelines: { type: String, default: "" }, // long text / log

  },
  { timestamps: true } // createdAt & updatedAt
);

// -----------------------------
// Export model
// -----------------------------
const PropertyInfo = mongoose.model("PropertyInfo", propertySchema);
export default PropertyInfo;