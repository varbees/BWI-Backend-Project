import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return !this.phoneNumber;
      },
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return !this.email;
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profilePicture: {
      type: String,
      required: [true, 'Profile picture is required'],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('validate', function (next) {
  if (!this.email && !this.phoneNumber) {
    throw new Error('Email or phone number is required');
  } else {
    next();
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(9);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (formPassword) {
  return await bcrypt.compare(formPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
