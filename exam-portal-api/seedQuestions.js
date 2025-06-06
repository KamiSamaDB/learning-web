import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/examportal';

const defaultQuestions = [
  { "question": "What is the capital of France?", "options": ["Berlin", "Madrid", "Paris", "Rome"], "correctIndex": 2 },
  { "question": "What color is the sky on a clear day?", "options": ["Blue", "Green", "Red", "Yellow"], "correctIndex": 0 },
  { "question": "Which planet is known as the Red Planet?", "options": ["Earth", "Mars", "Jupiter", "Venus"], "correctIndex": 1 },
  { "question": "What is 5×3?", "options": ["15", "10", "8", "20"], "correctIndex": 0 },
  { "question": "How many days are in a leap year?", "options": ["365", "366", "364", "367"], "correctIndex": 1 },
  { "question": "What is H2O commonly known as?", "options": ["Hydrogen", "Water", "Oxygen", "Salt"], "correctIndex": 1 },
  { "question": "Which animal is known as the King of the Jungle?", "options": ["Tiger", "Elephant", "Lion", "Leopard"], "correctIndex": 2 },
  { "question": "Which shape has 4 equal sides?", "options": ["Triangle", "Rectangle", "Circle", "Square"], "correctIndex": 3 },
  { "question": "What gas do plants absorb from the air?", "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], "correctIndex": 1 },
  { "question": "Which continent is Egypt in?", "options": ["Asia", "Europe", "Africa", "Australia"], "correctIndex": 2 },
  { "question": "How many legs does a spider have?", "options": ["6", "8", "10", "12"], "correctIndex": 1 },
  { "question": "What is the boiling point of water in Celsius?", "options": ["50", "90", "100", "110"], "correctIndex": 2 },
  { "question": "Which ocean is the largest?", "options": ["Atlantic", "Indian", "Pacific", "Arctic"], "correctIndex": 2 },
  { "question": "Which is a prime number?", "options": ["4", "6", "9", "7"], "correctIndex": 3 },
  { "question": "What is the opposite of 'hot'?", "options": ["Warm", "Boiling", "Cold", "Cool"], "correctIndex": 2 },
  { "question": "What is the largest planet in our solar system?", "options": ["Earth", "Mars", "Jupiter", "Saturn"], "correctIndex": 2 },
  { "question": "Which month has 28 days in a non-leap year?", "options": ["February", "March", "January", "April"], "correctIndex": 0 },
  { "question": "How many colors are there in a rainbow?", "options": ["5", "6", "7", "8"], "correctIndex": 2 },
  { "question": "What is the square root of 16?", "options": ["3", "4", "5", "6"], "correctIndex": 1 },
  { "question": "Which country is known for pizza?", "options": ["Spain", "Italy", "Greece", "France"], "correctIndex": 1 },
  { "question": "What is the chemical symbol for gold?", "options": ["Ag", "Gd", "Au", "Go"], "correctIndex": 2 },
  { "question": "How many sides does a triangle have?", "options": ["3", "4", "5", "6"], "correctIndex": 0 },
  { "question": "What is the main language spoken in Spain?", "options": ["French", "Spanish", "Italian", "German"], "correctIndex": 1 },
  { "question": "What is 10 divided by 2?", "options": ["4", "5", "6", "7"], "correctIndex": 1 },
  { "question": "What is the freezing point of water in Celsius?", "options": ["0", "10", "20", "32"], "correctIndex": 0 },
  { "question": "Which is a mammal?", "options": ["Frog", "Shark", "Whale", "Tuna"], "correctIndex": 2 },
  { "question": "Which planet is closest to the Sun?", "options": ["Venus", "Earth", "Mercury", "Mars"], "correctIndex": 2 },
  { "question": "What part of the plant conducts photosynthesis?", "options": ["Root", "Stem", "Leaf", "Flower"], "correctIndex": 2 },
  { "question": "What is the largest mammal?", "options": ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], "correctIndex": 1 },
  { "question": "What is the main ingredient in bread?", "options": ["Rice", "Wheat", "Oats", "Corn"], "correctIndex": 1 },
  { "question": "What comes after Tuesday?", "options": ["Thursday", "Monday", "Wednesday", "Friday"], "correctIndex": 2 },
  { "question": "What do bees make?", "options": ["Milk", "Silk", "Honey", "Juice"], "correctIndex": 2 },
  { "question": "How many hours are there in a day?", "options": ["12", "24", "48", "60"], "correctIndex": 1 },
  { "question": "Which of these is not a primary color?", "options": ["Red", "Green", "Blue", "Yellow"], "correctIndex": 1 },
  { "question": "Which is the smallest prime number?", "options": ["1", "2", "3", "5"], "correctIndex": 1 },
  { "question": "What currency is used in Japan?", "options": ["Won", "Yuan", "Yen", "Dollar"], "correctIndex": 2 },
  { "question": "Which animal is known for its humps?", "options": ["Elephant", "Giraffe", "Camel", "Zebra"], "correctIndex": 2 },
  { "question": "What do you use to write on a blackboard?", "options": ["Pen", "Pencil", "Chalk", "Crayon"], "correctIndex": 2 },
  { "question": "What does a thermometer measure?", "options": ["Pressure", "Weight", "Temperature", "Speed"], "correctIndex": 2 },
  { "question": "How many continents are there?", "options": ["5", "6", "7", "8"], "correctIndex": 2 },
  { "question": "What is the largest organ in the human body?", "options": ["Heart", "Liver", "Skin", "Brain"], "correctIndex": 2 },
  { "question": "Which one is a reptile?", "options": ["Frog", "Snake", "Eagle", "Cat"], "correctIndex": 1 },
  { "question": "Which instrument has keys, pedals, and strings?", "options": ["Violin", "Flute", "Piano", "Drum"], "correctIndex": 2 },
  { "question": "What color do you get when you mix red and white?", "options": ["Pink", "Orange", "Purple", "Brown"], "correctIndex": 0 },
  { "question": "Which season comes after summer?", "options": ["Winter", "Spring", "Autumn", "Monsoon"], "correctIndex": 2 },
  { "question": "Which is faster?", "options": ["Turtle", "Rabbit", "Snail", "Sheep"], "correctIndex": 1 },
  { "question": "What shape is a stop sign?", "options": ["Circle", "Square", "Octagon", "Hexagon"], "correctIndex": 2 },
  { "question": "Which of these is not a fruit?", "options": ["Apple", "Carrot", "Banana", "Grapes"], "correctIndex": 1 }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await Question.deleteMany({});
    await Question.insertMany(defaultQuestions);
    console.log('Inserted default questions!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding questions:', err);
    process.exit(1);
  }
}

seed();