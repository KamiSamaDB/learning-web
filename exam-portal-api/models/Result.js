import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  username: String,
  marks: Number,
  date: String,
  answers: [
    {
      question: String,
      options: [String],
      correctIndex: Number,
      selectedIndex: Number
    }
  ]
});

export default mongoose.model('Result', resultSchema);