"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SpanishLesson {
  id: string;
  spanishWord: string;
  englishWord: string;
  category: string;
  emoji: string;
  pronunciation?: string;
  difficulty: number;
  exampleSentence?: string;
  exampleTranslation?: string;
  audioUrl?: string;
}

interface PlayerData {
  coins: number;
  experience: number;
  experienceToNext: number;
  level: number;
}

interface SpanishFiestaProps {
  onBack: () => void;
  playerData: PlayerData;
  onUpdatePlayer: (newData: Partial<PlayerData>) => void;
}

interface MiniGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export default function SpanishFiesta({ onBack, playerData, onUpdatePlayer }: SpanishFiestaProps) {
  const [gameState, setGameState] = useState<'menu' | 'wordMatch' | 'balloonPop' | 'sentenceBuilder' | 'listening' | 'completed'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMiniGame, setSelectedMiniGame] = useState<string | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameLessons, setGameLessons] = useState<SpanishLesson[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);

  const categories = [
    { id: "animals", name: "Animals", icon: "🐾", color: "bg-green-100" },
    { id: "colors", name: "Colors", icon: "🌈", color: "bg-purple-100" },
    { id: "numbers", name: "Numbers", icon: "🔢", color: "bg-blue-100" },
    { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦", color: "bg-yellow-100" },
    { id: "food", name: "Food", icon: "🍎", color: "bg-red-100" },
    { id: "clothes", name: "Clothes", icon: "👕", color: "bg-indigo-100" },
    { id: "home", name: "Home", icon: "🏠", color: "bg-orange-100" },
    { id: "school", name: "School", icon: "📚", color: "bg-pink-100" },
  ];

  const miniGames: MiniGame[] = [
    {
      id: "wordMatch",
      name: "Word Match",
      description: "Match Spanish words to English translations",
      icon: "🔤",
      color: "bg-blue-100",
      unlocked: true,
    },
    {
      id: "balloonPop",
      name: "Balloon Pop",
      description: "Pop balloons with the correct Spanish words",
      icon: "🎈",
      color: "bg-red-100",
      unlocked: true,
    },
    {
      id: "sentenceBuilder",
      name: "Sentence Builder",
      description: "Build sentences using Spanish words you've learned",
      icon: "📝",
      color: "bg-green-100",
      unlocked: false,
    },
    {
      id: "listening",
      name: "Listening Game",
      description: "Listen and identify the correct Spanish word",
      icon: "👂",
      color: "bg-purple-100",
      unlocked: false,
    },
  ];

  const spanishLessons: SpanishLesson[] = [
    // Animals
    {
      id: "perro",
      spanishWord: "Perro",
      englishWord: "Dog",
      category: "animals",
      emoji: "🐕",
      pronunciation: "PEH-roh",
      difficulty: 1,
      exampleSentence: "El perro es mi mejor amigo.",
      exampleTranslation: "The dog is my best friend.",
    },
    {
      id: "gato",
      spanishWord: "Gato",
      englishWord: "Cat",
      category: "animals",
      emoji: "🐱",
      pronunciation: "GAH-toh",
      difficulty: 1,
      exampleSentence: "El gato duerme mucho.",
      exampleTranslation: "The cat sleeps a lot.",
    },
    {
      id: "pájaro",
      spanishWord: "Pájaro",
      englishWord: "Bird",
      category: "animals",
      emoji: "🐦",
      pronunciation: "PAH-hah-roh",
      difficulty: 2,
      exampleSentence: "El pájaro vuela alto.",
      exampleTranslation: "The bird flies high.",
    },
    {
      id: "conejo",
      spanishWord: "Conejo",
      englishWord: "Rabbit",
      category: "animals",
      emoji: "🐰",
      pronunciation: "koh-NEH-hoh",
      difficulty: 2,
      exampleSentence: "El conejo salta en el jardín.",
      exampleTranslation: "The rabbit jumps in the garden.",
    },
    {
      id: "pez",
      spanishWord: "Pez",
      englishWord: "Fish",
      category: "animals",
      emoji: "🐠",
      pronunciation: "pehs",
      difficulty: 1,
      exampleSentence: "El pez nada en el agua.",
      exampleTranslation: "The fish swims in the water.",
    },
    {
      id: "vaca",
      spanishWord: "Vaca",
      englishWord: "Cow",
      category: "animals",
      emoji: "🐄",
      pronunciation: "BAH-kah",
      difficulty: 1,
      exampleSentence: "La vaca come hierba.",
      exampleTranslation: "The cow eats grass.",
    },
    {
      id: "caballo",
      spanishWord: "Caballo",
      englishWord: "Horse",
      category: "animals",
      emoji: "🐴",
      pronunciation: "kah-BAH-yoh",
      difficulty: 2,
      exampleSentence: "El caballo corre rápido.",
      exampleTranslation: "The horse runs fast.",
    },
    {
      id: "elefante",
      spanishWord: "Elefante",
      englishWord: "Elephant",
      category: "animals",
      emoji: "🐘",
      pronunciation: "eh-leh-FAHN-teh",
      difficulty: 3,
      exampleSentence: "El elefante tiene una trompa larga.",
      exampleTranslation: "The elephant has a long trunk.",
    },

    // Colors
    {
      id: "rojo",
      spanishWord: "Rojo",
      englishWord: "Red",
      category: "colors",
      emoji: "🔴",
      pronunciation: "ROH-hoh",
      difficulty: 1,
      exampleSentence: "La manzana es roja.",
      exampleTranslation: "The apple is red.",
    },
    {
      id: "azul",
      spanishWord: "Azul",
      englishWord: "Blue",
      category: "colors",
      emoji: "🔵",
      pronunciation: "ah-SOOL",
      difficulty: 1,
      exampleSentence: "El cielo es azul.",
      exampleTranslation: "The sky is blue.",
    },
    {
      id: "verde",
      spanishWord: "Verde",
      englishWord: "Green",
      category: "colors",
      emoji: "🟢",
      pronunciation: "VEHR-deh",
      difficulty: 1,
      exampleSentence: "La hierba es verde.",
      exampleTranslation: "The grass is green.",
    },
    {
      id: "amarillo",
      spanishWord: "Amarillo",
      englishWord: "Yellow",
      category: "colors",
      emoji: "🟡",
      pronunciation: "ah-mah-REE-yoh",
      difficulty: 2,
      exampleSentence: "El sol es amarillo.",
      exampleTranslation: "The sun is yellow.",
    },
    {
      id: "morado",
      spanishWord: "Morado",
      englishWord: "Purple",
      category: "colors",
      emoji: "🟣",
      pronunciation: "moh-RAH-doh",
      difficulty: 2,
      exampleSentence: "Las uvas son moradas.",
      exampleTranslation: "The grapes are purple.",
    },
    {
      id: "naranja",
      spanishWord: "Naranja",
      englishWord: "Orange",
      category: "colors",
      emoji: "🟠",
      pronunciation: "nah-RAHN-hah",
      difficulty: 2,
      exampleSentence: "La naranja es dulce.",
      exampleTranslation: "The orange is sweet.",
    },
    {
      id: "blanco",
      spanishWord: "Blanco",
      englishWord: "White",
      category: "colors",
      emoji: "⚪",
      pronunciation: "BLAHN-koh",
      difficulty: 1,
      exampleSentence: "La nieve es blanca.",
      exampleTranslation: "The snow is white.",
    },
    {
      id: "negro",
      spanishWord: "Negro",
      englishWord: "Black",
      category: "colors",
      emoji: "⚫",
      pronunciation: "NEH-groh",
      difficulty: 1,
      exampleSentence: "La noche es negra.",
      exampleTranslation: "The night is black.",
    },

    // Numbers
    {
      id: "uno",
      spanishWord: "Uno",
      englishWord: "One",
      category: "numbers",
      emoji: "1️⃣",
      pronunciation: "OO-noh",
      difficulty: 1,
      exampleSentence: "Tengo un perro.",
      exampleTranslation: "I have one dog.",
    },
    {
      id: "dos",
      spanishWord: "Dos",
      englishWord: "Two",
      category: "numbers",
      emoji: "2️⃣",
      pronunciation: "dohs",
      difficulty: 1,
      exampleSentence: "Dos gatos juegan.",
      exampleTranslation: "Two cats play.",
    },
    {
      id: "tres",
      spanishWord: "Tres",
      englishWord: "Three",
      category: "numbers",
      emoji: "3️⃣",
      pronunciation: "trehs",
      difficulty: 1,
      exampleSentence: "Tres pájaros cantan.",
      exampleTranslation: "Three birds sing.",
    },
    {
      id: "cuatro",
      spanishWord: "Cuatro",
      englishWord: "Four",
      category: "numbers",
      emoji: "4️⃣",
      pronunciation: "KWAH-troh",
      difficulty: 2,
      exampleSentence: "Cuatro flores bonitas.",
      exampleTranslation: "Four beautiful flowers.",
    },
    {
      id: "cinco",
      spanishWord: "Cinco",
      englishWord: "Five",
      category: "numbers",
      emoji: "5️⃣",
      pronunciation: "SEEN-koh",
      difficulty: 2,
      exampleSentence: "Cinco dedos en la mano.",
      exampleTranslation: "Five fingers on the hand.",
    },
    {
      id: "seis",
      spanishWord: "Seis",
      englishWord: "Six",
      category: "numbers",
      emoji: "6️⃣",
      pronunciation: "sehs",
      difficulty: 2,
      exampleSentence: "Seis huevos en la caja.",
      exampleTranslation: "Six eggs in the box.",
    },
    {
      id: "siete",
      spanishWord: "Siete",
      englishWord: "Seven",
      category: "numbers",
      emoji: "7️⃣",
      pronunciation: "see-EH-teh",
      difficulty: 3,
      exampleSentence: "Siete días en una semana.",
      exampleTranslation: "Seven days in a week.",
    },
    {
      id: "ocho",
      spanishWord: "Ocho",
      englishWord: "Eight",
      category: "numbers",
      emoji: "8️⃣",
      pronunciation: "OH-choh",
      difficulty: 3,
      exampleSentence: "Ocho años de edad.",
      exampleTranslation: "Eight years old.",
    },

    // Family
    {
      id: "madre",
      spanishWord: "Madre",
      englishWord: "Mother",
      category: "family",
      emoji: "👩",
      pronunciation: "MAH-dreh",
      difficulty: 1,
      exampleSentence: "Mi madre me ama.",
      exampleTranslation: "My mother loves me.",
    },
    {
      id: "padre",
      spanishWord: "Padre",
      englishWord: "Father",
      category: "family",
      emoji: "👨",
      pronunciation: "PAH-dreh",
      difficulty: 1,
      exampleSentence: "Mi padre trabaja mucho.",
      exampleTranslation: "My father works a lot.",
    },
    {
      id: "hermano",
      spanishWord: "Hermano",
      englishWord: "Brother",
      category: "family",
      emoji: "👦",
      pronunciation: "ehr-MAH-noh",
      difficulty: 2,
      exampleSentence: "Mi hermano juega fútbol.",
      exampleTranslation: "My brother plays soccer.",
    },
    {
      id: "hermana",
      spanishWord: "Hermana",
      englishWord: "Sister",
      category: "family",
      emoji: "👧",
      pronunciation: "ehr-MAH-nah",
      difficulty: 2,
      exampleSentence: "Mi hermana lee libros.",
      exampleTranslation: "My sister reads books.",
    },
    {
      id: "abuela",
      spanishWord: "Abuela",
      englishWord: "Grandmother",
      category: "family",
      emoji: "👵",
      pronunciation: "ah-BWEH-lah",
      difficulty: 2,
      exampleSentence: "La abuela cocina delicioso.",
      exampleTranslation: "Grandmother cooks deliciously.",
    },
    {
      id: "abuelo",
      spanishWord: "Abuelo",
      englishWord: "Grandfather",
      category: "family",
      emoji: "👴",
      pronunciation: "ah-BWEH-loh",
      difficulty: 2,
      exampleSentence: "El abuelo cuenta historias.",
      exampleTranslation: "Grandfather tells stories.",
    },

    // Food
    {
      id: "manzana",
      spanishWord: "Manzana",
      englishWord: "Apple",
      category: "food",
      emoji: "🍎",
      pronunciation: "mahn-ZAH-nah",
      difficulty: 1,
      exampleSentence: "La manzana es roja y dulce.",
      exampleTranslation: "The apple is red and sweet.",
    },
    {
      id: "pan",
      spanishWord: "Pan",
      englishWord: "Bread",
      category: "food",
      emoji: "🍞",
      pronunciation: "pahn",
      difficulty: 1,
      exampleSentence: "Como pan con mantequilla.",
      exampleTranslation: "I eat bread with butter.",
    },
    {
      id: "leche",
      spanishWord: "Leche",
      englishWord: "Milk",
      category: "food",
      emoji: "🥛",
      pronunciation: "LEH-cheh",
      difficulty: 1,
      exampleSentence: "Bebo leche todas las mañanas.",
      exampleTranslation: "I drink milk every morning.",
    },
    {
      id: "agua",
      spanishWord: "Agua",
      englishWord: "Water",
      category: "food",
      emoji: "💧",
      pronunciation: "AH-gwah",
      difficulty: 1,
      exampleSentence: "El agua es importante para la vida.",
      exampleTranslation: "Water is important for life.",
    },
    {
      id: "queso",
      spanishWord: "Queso",
      englishWord: "Cheese",
      category: "food",
      emoji: "🧀",
      pronunciation: "KEH-soh",
      difficulty: 2,
      exampleSentence: "Me gusta el queso en la pizza.",
      exampleTranslation: "I like cheese on pizza.",
    },
    {
      id: "huevo",
      spanishWord: "Huevo",
      englishWord: "Egg",
      category: "food",
      emoji: "🥚",
      pronunciation: "WEH-voh",
      difficulty: 2,
      exampleSentence: "Desayuno huevos con jamón.",
      exampleTranslation: "I eat eggs with ham for breakfast.",
    },

    // Clothes
    {
      id: "camisa",
      spanishWord: "Camisa",
      englishWord: "Shirt",
      category: "clothes",
      emoji: "👔",
      pronunciation: "kah-MEE-sah",
      difficulty: 2,
      exampleSentence: "Llevo una camisa azul.",
      exampleTranslation: "I wear a blue shirt.",
    },
    {
      id: "pantalones",
      spanishWord: "Pantalones",
      englishWord: "Pants",
      category: "clothes",
      emoji: "👖",
      pronunciation: "pahn-tah-LOH-nehs",
      difficulty: 3,
      exampleSentence: "Mis pantalones son cómodos.",
      exampleTranslation: "My pants are comfortable.",
    },
    {
      id: "zapatos",
      spanishWord: "Zapatos",
      englishWord: "Shoes",
      category: "clothes",
      emoji: "👟",
      pronunciation: "sah-PAH-tohs",
      difficulty: 2,
      exampleSentence: "Tengo zapatos nuevos.",
      exampleTranslation: "I have new shoes.",
    },
    {
      id: "sombrero",
      spanishWord: "Sombrero",
      englishWord: "Hat",
      category: "clothes",
      emoji: "👒",
      pronunciation: "sohm-BREH-roh",
      difficulty: 3,
      exampleSentence: "El sombrero protege del sol.",
      exampleTranslation: "The hat protects from the sun.",
    },

    // Home
    {
      id: "casa",
      spanishWord: "Casa",
      englishWord: "House",
      category: "home",
      emoji: "🏠",
      pronunciation: "KAH-sah",
      difficulty: 1,
      exampleSentence: "Mi casa es grande y bonita.",
      exampleTranslation: "My house is big and beautiful.",
    },
    {
      id: "puerta",
      spanishWord: "Puerta",
      englishWord: "Door",
      category: "home",
      emoji: "🚪",
      pronunciation: "PWEHR-tah",
      difficulty: 2,
      exampleSentence: "La puerta está cerrada.",
      exampleTranslation: "The door is closed.",
    },
    {
      id: "ventana",
      spanishWord: "Ventana",
      englishWord: "Window",
      category: "home",
      emoji: "🪟",
      pronunciation: "vehn-TAH-nah",
      difficulty: 3,
      exampleSentence: "La ventana da al jardín.",
      exampleTranslation: "The window faces the garden.",
    },
    {
      id: "mesa",
      spanishWord: "Mesa",
      englishWord: "Table",
      category: "home",
      emoji: "🪑",
      pronunciation: "MEH-sah",
      difficulty: 1,
      exampleSentence: "Comemos en la mesa.",
      exampleTranslation: "We eat at the table.",
    },

    // School
    {
      id: "escuela",
      spanishWord: "Escuela",
      englishWord: "School",
      category: "school",
      emoji: "🏫",
      pronunciation: "ehs-KWEH-lah",
      difficulty: 1,
      exampleSentence: "Voy a la escuela todos los días.",
      exampleTranslation: "I go to school every day.",
    },
    {
      id: "libro",
      spanishWord: "Libro",
      englishWord: "Book",
      category: "school",
      emoji: "📚",
      pronunciation: "LEE-broh",
      difficulty: 1,
      exampleSentence: "Leo un libro interesante.",
      exampleTranslation: "I read an interesting book.",
    },
    {
      id: "lápiz",
      spanishWord: "Lápiz",
      englishWord: "Pencil",
      category: "school",
      emoji: "✏️",
      pronunciation: "LAH-peeth",
      difficulty: 2,
      exampleSentence: "Escribo con un lápiz.",
      exampleTranslation: "I write with a pencil.",
    },
    {
      id: "maestro",
      spanishWord: "Maestro",
      englishWord: "Teacher",
      category: "school",
      emoji: "👨‍🏫",
      pronunciation: "mah-EHS-troh",
      difficulty: 2,
      exampleSentence: "El maestro es amable.",
      exampleTranslation: "The teacher is kind.",
    },
  ];

  const startMiniGame = (miniGameId: string) => {
    if (!selectedCategory) return;

    const filteredLessons = spanishLessons.filter(lesson => lesson.category === selectedCategory);
    const shuffled = [...filteredLessons].sort(() => Math.random() - 0.5);
    const selectedLessons = shuffled.slice(0, Math.min(8, shuffled.length));

    if (selectedLessons.length === 0) {
      alert("No lessons available for this category!");
      return;
    }

    setGameLessons(selectedLessons);
    setCurrentLessonIndex(0);
    setScore(0);
    setStars(0);
    setLessonsCompleted(0);
    setStreak(0);
    setTimeLeft(60);
    setUserAnswers([]);
    setGameState(miniGameId as any);
  };

  const handleWordMatchAnswer = (englishWord: string) => {
    const currentLesson = gameLessons[currentLessonIndex];
    const correct = englishWord === currentLesson.englishWord;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setLessonsCompleted(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
      setStars(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedbackMessage(`🎉 Correct! ${currentLesson.spanishWord} means ${currentLesson.englishWord}!`);
      
      // Calculate rewards
      const baseCoins = 3;
      const difficultyBonus = currentLesson.difficulty;
      const streakBonus = Math.floor(streak / 3) * 2;
      const totalCoins = baseCoins + difficultyBonus + streakBonus;
      
      const baseXP = 15;
      const xpBonus = currentLesson.difficulty * 8;
      const totalXP = baseXP + xpBonus;
      
      onUpdatePlayer({
        coins: playerData.coins + totalCoins,
        experience: Math.min(playerData.experienceToNext, playerData.experience + totalXP)
      });
    } else {
      setStreak(0);
      setFeedbackMessage(`😊 Nice try! ${currentLesson.spanishWord} means ${currentLesson.englishWord}.`);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentLessonIndex < gameLessons.length - 1) {
        setCurrentLessonIndex(prev => prev + 1);
      } else {
        setGameState('completed');
      }
    }, 2500);
  };

  const handleBalloonPopAnswer = (spanishWord: string) => {
    const currentLesson = gameLessons[currentLessonIndex];
    const correct = spanishWord === currentLesson.spanishWord;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    setLessonsCompleted(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
      setStars(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedbackMessage(`🎈 Pop! Correct! ${currentLesson.spanishWord} means ${currentLesson.englishWord}!`);
      
      // Calculate rewards
      const baseCoins = 3;
      const difficultyBonus = currentLesson.difficulty;
      const streakBonus = Math.floor(streak / 3) * 2;
      const totalCoins = baseCoins + difficultyBonus + streakBonus;
      
      const baseXP = 15;
      const xpBonus = currentLesson.difficulty * 8;
      const totalXP = baseXP + xpBonus;
      
      onUpdatePlayer({
        coins: playerData.coins + totalCoins,
        experience: Math.min(playerData.experienceToNext, playerData.experience + totalXP)
      });
    } else {
      setStreak(0);
      setFeedbackMessage(`💥 Oops! ${currentLesson.spanishWord} means ${currentLesson.englishWord}.`);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentLessonIndex < gameLessons.length - 1) {
        setCurrentLessonIndex(prev => prev + 1);
      } else {
        setGameState('completed');
      }
    }, 2500);
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedCategory(null);
    setSelectedMiniGame(null);
    setGameLessons([]);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState !== 'menu' && gameState !== 'completed' && !showFeedback && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState !== 'menu' && gameState !== 'completed') {
      // Time's up - go to completion
      setGameState('completed');
    }
    return () => clearTimeout(timer);
  }, [gameState, showFeedback, timeLeft]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-orange-800">🎉 Spanish Fiesta</h1>
              <p className="text-lg text-orange-600">Learn Spanish with KK and Hailey!</p>
            </div>
            <Button onClick={onBack} variant="outline" className="bg-white/80">
              ← Back to Hub
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700">Choose Category</CardTitle>
                <CardDescription>Select what you want to learn about</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center ${category.color} border-2 ${
                        selectedCategory === category.id ? "border-orange-500" : "border-transparent"
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

            {/* Mini Game Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700">Choose Game</CardTitle>
                <CardDescription>Pick how you want to learn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {miniGames.map((game) => (
                    <Button
                      key={game.id}
                      variant={selectedMiniGame === game.id ? "default" : "outline"}
                      className={`w-full justify-start ${game.color} border-2 ${
                        selectedMiniGame === game.id ? "border-orange-500" : "border-transparent"
                      }`}
                      onClick={() => setSelectedMiniGame(game.id)}
                      disabled={!game.unlocked || !selectedCategory}
                    >
                      <div className="text-lg mr-3">{game.icon}</div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{game.name}</div>
                        <div className="text-xs opacity-75">{game.description}</div>
                      </div>
                      {!game.unlocked && (
                        <div className="text-xs">🔒</div>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Start Button */}
          <div className="text-center mt-6">
            <Button
              onClick={() => startMiniGame(selectedMiniGame!)}
              disabled={!selectedCategory || !selectedMiniGame}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
            >
              Start Spanish Adventure! 🚀
            </Button>
          </div>

          {/* Stats Preview */}
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-700">Your Progress</CardTitle>
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

  if (gameState === 'wordMatch') {
    const currentLesson = gameLessons[currentLessonIndex];
    const category = categories.find(c => c.id === selectedCategory);
    
    // Generate wrong answers
    const wrongAnswers = [...spanishLessons]
      .filter(l => l.category === selectedCategory && l.englishWord !== currentLesson.englishWord)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(l => l.englishWord);
    
    const allAnswers = [currentLesson.englishWord, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-800">🔤 Word Match</h1>
              <p className="text-lg text-blue-600">Match Spanish words to English!</p>
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
                <div className="text-2xl font-bold text-yellow-600">⭐ {stars}</div>
                <div className="text-xs text-gray-600">Stars</div>
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
                  {currentLessonIndex + 1}/{gameLessons.length}
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
                  <Badge className={`${category?.color || 'bg-gray-100'} text-gray-800 mb-2`}>
                    {category?.icon} {category?.name}
                  </Badge>
                  <CardTitle className="text-2xl text-blue-800 text-center">
                    What does "{currentLesson.spanishWord}" mean?
                  </CardTitle>
                  <div className="text-center text-gray-600 mt-2">
                    {currentLesson.pronunciation && (
                      <div>Pronunciation: /{currentLesson.pronunciation}/</div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">{currentLesson.emoji}</div>
              </div>
              
              {!showFeedback ? (
                <div className="space-y-3">
                  {allAnswers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4 hover:bg-blue-50 border-blue-200"
                      onClick={() => handleWordMatchAnswer(answer)}
                      disabled={showFeedback}
                    >
                      <span className="font-medium">{answer}</span>
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
                  <div className="text-sm mb-2">
                    {feedbackMessage}
                  </div>
                  {currentLesson.exampleSentence && (
                    <div className="text-xs mt-2 italic">
                      Example: "{currentLesson.exampleSentence}"
                      <br />
                      {currentLesson.exampleTranslation}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'balloonPop') {
    const currentLesson = gameLessons[currentLessonIndex];
    const category = categories.find(c => c.id === selectedCategory);
    
    // Generate wrong answers
    const wrongAnswers = [...spanishLessons]
      .filter(l => l.category === selectedCategory && l.spanishWord !== currentLesson.spanishWord)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(l => l.spanishWord);
    
    const allAnswers = [currentLesson.spanishWord, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-50 to-purple-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-red-800">🎈 Balloon Pop</h1>
              <p className="text-lg text-red-600">Pop the balloon with the correct word!</p>
            </div>
            <Button onClick={resetGame} variant="outline" className="bg-white/80">
              ← Exit
            </Button>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm border-red-200">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{score}</div>
                <div className="text-xs text-gray-600">Score</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-red-200">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">⭐ {stars}</div>
                <div className="text-xs text-gray-600">Stars</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-red-200">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600">⏱️ {timeLeft}s</div>
                <div className="text-xs text-gray-600">Time Left</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-red-200">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {currentLessonIndex + 1}/{gameLessons.length}
                </div>
                <div className="text-xs text-gray-600">Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Question Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-red-200 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge className={`${category?.color || 'bg-gray-100'} text-gray-800 mb-2`}>
                    {category?.icon} {category?.name}
                  </Badge>
                  <CardTitle className="text-2xl text-red-800 text-center">
                    Which balloon says "{currentLesson.englishWord}"?
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">{currentLesson.emoji}</div>
                <div className="text-lg font-semibold text-gray-700">
                  {currentLesson.englishWord}
                </div>
                {currentLesson.pronunciation && (
                  <div className="text-sm text-gray-600">
                    Pronunciation: /{currentLesson.pronunciation}/
                  </div>
                )}
              </div>
              
              {!showFeedback ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allAnswers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center hover:bg-red-50 border-red-200 text-lg font-semibold"
                      onClick={() => handleBalloonPopAnswer(answer)}
                      disabled={showFeedback}
                    >
                      <div className="text-2xl mb-1">🎈</div>
                      <div>{answer}</div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className={`text-center p-6 rounded-lg ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="text-4xl mb-2">
                    {isCorrect ? '🎈' : '💥'}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {isCorrect ? 'Pop! Correct!' : 'Oops!'}
                  </div>
                  <div className="text-sm mb-2">
                    {feedbackMessage}
                  </div>
                  {currentLesson.exampleSentence && (
                    <div className="text-xs mt-2 italic">
                      Example: "{currentLesson.exampleSentence}"
                      <br />
                      {currentLesson.exampleTranslation}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    const percentage = Math.round((score / gameLessons.length) * 100);
    let message = "";
    let emoji = "";

    if (percentage >= 90) {
      message = "¡Excelente! You're a Spanish master!";
      emoji = "🏆";
    } else if (percentage >= 70) {
      message = "¡Muy bien! Great job learning Spanish!";
      emoji = "🌟";
    } else if (percentage >= 50) {
      message = "¡Buen trabajo! Keep practicing!";
      emoji = "👍";
    } else {
      message = "¡Buen intento! Practice makes perfect!";
      emoji = "📚";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-orange-800">🎉 Spanish Fiesta</h1>
              <p className="text-lg text-orange-600">Lesson Complete!</p>
            </div>
            <Button onClick={resetGame} variant="outline" className="bg-white/80">
              ← Back to Menu
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{emoji}</div>
              <h2 className="text-3xl font-bold text-orange-800 mb-2">{message}</h2>
              <div className="text-5xl font-bold text-orange-600 mb-4">
                {score}/{gameLessons.length}
              </div>
              <div className="text-xl text-gray-600 mb-6">
                {percentage}% Correct
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-yellow-100 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-800">🪙 +{score * 4}</div>
                    <div className="text-sm text-yellow-700">Coins Earned</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-100 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-800">✨ +{score * 20}</div>
                    <div className="text-sm text-green-700">Experience Gained</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-100 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-800">⭐ {stars}</div>
                    <div className="text-sm text-purple-700">Stars Earned</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={resetGame}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg w-full"
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