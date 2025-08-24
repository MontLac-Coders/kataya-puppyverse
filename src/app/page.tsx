"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TriviaTreasure from "@/components/TriviaTreasure";
import SpanishFiesta from "@/components/SpanishFiesta";
import { 
  saveGameData, 
  loadGameData, 
  autoSave, 
  hasGameData, 
  getLastSavedTime,
  isOffline,
  clearGameData,
  GameSaveData,
  defaultSettings,
  saveSettings,
  loadSettings
} from "@/lib/localStorage";
// PWA imports temporarily disabled
// import { 
//   setupInstallPrompt, 
//   installApp, 
//   canInstallApp, 
//   isAppInstalled 
// } from "@/lib/serviceWorker";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGameOffline, setIsGameOffline] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  // PWA state temporarily disabled
  // const [canInstall, setCanInstall] = useState(false);
  // const [isInstalled, setIsInstalled] = useState(false);
  // const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  
  // Default game data
  const defaultPlayerData = {
    name: "Kataya",
    level: 1,
    coins: 100,
    experience: 0,
    experienceToNext: 100,
    unlockedZones: ["yard"],
  };

  const defaultPuppies: GameSaveData['puppies'] = [
    { 
      id: "kk", 
      name: "KK", 
      personality: "energetic", 
      happiness: 100, 
      hunger: 80, 
      energy: 100,
      mood: "happy",
      animation: "idle",
      level: 1,
      experience: 0,
      ageStage: "baby",
      age: 0,
      skills: {
        fetch: 0,
        sit: 0,
        rollOver: 0,
        dance: 0,
        speak: 0,
        stay: 0,
      },
      accessories: [],
      favoriteToys: ["ball", "frisbee"],
      lastFed: null as string | null,
      lastPlayed: null as string | null,
    },
    { 
      id: "hailey", 
      name: "Hailey", 
      personality: "calm", 
      happiness: 100, 
      hunger: 80, 
      energy: 100,
      mood: "happy",
      animation: "idle",
      level: 1,
      experience: 0,
      ageStage: "baby",
      age: 0,
      skills: {
        fetch: 0,
        sit: 0,
        rollOver: 0,
        dance: 0,
        speak: 0,
        stay: 0,
      },
      accessories: [],
      favoriteToys: ["stuffed toy", "bone"],
      lastFed: null as string | null,
      lastPlayed: null as string | null,
    },
  ];

  const defaultInventory = [
    { id: "1", name: "Dog Food", type: "food", quantity: 10, rarity: "common" },
    { id: "2", name: "Treats", type: "food", quantity: 5, rarity: "common" },
    { id: "3", name: "Ball", type: "toy", quantity: 1, rarity: "common" },
    { id: "4", name: "Frisbee", type: "toy", quantity: 1, rarity: "rare" },
    { id: "5", name: "Red Collar", type: "clothing", quantity: 1, rarity: "common" },
    { id: "6", name: "Blue Bow", type: "clothing", quantity: 1, rarity: "rare" },
  ];

  const defaultGameStats = {
    triviaQuestionsAnswered: 0,
    triviaCorrectAnswers: 0,
    spanishWordsLearned: 0,
    spanishLessonsCompleted: 0,
    puppyInteractions: 0,
    puppyFeedings: 0,
    puppyPlaySessions: 0,
    totalPlayTime: 0,
    sessionsCompleted: 0,
  };

  const defaultZones = [
    { id: "yard", name: "Yard", description: "A sunny yard where puppies can play and run around", unlocked: true, icon: "🌳" },
    { id: "living-room", name: "Living Room", description: "Cozy indoor space for cuddling and relaxation", unlocked: false, icon: "🏠" },
    { id: "park", name: "Park", description: "Adventure playground with new friends and obstacles", unlocked: false, icon: "🌳" },
    { id: "playground", name: "Playground", description: "Ultimate fun zone with slides and swings", unlocked: false, icon: "🎪" },
  ];

  const [playerData, setPlayerData] = useState(defaultPlayerData);
  const [puppies, setPuppies] = useState(defaultPuppies);
  const [inventory, setInventory] = useState(defaultInventory);
  const [gameStats, setGameStats] = useState(defaultGameStats);
  const [zones, setZones] = useState(defaultZones);

  // Load game data from localStorage on component mount
  useEffect(() => {
    // Very short timeout to ensure loading completes quickly
    const timeout = setTimeout(() => {
      console.log('Timeout reached, forcing loading to complete');
      setIsLoading(false);
    }, 100);
    
    try {
      // Check if we're in the browser and localStorage is available
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.log('Not in browser or localStorage not available, starting new game');
        setIsLoading(false);
        return;
      }
      
      console.log('Attempting to load game data...');
      const savedData = loadGameData();
      console.log('Saved data result:', savedData);
      
      if (savedData) {
        setPlayerData(savedData.playerData);
        setPuppies(savedData.puppies);
        setInventory(savedData.inventory);
        setGameStats(savedData.gameStats);
        setZones(savedData.zones);
        setLastSaved(getLastSavedTime());
        console.log('Game loaded from localStorage successfully');
      } else {
        console.log('No saved game found, starting new game');
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
      // Don't block the game if localStorage fails
    } finally {
      console.log('Finally block - setting isLoading to false');
      setIsLoading(false);
    }

    // Check online/offline status - only in browser
    const handleOnlineStatus = () => {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        setIsGameOffline(!navigator.onLine);
      }
    };

    // Initial check
    handleOnlineStatus();

    // Listen for online/offline events - only in browser
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnlineStatus);
      window.addEventListener('offline', handleOnlineStatus);
    }

    return () => {
      clearTimeout(timeout);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnlineStatus);
        window.removeEventListener('offline', handleOnlineStatus);
      }
    };
  }, []);

  // Prevent hydration mismatch by only rendering game content after mount
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-save game data whenever important state changes
  useEffect(() => {
    if (isLoading) return;

    const gameData: GameSaveData = {
      playerData,
      puppies,
      inventory,
      gameStats,
      zones,
      lastSaved: new Date().toISOString(),
      version: '1.0.0',
    };

    // Auto-save with debounce
    autoSave(gameData);
    setLastSaved(new Date().toISOString());
  }, [playerData, puppies, inventory, gameStats, zones, isLoading]);

  // Auto-decrease puppy stats over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPuppies(prev => prev.map(puppy => {
        const newPuppy = { ...puppy };
        
        // Gradually decrease hunger and energy
        newPuppy.hunger = Math.max(0, newPuppy.hunger - 1);
        newPuppy.energy = Math.max(0, newPuppy.energy - 0.5);
        
        // Decrease happiness if needs aren't met
        if (newPuppy.hunger < 30 || newPuppy.energy < 30) {
          newPuppy.happiness = Math.max(0, newPuppy.happiness - 2);
        }
        
        // Update mood based on stats
        if (newPuppy.happiness >= 80) {
          newPuppy.mood = "happy";
        } else if (newPuppy.happiness >= 60) {
          newPuppy.mood = "content";
        } else if (newPuppy.happiness >= 40) {
          newPuppy.mood = "sad";
        } else {
          newPuppy.mood = "miserable";
        }
        
        return newPuppy;
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Show loading state until component is mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Loading Grand Puppyverse...</h2>
          <div className="w-64 h-2 bg-purple-200 rounded-full mx-auto">
            <div className="h-2 bg-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle app install (temporarily disabled)
  const handleInstallApp = async () => {
    // if (installPromptEvent) {
    //   const result = await installApp();
    //   if (result) {
    //     setIsInstalled(true);
    //     setCanInstall(false);
    //     setInstallPromptEvent(null);
    //   }
    // }
    console.log('Install app feature temporarily disabled');
  };

  // Manual save function
  const saveGame = () => {
    const gameData: GameSaveData = {
      playerData,
      puppies,
      inventory,
      gameStats,
      zones,
      lastSaved: new Date().toISOString(),
      version: '1.0.0',
    };

    const success = saveGameData(gameData);
    if (success) {
      setLastSaved(new Date().toISOString());
      alert('Game saved successfully!');
    } else {
      alert('Failed to save game. Please check your browser settings.');
    }
  };

  // Reset game function
  const resetGame = () => {
    if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
      if (clearGameData()) {
        setPlayerData(defaultPlayerData);
        setPuppies(defaultPuppies);
        setInventory(defaultInventory);
        setGameStats(defaultGameStats);
        setZones(defaultZones);
        setLastSaved(null);
        alert('Game reset successfully!');
      } else {
        alert('Failed to reset game.');
      }
    }
  };

  const handlePuppyAction = (puppyId: string, action: 'feed' | 'play' | 'cuddle' | 'train' | 'fetch' | 'groom' | 'sleep' | 'bathe') => {
    setPuppies(prev => prev.map(puppy => {
      if (puppy.id === puppyId) {
        let newPuppy = { ...puppy };
        
        switch (action) {
          case 'feed':
            if (inventory.find(item => item.type === 'food' && item.quantity > 0)) {
              newPuppy.hunger = Math.min(100, newPuppy.hunger + 25);
              newPuppy.happiness = Math.min(100, newPuppy.happiness + 15);
              newPuppy.animation = "eating";
              newPuppy.lastFed = new Date().toISOString();
              
              // Update inventory
              setInventory(prev => prev.map(item => 
                item.type === 'food' ? { ...item, quantity: item.quantity - 1 } : item
              ));
              
              // Update stats
              setGameStats(prev => ({ ...prev, puppyFeedings: prev.puppyFeedings + 1 }));
              
              setTimeout(() => {
                setPuppies(prev => prev.map(p => 
                  p.id === puppyId ? { ...p, animation: "idle" } : p
                ));
              }, 3000);
            }
            break;
          case 'play':
            if (newPuppy.energy >= 25) {
              newPuppy.energy = Math.max(0, newPuppy.energy - 25);
              newPuppy.happiness = Math.min(100, newPuppy.happiness + 20);
              newPuppy.animation = puppy.personality === "energetic" ? "jumping" : "wagging";
              newPuppy.lastPlayed = new Date().toISOString();
              newPuppy.experience += 5;
              
              setGameStats(prev => ({ ...prev, puppyPlaySessions: prev.puppyPlaySessions + 1 }));
              
              setTimeout(() => {
                setPuppies(prev => prev.map(p => 
                  p.id === puppyId ? { ...p, animation: "idle" } : p
                ));
              }, 3000);
            }
            break;
          case 'cuddle':
            newPuppy.happiness = Math.min(100, newPuppy.happiness + 25);
            newPuppy.energy = Math.min(100, newPuppy.energy + 5);
            newPuppy.animation = "cuddling";
            newPuppy.experience += 3;
            
            setTimeout(() => {
              setPuppies(prev => prev.map(p => 
                p.id === puppyId ? { ...p, animation: "idle" } : p
              ));
            }, 2500);
            break;
          case 'train':
            if (newPuppy.energy >= 20) {
              newPuppy.energy = Math.max(0, newPuppy.energy - 20);
              newPuppy.happiness = Math.min(100, newPuppy.happiness + 15);
              newPuppy.experience += 8;
              newPuppy.animation = "training";
              
              // Random skill improvement
              const skills = Object.keys(newPuppy.skills);
              const randomSkill = skills[Math.floor(Math.random() * skills.length)] as keyof typeof newPuppy.skills;
              newPuppy.skills[randomSkill] = Math.min(100, newPuppy.skills[randomSkill] + 5);
              
              setTimeout(() => {
                setPuppies(prev => prev.map(p => 
                  p.id === puppyId ? { ...p, animation: "idle" } : p
                ));
              }, 3500);
            }
            break;
          case 'fetch':
            if (newPuppy.energy >= 30 && newPuppy.skills.fetch < 100) {
              newPuppy.energy = Math.max(0, newPuppy.energy - 30);
              newPuppy.happiness = Math.min(100, newPuppy.happiness + 25);
              newPuppy.skills.fetch = Math.min(100, newPuppy.skills.fetch + 15);
              newPuppy.experience += 10;
              newPuppy.animation = "fetching";
              
              setTimeout(() => {
                setPuppies(prev => prev.map(p => 
                  p.id === puppyId ? { ...p, animation: "idle" } : p
                ));
              }, 4000);
            }
            break;
          case 'groom':
            newPuppy.happiness = Math.min(100, newPuppy.happiness + 20);
            newPuppy.animation = "grooming";
            newPuppy.experience += 4;
            
            setTimeout(() => {
              setPuppies(prev => prev.map(p => 
                p.id === puppyId ? { ...p, animation: "idle" } : p
              ));
            }, 3000);
            break;
          case 'sleep':
            newPuppy.energy = Math.min(100, newPuppy.energy + 40);
            newPuppy.happiness = Math.min(100, newPuppy.happiness + 10);
            newPuppy.animation = "sleeping";
            
            setTimeout(() => {
              setPuppies(prev => prev.map(p => 
                p.id === puppyId ? { ...p, animation: "idle" } : p
              ));
            }, 5000);
            break;
          case 'bathe':
            newPuppy.happiness = Math.min(100, newPuppy.happiness + 12);
            newPuppy.animation = "bathing";
            newPuppy.experience += 6;
            
            setTimeout(() => {
              setPuppies(prev => prev.map(p => 
                p.id === puppyId ? { ...p, animation: "idle" } : p
              ));
            }, 3500);
            break;
        }
        
        // Level up puppy if enough experience
        if (newPuppy.experience >= newPuppy.level * 60) {
          newPuppy.level += 1;
          newPuppy.experience = 0;
          
          // Age progression
          newPuppy.age += 1;
          if (newPuppy.age >= 30 && newPuppy.ageStage === "baby") {
            newPuppy.ageStage = "young";
          } else if (newPuppy.age >= 60 && newPuppy.ageStage === "young") {
            newPuppy.ageStage = "adult";
          }
        }
        
        // Update mood based on stats
        if (newPuppy.happiness >= 80) {
          newPuppy.mood = "happy";
        } else if (newPuppy.happiness >= 60) {
          newPuppy.mood = "content";
        } else if (newPuppy.happiness >= 40) {
          newPuppy.mood = "sad";
        } else {
          newPuppy.mood = "miserable";
        }
        
        return newPuppy;
      }
      return puppy;
    }));
    
    // Add experience for player and update interaction stats
    const expGain = action === 'train' || action === 'fetch' ? 10 : 6;
    setPlayerData(prev => ({
      ...prev,
      experience: Math.min(prev.experienceToNext, prev.experience + expGain)
    }));
    
    setGameStats(prev => ({ ...prev, puppyInteractions: prev.puppyInteractions + 1 }));
  };

  const handleMiniGame = (gameType: string) => {
    setCurrentActivity(gameType);
  };

  const gameModes = [
    {
      id: "puppy-playground",
      title: "Puppy Playground",
      description: "Take care of KK and Hailey! Feed them, play with them, and watch them grow.",
      icon: "🐾",
      color: "bg-pink-100 hover:bg-pink-200 border-pink-300",
      unlocked: true,
    },
    {
      id: "trivia-treasure",
      title: "Trivia Treasure",
      description: "Answer fun questions and earn coins to buy treats for your puppies!",
      icon: "💎",
      color: "bg-blue-100 hover:bg-blue-200 border-blue-300",
      unlocked: true,
    },
    {
      id: "spanish-fiesta",
      title: "Spanish Fiesta",
      description: "Learn Spanish words with KK and Hailey! Match words to pictures.",
      icon: "🎉",
      color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300",
      unlocked: true,
    },
  ];

  const handleGameSelect = (gameId: string) => {
    setActiveGame(gameId);
  };

  const handleBackToHub = () => {
    setActiveGame(null);
  };

  const getPuppyImage = (puppyId: string, animation: string) => {
    if (puppyId === "kk") {
      switch (animation) {
        case "eating": return "/puppy-hailey-eating-new.png"; // Using Hailey eating as placeholder
        case "jumping": return "/puppy-kk-playing-new.png";
        case "sleeping": return "/puppy-sleeping-new.png";
        default: return "/puppy-kk-new.png";
      }
    } else {
      switch (animation) {
        case "eating": return "/puppy-hailey-eating-new.png";
        case "sleeping": return "/puppy-sleeping-new.png";
        default: return "/puppy-hailey-new.png";
      }
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy": return "😊";
      case "content": return "🙂";
      case "sad": return "😢";
      case "miserable": return "😭";
      default: return "😐";
    }
  };

  const getAgeStageEmoji = (ageStage: string) => {
    switch (ageStage) {
      case "baby": return "🍼";
      case "young": return "🌱";
      case "adult": return "🐕";
      default: return "🐾";
    }
  };

  // Main Game Hub
  if (!activeGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-2 sm:p-4">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-1 sm:mb-2">🐾 Grand Puppyverse</h1>
            <p className="text-base sm:text-lg md:text-xl text-purple-600">Welcome to Kataya's Puppy Adventure!</p>
            
            {/* Save/Offline Status */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                {isGameOffline ? (
                  <>
                    <span className="text-orange-600">📴</span>
                    <span className="text-orange-600">Offline Mode</span>
                  </>
                ) : (
                  <>
                    <span className="text-green-600">📶</span>
                    <span className="text-green-600">Online</span>
                  </>
                )}
              </div>
              {lastSaved && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <span>💾</span>
                  <span>Last saved: {isMounted ? new Date(lastSaved).toLocaleTimeString() : 'Loading...'}</span>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                {/* Install button temporarily disabled */}
                {/* {canInstall && !isInstalled && (
                  <Button 
                    onClick={handleInstallApp} 
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-7 sm:h-8 bg-blue-100 hover:bg-blue-200 text-blue-800"
                  >
                    📱 Install App
                  </Button>
                )} */}
                <Button 
                  onClick={saveGame} 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-7 sm:h-8"
                >
                  💾 Save Game
                </Button>
                <Button 
                  onClick={resetGame} 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-7 sm:h-8 text-red-600 hover:text-red-700"
                >
                  🔄 Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Player Stats */}
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Player Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{playerData.name}</div>
                  <div className="text-sm text-gray-600">Level {playerData.level}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">🪙 {playerData.coins}</div>
                  <div className="text-sm text-gray-600">Coins</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {playerData.experience}/{playerData.experienceToNext} XP
                  </div>
                  <Progress value={(playerData.experience / playerData.experienceToNext) * 100} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Modes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {gameModes.map((game) => (
              <Card
                key={game.id}
                className={`cursor-pointer transform transition-all hover:scale-105 ${game.color} border-2`}
                onClick={() => handleGameSelect(game.id)}
              >
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2">{game.icon}</div>
                  <CardTitle className="text-base sm:text-lg">{game.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-4 pt-0">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                    {game.unlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Puppy Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Your Puppies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {puppies.map((puppy) => (
                  <div key={puppy.id} className="text-center">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2">
                      <AvatarImage src={getPuppyImage(puppy.id, puppy.animation)} alt={puppy.name} />
                      <AvatarFallback>{puppy.name}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-base sm:text-lg font-semibold text-purple-700">{puppy.name}</h3>
                    <div className="flex justify-center gap-1 sm:gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">{getMoodEmoji(puppy.mood)} {puppy.mood}</Badge>
                      <Badge variant="outline" className="text-xs">{getAgeStageEmoji(puppy.ageStage)} {puppy.ageStage}</Badge>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <div className="flex justify-between items-center">
                        <span>Happiness:</span>
                        <Progress value={puppy.happiness} className="w-16 sm:w-20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Hunger:</span>
                        <Progress value={puppy.hunger} className="w-16 sm:w-20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Energy:</span>
                        <Progress value={puppy.energy} className="w-16 sm:w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Puppy Playground Game
  if (activeGame === "puppy-playground") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 p-2 sm:p-4">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800">🐾 Puppy Playground</h1>
              <p className="text-sm sm:text-base md:text-lg text-green-600">Take care of KK and Hailey!</p>
            </div>
            <Button onClick={handleBackToHub} variant="outline" className="bg-white/80 w-full sm:w-auto">
              ← Back to Hub
            </Button>
          </div>

          <Tabs defaultValue="care" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
              <TabsTrigger value="care" className="text-xs sm:text-sm py-2 px-1">🐕 Puppy Care</TabsTrigger>
              <TabsTrigger value="zones" className="text-xs sm:text-sm py-2 px-1">🌍 Zones</TabsTrigger>
              <TabsTrigger value="inventory" className="text-xs sm:text-sm py-2 px-1">🎒 Inventory</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs sm:text-sm py-2 px-1">📊 Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="care" className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {puppies.map((puppy) => (
                  <Card key={puppy.id} className="bg-white/80 backdrop-blur-sm border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-700 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                          <AvatarImage src={getPuppyImage(puppy.id, puppy.animation)} alt={puppy.name} />
                          <AvatarFallback>{puppy.name}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span>{puppy.name}</span>
                          <span className="text-xs sm:text-sm opacity-75">- Level {puppy.level}</span>
                        </div>
                      </CardTitle>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">{getMoodEmoji(puppy.mood)} {puppy.mood}</Badge>
                        <Badge variant="outline" className="text-xs">{getAgeStageEmoji(puppy.ageStage)} {puppy.ageStage}</Badge>
                        <Badge variant="outline" className="text-xs">Age: {puppy.age} days</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Stats */}
                      <div className="space-y-2 sm:space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>Happiness {getMoodEmoji(puppy.mood)}</span>
                            <span>{puppy.happiness}%</span>
                          </div>
                          <Progress value={puppy.happiness} className="h-1.5 sm:h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>🍖 Hunger</span>
                            <span>{puppy.hunger}%</span>
                          </div>
                          <Progress value={puppy.hunger} className="h-1.5 sm:h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>⚡ Energy</span>
                            <span>{puppy.energy}%</span>
                          </div>
                          <Progress value={puppy.energy} className="h-1.5 sm:h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span>✨ Experience</span>
                            <span>{puppy.experience}/{puppy.level * 60}</span>
                          </div>
                          <Progress value={(puppy.experience / (puppy.level * 60)) * 100} className="h-1.5 sm:h-2" />
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-green-700 mb-2 text-sm sm:text-base">Skills</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                          {Object.entries(puppy.skills).map(([skill, level]) => (
                            <div key={skill} className="flex justify-between items-center">
                              <span className="capitalize">{skill}:</span>
                              <Progress value={level} className="w-12 sm:w-16 h-1.5 sm:h-2" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 text-sm sm:text-base">Actions</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'feed')}
                            disabled={!inventory.find(item => item.type === 'food' && item.quantity > 0)}
                            size="sm"
                            className="bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs h-8 sm:h-9"
                          >
                            🍖 Feed
                          </Button>
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'play')}
                            disabled={puppy.energy < 25}
                            size="sm"
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs h-8 sm:h-9"
                          >
                            🎾 Play
                          </Button>
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'cuddle')}
                            size="sm"
                            className="bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs h-8 sm:h-9"
                          >
                            🤗 Cuddle
                          </Button>
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'train')}
                            disabled={puppy.energy < 20}
                            size="sm"
                            className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs h-8 sm:h-9"
                          >
                            🎓 Train
                          </Button>
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'fetch')}
                            disabled={puppy.energy < 30}
                            size="sm"
                            className="bg-green-100 hover:bg-green-200 text-green-800 text-xs h-8 sm:h-9"
                          >
                            🥏 Fetch
                          </Button>
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'groom')}
                            size="sm"
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs h-8 sm:h-9"
                          >
                            ✂️ Groom
                          </Button>
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'sleep')}
                            size="sm"
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs h-8 sm:h-9"
                          >
                            😴 Sleep
                          </Button>
                          <Button 
                            onClick={() => handlePuppyAction(puppy.id, 'bathe')}
                            size="sm"
                            className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 text-xs h-8 sm:h-9"
                          >
                            🛁 Bathe
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="zones" className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {zones.map((zone) => (
                  <Card 
                    key={zone.id} 
                    className={`bg-white/80 backdrop-blur-sm ${zone.unlocked ? 'border-green-200' : 'border-gray-200'}`}
                  >
                    <CardHeader className="text-center p-4">
                      <div className="text-3xl sm:text-4xl mb-2">{zone.icon}</div>
                      <CardTitle className={`text-sm sm:text-base ${zone.unlocked ? "text-green-700" : "text-gray-500"}`}>
                        {zone.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{zone.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center p-4 pt-0">
                      <Badge 
                        variant={zone.unlocked ? "default" : "secondary"}
                        className={`${zone.unlocked ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"} text-xs`}
                      >
                        {zone.unlocked ? "Unlocked" : "Locked"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-4 sm:mt-6">
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700 text-base sm:text-lg">🎒 Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {inventory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{item.name}</div>
                          <div className="text-xs sm:text-sm text-gray-600 capitalize">{item.type}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.rarity}
                          </Badge>
                        </div>
                        <div className="text-right ml-2">
                          <div className="font-bold text-base sm:text-lg">{item.quantity}</div>
                          <div className="text-xs text-gray-500">qty</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-4 sm:mt-6">
              <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700 text-base sm:text-lg">📊 Game Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{gameStats.triviaQuestionsAnswered}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Trivia Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{gameStats.puppyFeedings}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Puppy Feedings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">{gameStats.puppyPlaySessions}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Play Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-yellow-600">{gameStats.totalPlayTime}</div>
                      <div className="text-xs sm:text-sm text-gray-600">Minutes Played</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Trivia Treasure Game
  if (activeGame === "trivia-treasure") {
    return (
      <TriviaTreasure
        onBack={handleBackToHub}
        playerData={playerData}
        onUpdatePlayer={(newData) => setPlayerData(prev => ({ ...prev, ...newData }))}
      />
    );
  }

  // Spanish Fiesta Game
  if (activeGame === "spanish-fiesta") {
    return (
      <SpanishFiesta
        onBack={handleBackToHub}
        playerData={playerData}
        onUpdatePlayer={(newData) => setPlayerData(prev => ({ ...prev, ...newData }))}
      />
    );
  }

  return null;
}