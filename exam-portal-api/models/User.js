import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], required: true },
  password: { type: String }
});

export default mongoose.model('User', userSchema);