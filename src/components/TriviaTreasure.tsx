"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TriviaQuestion {
  id: string;
  question: string;
  answers: string[];
  correct: number;
  category: string;
  difficulty: number;
  explanation?: string;
  funFact?: string;
}

interface PlayerData {
  coins: number;
  experience: number;
  experienceToNext: number;
  level: number;
}

interface TriviaTreasureProps {
  onBack: () => void;
  playerData: PlayerData;
  onUpdatePlayer: (newData: Partial<PlayerData>) => void;
}

export default function TriviaTreasure({ onBack, playerData, onUpdatePlayer }: TriviaTreasureProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameQuestions, setGameQuestions] = useState<TriviaQuestion[]>([]);

  const categories = [
    { id: "animals", name: "Animals", icon: "🐾", color: "bg-green-100" },
    { id: "colors", name: "Colors", icon: "🌈", color: "bg-purple-100" },
    { id: "numbers", name: "Numbers", icon: "🔢", color: "bg-blue-100" },
    { id: "everyday", name: "Everyday Life", icon: "🏠", color: "bg-yellow-100" },
    { id: "food", name: "Food", icon: "🍎", color: "bg-red-100" },
    { id: "science", name: "Science", icon: "🔬", color: "bg-indigo-100" },
    { id: "geography", name: "Geography", icon: "🌍", color: "bg-teal-100" },
    { id: "sports", name: "Sports", icon: "⚽", color: "bg-orange-100" },
    { id: "music", name: "Music", icon: "🎵", color: "bg-pink-100" },
    { id: "space", name: "Space", icon: "🚀", color: "bg-gray-100" },
  ];

  const difficulties = [
    { level: 1, name: "Easy", icon: "⭐", color: "bg-green-100" },
    { level: 2, name: "Medium", icon: "⭐⭐", color: "bg-yellow-100" },
    { level: 3, name: "Hard", icon: "⭐⭐⭐", color: "bg-red-100" },
    { level: 4, name: "Expert", icon: "🏆", color: "bg-purple-100" },
    { level: 5, name: "Master", icon: "👑", color: "bg-gold-100" },
  ];

  const triviaQuestions: TriviaQuestion[] = [
    // Colors Category - Expanded
    {
      id: "colors1",
      question: "What color is a banana?",
      answers: ["Red", "Blue", "Yellow", "Green"],
      correct: 2,
      category: "colors",
      difficulty: 1,
      funFact: "Bananas are yellow because they contain carotenoids!"
    },
    {
      id: "colors2",
      question: "What color is the sky on a sunny day?",
      answers: ["Green", "Blue", "Red", "Yellow"],
      correct: 1,
      category: "colors",
      difficulty: 1,
      funFact: "The sky is blue due to Rayleigh scattering of sunlight!"
    },
    {
      id: "colors3",
      question: "What color is grass?",
      answers: ["Blue", "Red", "Green", "Purple"],
      correct: 2,
      category: "colors",
      difficulty: 1,
      funFact: "Grass is green because of chlorophyll!"
    },
    {
      id: "colors4",
      question: "What color is a fire truck?",
      answers: ["Blue", "Yellow", "Green", "Red"],
      correct: 3,
      category: "colors",
      difficulty: 1,
      funFact: "Fire trucks are red because it's a highly visible color!"
    },
    {
      id: "colors5",
      question: "What color is a school bus?",
      answers: ["Purple", "Yellow", "Blue", "Green"],
      correct: 1,
      category: "colors",
      difficulty: 1,
      funFact: "School buses are yellow for maximum visibility!"
    },
    {
      id: "colors6",
      question: "What color do you get when you mix red and blue?",
      answers: ["Green", "Orange", "Purple", "Yellow"],
      correct: 2,
      category: "colors",
      difficulty: 2,
      explanation: "Red and blue make purple!"
    },
    {
      id: "colors7",
      question: "What color do you get when you mix yellow and blue?",
      answers: ["Green", "Orange", "Purple", "Red"],
      correct: 0,
      category: "colors",
      difficulty: 2,
      explanation: "Yellow and blue make green!"
    },
    {
      id: "colors8",
      question: "What color is a zebra?",
      answers: ["Brown", "Black and White", "Gray", "Spotted"],
      correct: 1,
      category: "colors",
      difficulty: 1,
      funFact: "No two zebras have the same stripe pattern!"
    },

    // Animals Category - Expanded
    {
      id: "animals1",
      question: "How many legs does a dog have?",
      answers: ["2", "4", "6", "8"],
      correct: 1,
      category: "animals",
      difficulty: 1,
      funFact: "Dogs have 4 legs and are mammals!"
    },
    {
      id: "animals2",
      question: "What sound does a cat make?",
      answers: ["Woof", "Meow", "Moo", "Quack"],
      correct: 1,
      category: "animals",
      difficulty: 1,
      funFact: "Cats meow to communicate with humans!"
    },
    {
      id: "animals3",
      question: "What animal says 'Oink Oink'?",
      answers: ["Dog", "Cat", "Pig", "Cow"],
      correct: 2,
      category: "animals",
      difficulty: 1,
      funFact: "Pigs are very intelligent animals!"
    },
    {
      id: "animals4",
      question: "What animal lives in the ocean and has fins?",
      answers: ["Bird", "Fish", "Lion", "Elephant"],
      correct: 1,
      category: "animals",
      difficulty: 1,
      funFact: "Fish breathe through their gills!"
    },
    {
      id: "animals5",
      question: "What animal is known as the 'King of the Jungle'?",
      answers: ["Tiger", "Elephant", "Lion", "Bear"],
      correct: 2,
      category: "animals",
      difficulty: 2,
      funFact: "Lions are the only cats that live in groups!"
    },
    {
      id: "animals6",
      question: "What animal has a long neck and eats leaves from trees?",
      answers: ["Elephant", "Giraffe", "Zebra", "Hippo"],
      correct: 1,
      category: "animals",
      difficulty: 2,
      funFact: "Giraffes have the same number of neck bones as humans!"
    },
    {
      id: "animals7",
      question: "What animal is the fastest land animal?",
      answers: ["Lion", "Cheetah", "Horse", "Leopard"],
      correct: 1,
      category: "animals",
      difficulty: 2,
      funFact: "Cheetahs can run up to 70 mph!"
    },
    {
      id: "animals8",
      question: "What animal is the largest mammal?",
      answers: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correct: 1,
      category: "animals",
      difficulty: 3,
      funFact: "Blue whales can be up to 100 feet long!"
    },
    {
      id: "animals9",
      question: "What animal sleeps upside down?",
      answers: ["Monkey", "Bat", "Sloth", "Owl"],
      correct: 1,
      category: "animals",
      difficulty: 2,
      funFact: "Bats are the only mammals that can fly!"
    },
    {
      id: "animals10",
      question: "What animal changes color to blend in?",
      answers: ["Lizard", "Chameleon", "Frog", "Snake"],
      correct: 1,
      category: "animals",
      difficulty: 2,
      funFact: "Chameleons change color for communication, not just camouflage!"
    },

    // Numbers Category - Expanded
    {
      id: "numbers1",
      question: "How many fingers do you have on one hand?",
      answers: ["3", "4", "5", "6"],
      correct: 2,
      category: "numbers",
      difficulty: 1,
      funFact: "Most people have 5 fingers on each hand!"
    },
    {
      id: "numbers2",
      question: "What comes after the number 9?",
      answers: ["8", "10", "11", "9"],
      correct: 1,
      category: "numbers",
      difficulty: 1,
      funFact: "10 is the first two-digit number!"
    },
    {
      id: "numbers3",
      question: "How many days are in a week?",
      answers: ["5", "6", "7", "8"],
      correct: 2,
      category: "numbers",
      difficulty: 1,
      funFact: "There are 7 days in a week!"
    },
    {
      id: "numbers4",
      question: "What is 2 + 2?",
      answers: ["3", "4", "5", "6"],
      correct: 1,
      category: "numbers",
      difficulty: 1,
      funFact: "2 + 2 = 4 is one of the first addition facts kids learn!"
    },
    {
      id: "numbers5",
      question: "How many months are in a year?",
      answers: ["10", "11", "12", "13"],
      correct: 2,
      category: "numbers",
      difficulty: 2,
      funFact: "There are 12 months in a year!"
    },
    {
      id: "numbers6",
      question: "What is 10 - 3?",
      answers: ["6", "7", "8", "9"],
      correct: 1,
      category: "numbers",
      difficulty: 2,
      explanation: "10 - 3 = 7"
    },
    {
      id: "numbers7",
      question: "How many hours are in a day?",
      answers: ["12", "24", "36", "48"],
      correct: 1,
      category: "numbers",
      difficulty: 2,
      funFact: "There are 24 hours in a day!"
    },
    {
      id: "numbers8",
      question: "What is 5 × 3?",
      answers: ["10", "15", "20", "25"],
      correct: 1,
      category: "numbers",
      difficulty: 3,
      explanation: "5 × 3 = 15"
    },
    {
      id: "numbers9",
      question: "How many sides does a triangle have?",
      answers: ["2", "3", "4", "5"],
      correct: 1,
      category: "numbers",
      difficulty: 1,
      funFact: "A triangle has 3 sides and 3 angles!"
    },
    {
      id: "numbers10",
      question: "What is half of 20?",
      answers: ["5", "10", "15", "20"],
      correct: 1,
      category: "numbers",
      difficulty: 2,
      explanation: "Half of 20 is 10"
    },

    // Everyday Life Category - Expanded
    {
      id: "everyday1",
      question: "What do you use to write?",
      answers: ["Fork", "Pencil", "Shoe", "Phone"],
      correct: 1,
      category: "everyday",
      difficulty: 1,
      funFact: "Pencils can write about 45,000 words!"
    },
    {
      id: "everyday2",
      question: "What do you wear on your feet?",
      answers: ["Hat", "Gloves", "Shoes", "Scarf"],
      correct: 2,
      category: "everyday",
      difficulty: 1,
      funFact: "Shoes protect our feet and help us walk comfortably!"
    },
    {
      id: "everyday3",
      question: "What do you use to brush your teeth?",
      answers: ["Comb", "Toothbrush", "Fork", "Spoon"],
      correct: 1,
      category: "everyday",
      difficulty: 1,
      funFact: "You should brush your teeth for 2 minutes twice a day!"
    },
    {
      id: "everyday4",
      question: "What do you sleep on at night?",
      answers: ["Table", "Chair", "Bed", "Desk"],
      correct: 2,
      category: "everyday",
      difficulty: 1,
      funFact: "Sleeping helps your body and brain rest and recharge!"
    },
    {
      id: "everyday5",
      question: "What do you use to tell time?",
      answers: ["Book", "Clock", "Shoe", "Ball"],
      correct: 1,
      category: "everyday",
      difficulty: 1,
      funFact: "Clocks help us know when to do different activities!"
    },
    {
      id: "everyday6",
      question: "What do you eat soup with?",
      answers: ["Fork", "Knife", "Spoon", "Chopsticks"],
      correct: 2,
      category: "everyday",
      difficulty: 2,
      funFact: "Spoons are perfect for eating liquids like soup!"
    },
    {
      id: "everyday7",
      question: "What do you use to cut paper?",
      answers: ["Glue", "Scissors", "Tape", "Stapler"],
      correct: 1,
      category: "everyday",
      difficulty: 1,
      funFact: "Scissors have two sharp blades that cut when you squeeze them!"
    },
    {
      id: "everyday8",
      question: "What do you wear when it rains?",
      answers: ["Sunglasses", "Raincoat", "Swimsuit", "Shorts"],
      correct: 1,
      category: "everyday",
      difficulty: 1,
      funFact: "Raincoats keep you dry in the rain!"
    },
    {
      id: "everyday9",
      question: "What do you use to call someone?",
      answers: ["Banana", "Phone", "Rock", "Book"],
      correct: 1,
      category: "everyday",
      difficulty: 1,
      funFact: "Phones let you talk to people far away!"
    },
    {
      id: "everyday10",
      question: "What do you ride in a car?",
      answers: ["On the roof", "In a seat", "In the trunk", "On the hood"],
      correct: 1,
      category: "everyday",
      difficulty: 1,
      funFact: "Car seats have seat belts to keep you safe!"
    },

    // Food Category - Expanded
    {
      id: "food1",
      question: "What fruit is yellow and curved?",
      answers: ["Apple", "Banana", "Orange", "Grape"],
      correct: 1,
      category: "food",
      difficulty: 1,
      funFact: "Bananas are berries, but strawberries aren't!"
    },
    {
      id: "food2",
      question: "What do you get from cows?",
      answers: ["Orange juice", "Apple juice", "Milk", "Water"],
      correct: 2,
      category: "food",
      difficulty: 1,
      funFact: "Cows produce about 6-7 gallons of milk per day!"
    },
    {
      id: "food3",
      question: "What food do you eat for breakfast?",
      answers: ["Pizza", "Cereal", "Burger", "Tacos"],
      correct: 1,
      category: "food",
      difficulty: 1,
      funFact: "Breakfast gives you energy for the whole day!"
    },
    {
      id: "food4",
      question: "What vegetable makes you cry when you cut it?",
      answers: ["Carrot", "Potato", "Onion", "Tomato"],
      correct: 2,
      category: "food",
      difficulty: 2,
      funFact: "Onions make you cry because of sulfur compounds!"
    },
    {
      id: "food5",
      question: "What fruit is red and round?",
      answers: ["Banana", "Apple", "Grape", "Lemon"],
      correct: 1,
      category: "food",
      difficulty: 1,
      funFact: "Apples float in water because they're 25% air!"
    },
    {
      id: "food6",
      question: "What do you bake in the oven to make bread rise?",
      answers: ["Ice", "Flour", "Yeast", "Sugar"],
      correct: 2,
      category: "food",
      difficulty: 3,
      explanation: "Yeast is a living organism that makes bread rise!"
    },
    {
      id: "food7",
      question: "What food do penguins eat?",
      answers: ["Pizza", "Fish", "Ice cream", "Bread"],
      correct: 1,
      category: "food",
      difficulty: 2,
      funFact: "Penguins eat fish, krill, and squid!"
    },
    {
      id: "food8",
      question: "What vegetable is orange and good for your eyes?",
      answers: ["Broccoli", "Carrot", "Potato", "Corn"],
      correct: 1,
      category: "food",
      difficulty: 1,
      funFact: "Carrots have vitamin A which helps your eyes!"
    },
    {
      id: "food9",
      question: "What food comes from bees?",
      answers: ["Cheese", "Honey", "Milk", "Bread"],
      correct: 1,
      category: "food",
      difficulty: 2,
      funFact: "Bees visit about 2 million flowers to make 1 pound of honey!"
    },
    {
      id: "food10",
      question: "What fruit grows on trees and is fuzzy?",
      answers: ["Apple", "Peach", "Grape", "Strawberry"],
      correct: 1,
      category: "food",
      difficulty: 2,
      funFact: "Peaches are members of the rose family!"
    },

    // Science Category - Expanded
    {
      id: "science1",
      question: "What planet do we live on?",
      answers: ["Mars", "Jupiter", "Earth", "Venus"],
      correct: 2,
      category: "science",
      difficulty: 1,
      funFact: "Earth is the only planet known to have life!"
    },
    {
      id: "science2",
      question: "What is the sun?",
      answers: ["Planet", "Moon", "Star", "Comet"],
      correct: 2,
      category: "science",
      difficulty: 2,
      funFact: "The sun is so big that 1 million Earths could fit inside it!"
    },
    {
      id: "science3",
      question: "What do plants need to grow?",
      answers: ["Candy", "Water", "Soda", "Juice"],
      correct: 1,
      category: "science",
      difficulty: 1,
      funFact: "Plants also need sunlight and air to grow!"
    },
    {
      id: "science4",
      question: "What falls from the sky when it rains?",
      answers: ["Snow", "Rain", "Sun", "Wind"],
      correct: 1,
      category: "science",
      difficulty: 1,
      funFact: "Rain is water that falls from clouds!"
    },
    {
      id: "science5",
      question: "How many seasons are there?",
      answers: ["2", "3", "4", "5"],
      correct: 2,
      category: "science",
      difficulty: 2,
      funFact: "The seasons are spring, summer, fall, and winter!"
    },
    {
      id: "science6",
      question: "What is the largest ocean on Earth?",
      answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
      category: "science",
      difficulty: 3,
      funFact: "The Pacific Ocean is bigger than all land areas combined!"
    },
    {
      id: "science7",
      question: "What do you breathe to stay alive?",
      answers: ["Water", "Food", "Air", "Candy"],
      correct: 2,
      category: "science",
      difficulty: 1,
      funFact: "Air contains oxygen that our bodies need!"
    },
    {
      id: "science8",
      question: "What is the closest star to Earth?",
      answers: ["Moon", "Sun", "Mars", "Jupiter"],
      correct: 1,
      category: "science",
      difficulty: 2,
      funFact: "The sun is 93 million miles away from Earth!"
    },
    {
      id: "science9",
      question: "What force keeps us on the ground?",
      answers: ["Magnetism", "Gravity", "Electricity", "Wind"],
      correct: 1,
      category: "science",
      difficulty: 3,
      funFact: "Gravity is what makes things fall down!"
    },
    {
      id: "science10",
      question: "What do you call water that falls from clouds?",
      answers: ["Snow", "Rain", "Hail", "All of the above"],
      correct: 3,
      category: "science",
      difficulty: 2,
      explanation: "Precipitation can be rain, snow, sleet, or hail!"
    },

    // Geography Category - New
    {
      id: "geography1",
      question: "What is the capital of the United States?",
      answers: ["New York", "Los Angeles", "Washington D.C.", "Chicago"],
      correct: 2,
      category: "geography",
      difficulty: 2,
      funFact: "Washington D.C. was named after George Washington!"
    },
    {
      id: "geography2",
      question: "What is the largest country in the world?",
      answers: ["China", "United States", "Russia", "Canada"],
      correct: 2,
      category: "geography",
      difficulty: 3,
      funFact: "Russia is so big it spans 11 time zones!"
    },
    {
      id: "geography3",
      question: "What is the tallest mountain in the world?",
      answers: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
      correct: 1,
      category: "geography",
      difficulty: 2,
      funFact: "Mount Everest is 29,029 feet tall!"
    },
    {
      id: "geography4",
      question: "What ocean is on the east coast of the United States?",
      answers: ["Pacific", "Atlantic", "Indian", "Arctic"],
      correct: 1,
      category: "geography",
      difficulty: 2,
      funFact: "The Atlantic Ocean is the second largest ocean!"
    },
    {
      id: "geography5",
      question: "What is the smallest country in the world?",
      answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correct: 1,
      category: "geography",
      difficulty: 3,
      funFact: "Vatican City is only 110 acres big!"
    },

    // Sports Category - New
    {
      id: "sports1",
      question: "How many players are on a basketball team?",
      answers: ["4", "5", "6", "7"],
      correct: 1,
      category: "sports",
      difficulty: 2,
      funFact: "Basketball was invented by Dr. James Naismith in 1891!"
    },
    {
      id: "sports2",
      question: "What sport uses a bat and ball?",
      answers: ["Football", "Basketball", "Baseball", "Soccer"],
      correct: 2,
      category: "sports",
      difficulty: 1,
      funFact: "Baseballs are thrown at speeds over 100 mph!"
    },
    {
      id: "sports3",
      question: "How many points is a touchdown worth in football?",
      answers: ["3", "6", "7", "10"],
      correct: 1,
      category: "sports",
      difficulty: 2,
      funFact: "Football evolved from rugby and soccer!"
    },
    {
      id: "sports4",
      question: "What do you call it when you get three strikes in baseball?",
      answers: ["Home run", "Strikeout", "Walk", "Double"],
      correct: 1,
      category: "sports",
      difficulty: 2,
      funFact: "A strikeout means the batter is out!"
    },
    {
      id: "sports5",
      question: "What sport is played on ice with skates?",
      answers: ["Basketball", "Hockey", "Tennis", "Golf"],
      correct: 1,
      category: "sports",
      difficulty: 1,
      funFact: "Hockey pucks can travel at speeds over 100 mph!"
    },

    // Music Category - New
    {
      id: "music1",
      question: "How many strings does a guitar usually have?",
      answers: ["4", "6", "8", "12"],
      correct: 1,
      category: "music",
      difficulty: 2,
      funFact: "The guitar is one of the oldest instruments in the world!"
    },
    {
      id: "music2",
      question: "What instrument has black and white keys?",
      answers: ["Guitar", "Drums", "Piano", "Trumpet"],
      correct: 2,
      category: "music",
      difficulty: 1,
      funFact: "A piano has 88 keys!"
    },
    {
      id: "music3",
      question: "How many strings are on a violin?",
      answers: ["3", "4", "5", "6"],
      correct: 1,
      category: "music",
      difficulty: 3,
      funFact: "Violins are made from over 70 pieces of wood!"
    },
    {
      id: "music4",
      question: "What do you call a person who writes music?",
      answers: ["Artist", "Composer", "Singer", "Dancer"],
      correct: 1,
      category: "music",
      difficulty: 2,
      funFact: "Composers write the music that musicians play!"
    },
    {
      id: "music5",
      question: "What instrument does a drummer play?",
      answers: ["Drums", "Piano", "Guitar", "Flute"],
      correct: 0,
      category: "music",
      difficulty: 1,
      funFact: "Drums are one of the oldest instruments known to humans!"
    },

    // Space Category - New
    {
      id: "space1",
      question: "What is the Earth's only natural satellite?",
      answers: ["Sun", "Moon", "Mars", "Venus"],
      correct: 1,
      category: "space",
      difficulty: 2,
      funFact: "The Moon is about 239,000 miles from Earth!"
    },
    {
      id: "space2",
      question: "How many planets are in our solar system?",
      answers: ["7", "8", "9", "10"],
      correct: 1,
      category: "space",
      difficulty: 2,
      funFact: "The planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune!"
    },
    {
      id: "space3",
      question: "What do you call a scientist who studies space?",
      answers: ["Biologist", "Astronomer", "Geologist", "Chemist"],
      correct: 1,
      category: "space",
      difficulty: 3,
      funFact: "Astronomers use telescopes to study stars and planets!"
    },
    {
      id: "space4",
      question: "What planet is known as the Red Planet?",
      answers: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      category: "space",
      difficulty: 1,
      funFact: "Mars is red because of iron oxide (rust) on its surface!"
    },
    {
      id: "space5",
      question: "What do you call a shooting star?",
      answers: ["Comet", "Meteor", "Asteroid", "Planet"],
      correct: 1,
      category: "space",
      difficulty: 2,
      funFact: "Shooting stars are actually meteors burning up in Earth's atmosphere!"
    },
  ];

  const startGame = () => {
    if (!selectedCategory || !selectedDifficulty) return;

    const filteredQuestions = triviaQuestions.filter(
      q => q.category === selectedCategory && q.difficulty <= selectedDifficulty
    );

    // Shuffle questions and take 10
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(10, shuffled.length));

    if (selectedQuestions.length === 0) {
      alert("No questions available for this category and difficulty!");
      return;
    }

    setGameQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setTimeLeft(30);
    setGameState('playing');
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQ = gameQuestions[currentQuestionIndex];
    const correct = answerIndex === currentQ.correct;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setQuestionsAnswered(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedbackMessage(`🎉 Correct! ${currentQ.funFact || currentQ.explanation || 'Great job!'}`);
      
      // Calculate rewards based on difficulty and streak
      const baseCoins = 2;
      const difficultyBonus = currentQ.difficulty;
      const streakBonus = Math.floor(streak / 3) * 2;
      const totalCoins = baseCoins + difficultyBonus + streakBonus;
      
      const baseXP = 10;
      const xpBonus = currentQ.difficulty * 5;
      const totalXP = baseXP + xpBonus;
      
      onUpdatePlayer({
        coins: playerData.coins + totalCoins,
        experience: Math.min(playerData.experienceToNext, playerData.experience + totalXP)
      });
    } else {
      setStreak(0);
      setFeedbackMessage(`😊 Nice try! The correct answer was: ${currentQ.answers[currentQ.correct]}`);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestionIndex < gameQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(30);
      } else {
        setGameState('completed');
      }
    }, 3000);
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setGameQuestions([]);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && !showFeedback && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      // Time's up - mark as incorrect
      handleAnswer(-1);
    }
    return () => clearTimeout(timer);
  }, [gameState, showFeedback, timeLeft]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-800">💎 Trivia Treasure</h1>
              <p className="text-lg text-blue-600">Choose your challenge and earn coins!</p>
            </div>
            <Button onClick={onBack} variant="outline" className="bg-white/80">
              ← Back to Hub
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Choose Category</CardTitle>
                <CardDescription>Select a topic you want to be quizzed on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center ${category.color} border-2 ${
                        selectedCategory === category.id ? "border-blue-500" : "border-transparent"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <div className="text-sm font-medium">{category.name}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Choose Difficulty</CardTitle>
                <CardDescription>Select how challenging you want the questions to be</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty.level}
                      variant={selectedDifficulty === difficulty.level ? "default" : "outline"}
                      className={`w-full justify-start ${difficulty.color} border-2 ${
                        selectedDifficulty === difficulty.level ? "border-blue-500" : "border-transparent"
                      }`}
                      onClick={() => setSelectedDifficulty(difficulty.level)}
                    >
                      <div className="text-lg mr-3">{difficulty.icon}</div>
                      <div className="text-left">
                        <div className="font-medium">{difficulty.name}</div>
                        <div className="text-xs opacity-75">
                          {difficulty.level === 1 && "Perfect for beginners"}
                          {difficulty.level === 2 && "A little challenging"}
                          {difficulty.level === 3 && "Getting tricky"}
                          {difficulty.level === 4 && "For experts"}
                          {difficulty.level === 5 && "Ultimate challenge"}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start Button */}
          <div className="text-center mt-6">
            <Button
              onClick={startGame}
              disabled={!selectedCategory || !selectedDifficulty}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
            >
              Start Trivia Challenge! 🚀
            </Button>
          </div>

          {/* Stats Preview */}
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">🪙 {playerData.coins}</div>
                  <div className="text-sm text-gray-600">Coins</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">Level {playerData.level}</div>
                  <div className="text-sm text-gray-600">Player Level</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {playerData.experience}/{playerData.experienceToNext} XP
                  </div>
                  <Progress value={(playerData.experience / playerData.experienceToNext) * 100} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const currentQ = gameQuestions[currentQuestionIndex];
    const category = categories.find(c => c.id === currentQ.category);
    const difficulty = difficulties.find(d => d.level === currentQ.difficulty);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-800">💎 Trivia Treasure</h1>
              <p className="text-lg text-blue-600">Question {currentQuestionIndex + 1} of {gameQuestions.length}</p>
            </div>
            <Button onClick={resetGame} variant="outline" className="bg-white/80">
              ← Exit
            </Button>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-xs text-gray-600">Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-orange-600">🔥 {streak}</div>
                <div className="text-xs text-gray-600">Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">⏱️ {timeLeft}s</div>
                <div className="text-xs text-gray-600">Time Left</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {questionsAnswered}/{gameQuestions.length}
                </div>
                <div className="text-xs text-gray-600">Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Question Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge className={`${category?.color || 'bg-gray-100'} text-gray-800`}>
                      {category?.icon} {category?.name}
                    </Badge>
                    <Badge className={`${difficulty?.color || 'bg-gray-100'} text-gray-800`}>
                      {difficulty?.icon} {difficulty?.name}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-blue-800">{currentQ.question}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!showFeedback ? (
                <div className="space-y-3">
                  {currentQ.answers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 hover:bg-blue-50 border-blue-200"
                      onClick={() => handleAnswer(index)}
                      disabled={showFeedback}
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {answer}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className={`text-center p-6 rounded-lg ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="text-4xl mb-2">
                    {isCorrect ? '🎉' : '😊'}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {isCorrect ? 'Correct!' : 'Nice Try!'}
                  </div>
                  <div className="text-sm">
                    {feedbackMessage}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const percentage = Math.round((score / gameQuestions.length) * 100);
    let message = "";
    let emoji = "";

    if (percentage >= 90) {
      message = "Outstanding! You're a trivia master!";
      emoji = "🏆";
    } else if (percentage >= 70) {
      message = "Great job! You know your stuff!";
      emoji = "🌟";
    } else if (percentage >= 50) {
      message = "Good effort! Keep learning!";
      emoji = "👍";
    } else {
      message = "Nice try! Practice makes perfect!";
      emoji = "📚";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-800">💎 Trivia Treasure</h1>
              <p className="text-lg text-blue-600">Challenge Complete!</p>
            </div>
            <Button onClick={resetGame} variant="outline" className="bg-white/80">
              ← Back to Menu
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{emoji}</div>
              <h2 className="text-3xl font-bold text-blue-800 mb-2">{message}</h2>
              <div className="text-5xl font-bold text-blue-600 mb-4">
                {score}/{gameQuestions.length}
              </div>
              <div className="text-xl text-gray-600 mb-6">
                {percentage}% Correct
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-yellow-100 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-800">🪙 +{score * 3}</div>
                    <div className="text-sm text-yellow-700">Coins Earned</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-100 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-800">✨ +{score * 15}</div>
                    <div className="text-sm text-green-700">Experience Gained</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-100 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-800">🔥 {streak}</div>
                    <div className="text-sm text-purple-700">Best Streak</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={resetGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg w-full"
                >
                  Play Again 🎮
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full"
                >
                  Back to Hub 🏠
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}