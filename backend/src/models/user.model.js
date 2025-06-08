import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "tutor", "both"],
      default: "student",
    },
    ratings: {
      asTutor: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 },
      },
      asStudent: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 },
      },
    },
    profile: {
      bio: { type: String, default: "", maxlength: 250 },
      subjects: [
        {
          name: String,
          level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
          },
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          field: String,
          year: Number,
        },
      ],
      skills: [String],
      location: {
        city: String,
        country: String,
      },
      contact: {
        phone: String,
        website: String,
        socialMedia: {
          linkedin: String,
          twitter: String,
        },
      },
      availability: {
        days: [String],
        hours: String,
      },
    },
    preferences: {
      notifications: { type: Boolean, default: true },
      theme: { type: String, default: "light" },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
