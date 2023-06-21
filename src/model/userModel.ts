import mongoose, { Model, Schema } from "mongoose";
import bcrypt from 'bcrypt';


export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  ipAddress: string;
  userAgent: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
},{ timestamps: true});


const User = mongoose.model<IUser>("User", userSchema);

export default User;