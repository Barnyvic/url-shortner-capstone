import mongoose, { Model, Schema } from "mongoose";
import bcrypt from 'bcrypt';


export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  ipAddress: string;
  userAgent: string;
  comparePassword: (password: string) => boolean;
}

interface InstanceMethods extends Model<IUser> {
  comparePassword: (password: string) => boolean;
}

const userSchema = new Schema<IUser, InstanceMethods>({
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


userSchema.methods.comparePassword = function(password: string) {
  return bcrypt.compareSync(password, this.password);
};


const User = mongoose.model<IUser,InstanceMethods>("User", userSchema);

export default User;