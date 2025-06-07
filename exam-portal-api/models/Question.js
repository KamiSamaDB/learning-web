import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctIndex: Number
});

export default mongoose.model('Question', questionSchema);