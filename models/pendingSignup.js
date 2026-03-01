const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingSignupSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "host"],
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

pendingSignupSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("PendingSignup", pendingSignupSchema);
