import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    state?: string;
    country?: string;
  };
  phone?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      maxLength: [20, "Username must be less than 20 characters"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxLength: [50, "Email must be less than 50 characters"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxLength: [50, "Password must be less than 50 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    firstName: {
      type: String,
      maxLength: [20, "firstName must be less than 20 characters"],
    },
    lastName: {
      type: String,
      maxLength: [20, "lastName must be less than 20 characters"],
    },
    address: {
      street: {
        type: String,
        maxLength: [20, "street must be less than 20 characters"],
      },
      city: {
        type: String,
        maxLength: [20, "city must be less than 20 characters"],
      },
      zip: {
        type: String,
        maxLength: [10, "zip must be less than 10 characters"],
      },
      state: {
        type: String,
        maxLength: [20, "state must be less than 20 characters"],
      },
      country: {
        type: String,
        maxLength: [20, "country must be less than 20 characters"],
      },
    },
    phone: {
      type: String,
      maxLength: [12, "phone must be less than 12 characters"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  // Hash the password
  this.password = await bcrypt.hash(this.password, 0);
  next();
});

export default model<IUser>("User", userSchema);
