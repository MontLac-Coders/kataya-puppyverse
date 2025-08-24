// Game data types for localStorage
export interface GameSaveData {
  playerData: {
    name: string;
    level: number;
    coins: number;
    experience: number;
    experienceToNext: number;
    unlockedZones: string[];
  };
  puppies: Array<{
    id: string;
    name: string;
    personality: string;
    happiness: number;
    hunger: number;
    energy: number;
    mood: string;
    animation: string;
    level: number;
    experience: number;
    ageStage: string;
    age: number;
    skills: {
      fetch: number;
      sit: number;
      rollOver: number;
      dance: number;
      speak: number;
      stay: number;
    };
    accessories: string[];
    favoriteToys: string[];
    lastFed: string | null;
    lastPlayed: string | null;
  }>;
  inventory: Array<{
    id: string;
    name: string;
    type: string;
    quantity: number;
    rarity: string;
  }>;
  gameStats: {
    triviaQuestionsAnswered: number;
    triviaCorrectAnswers: number;
    spanishWordsLearned: number;
    spanishLessonsCompleted: number;
    puppyInteractions: number;
    puppyFeedings: number;
    puppyPlaySessions: number;
    totalPlayTime: number;
    sessionsCompleted: number;
  };
  zones: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    icon: string;
  }>;
  lastSaved: string;
  version: string;
}

// Storage keys
const STORAGE_KEYS = {
  GAME_DATA: 'grandPuppyverse_gameData',
  SETTINGS: 'grandPuppyverse_settings',
  OFFLINE_MODE: 'grandPuppyverse_offlineMode',
} as const;

// Current game version for migration purposes
const CURRENT_VERSION = '1.0.0';

// Save game data to localStorage
export const saveGameData = (data: GameSaveData): boolean => {
  try {
    const dataToSave = {
      ...data,
      lastSaved: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
    
    localStorage.setItem(STORAGE_KEYS.GAME_DATA, JSON.stringify(dataToSave));
    console.log('Game data saved successfully');
    return true;
  } catch (error) {
    console.error('Failed to save game data:', error);
    return false;
  }
};

// Load game data from localStorage
export const loadGameData = (): GameSaveData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
    if (!savedData) {
      return null;
    }
    
    const parsedData: GameSaveData = JSON.parse(savedData);
    
    // Check version and migrate if necessary
    if (parsedData.version !== CURRENT_VERSION) {
      console.log(`Migrating game data from version ${parsedData.version} to ${CURRENT_VERSION}`);
      // Add migration logic here if needed in future versions
    }
    
    // Convert date strings back to Date objects where needed
    parsedData.puppies = parsedData.puppies.map(puppy => ({
      ...puppy,
      lastFed: puppy.lastFed || null,
      lastPlayed: puppy.lastPlayed || null,
    }));
    
    console.log('Game data loaded successfully');
    return parsedData;
  } catch (error) {
    console.error('Failed to load game data:', error);
    return null;
  }
};

// Clear all game data
export const clearGameData = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_DATA);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_MODE);
    console.log('Game data cleared successfully');
    return true;
  } catch (error) {
    console.error('Failed to clear game data:', error);
    return false;
  }
};

// Check if game data exists
export const hasGameData = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.GAME_DATA) !== null;
};

// Get last saved timestamp
export const getLastSavedTime = (): string | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
    if (!savedData) return null;
    
    const parsedData = JSON.parse(savedData);
    return parsedData.lastSaved || null;
  } catch (error) {
    console.error('Failed to get last saved time:', error);
    return null;
  }
};

// Auto-save functionality
let autoSaveTimeout: NodeJS.Timeout | null = null;

export const autoSave = (data: GameSaveData, delay: number = 5000): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(() => {
    saveGameData(data);
  }, delay);
};

// Cancel pending auto-save
export const cancelAutoSave = (): void => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }
};

// Offline mode detection
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

// Save offline mode preference
export const setOfflineMode = (offline: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, JSON.stringify(offline));
  } catch (error) {
    console.error('Failed to save offline mode preference:', error);
  }
};

// Get offline mode preference
export const getOfflineMode = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE);
    return saved ? JSON.parse(saved) : false;
  } catch (error) {
    console.error('Failed to get offline mode preference:', error);
    return false;
  }
};

// Settings management
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'en' | 'es';
}

export const saveSettings = (settings: GameSettings): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

export const loadSettings = (): GameSettings | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
};

// Default settings
export const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  notificationsEnabled: true,
  autoSave: true,
  difficulty: 'easy',
  language: 'en',
};