// API service for Grand Puppyverse game

export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  coins: number;
  experienceToNext: number;
  puppies: Puppy[];
  inventory: InventoryItem[];
  gameStats: GameStats;
  unlockedZones: UnlockedZone[];
}

export interface Puppy {
  id: string;
  name: string;
  personality: string;
  happiness: number;
  hunger: number;
  energy: number;
  ageStage: string;
  age: number;
  currentOutfit?: string;
  currentAccessory?: string;
}

export interface InventoryItem {
  id: string;
  itemType: string;
  name: string;
  quantity: number;
  rarity: string;
}

export interface GameStats {
  id: string;
  playerId: string;
  triviaQuestionsAnswered: number;
  triviaCorrectAnswers: number;
  spanishWordsLearned: number;
  spanishLessonsCompleted: number;
  puppyInteractions: number;
  puppyFeedings: number;
  puppyPlaySessions: number;
  totalPlayTime: number;
  sessionsCompleted: number;
}

export interface UnlockedZone {
  id: string;
  playerId: string;
  zoneId: string;
  unlockedAt: Date;
  zone: GameZone;
}

export interface GameZone {
  id: string;
  name: string;
  description?: string;
  unlockLevel: number;
  isUnlocked: boolean;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: number;
  correctAnswer: string;
  explanation?: string;
  funFact?: string;
  answers: TriviaAnswer[];
}

export interface TriviaAnswer {
  id: string;
  answer: string;
  isCorrect: boolean;
}

export interface SpanishLesson {
  id: string;
  spanishWord: string;
  englishWord: string;
  category: string;
  difficulty: number;
  emoji?: string;
  pronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
}

// Player API
export const playerApi = {
  async getAll(): Promise<Player[]> {
    const response = await fetch('/api/players');
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async create(name: string): Promise<Player> {
    const response = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async getById(id: string): Promise<Player | null> {
    const response = await fetch(`/api/players/${id}`);
    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Puppy API
export const puppyApi = {
  async getByPlayerId(playerId: string): Promise<Puppy[]> {
    const response = await fetch(`/api/puppies/${playerId}`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async update(playerId: string, puppyId: string, updates: Partial<Puppy>): Promise<Puppy | null> {
    const response = await fetch(`/api/puppies/${playerId}/${puppyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Trivia API
export const triviaApi = {
  async getQuestions(): Promise<TriviaQuestion[]> {
    const response = await fetch('/api/trivia/questions');
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async createQuestion(question: Omit<TriviaQuestion, 'id' | 'answers'> & { answers: string[] }): Promise<TriviaQuestion | null> {
    const response = await fetch('/api/trivia/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Spanish API
export const spanishApi = {
  async getLessons(): Promise<SpanishLesson[]> {
    const response = await fetch('/api/spanish/lessons');
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async createLesson(lesson: Omit<SpanishLesson, 'id'>): Promise<SpanishLesson | null> {
    const response = await fetch('/api/spanish/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Inventory API
export const inventoryApi = {
  async getByPlayerId(playerId: string): Promise<InventoryItem[]> {
    const response = await fetch(`/api/inventory?playerId=${playerId}`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async addItem(playerId: string, item: Omit<InventoryItem, 'id'>): Promise<InventoryItem | null> {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, ...item }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async updateItem(itemId: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const response = await fetch('/api/inventory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, ...updates }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Zones API
export const zonesApi = {
  async getAll(): Promise<GameZone[]> {
    const response = await fetch('/api/zones');
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async getUnlockedByPlayerId(playerId: string): Promise<UnlockedZone[]> {
    const response = await fetch(`/api/players/${playerId}/zones`);
    const data = await response.json();
    return data.success ? data.data : [];
  },

  async unlockZone(playerId: string, zoneId: string): Promise<UnlockedZone | null> {
    const response = await fetch(`/api/players/${playerId}/zones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zoneId }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Stats API
export const statsApi = {
  async getByPlayerId(playerId: string): Promise<GameStats | null> {
    const response = await fetch(`/api/stats?playerId=${playerId}`);
    const data = await response.json();
    return data.success ? data.data : null;
  },

  async update(playerId: string, updates: Partial<GameStats>): Promise<GameStats | null> {
    const response = await fetch('/api/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, ...updates }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  },
};

// Utility functions
export const gameUtils = {
  calculateRewards(baseAmount: number, difficulty: number, streak: number = 0): { coins: number; experience: number } {
    const difficultyBonus = difficulty;
    const streakBonus = Math.floor(streak / 3) * 2;
    
    return {
      coins: baseAmount + difficultyBonus + streakBonus,
      experience: baseAmount * 5 + (difficulty * 5),
    };
  },

  levelUpExperience(level: number): number {
    return level * 100;
  },

  shouldLevelUp(currentExperience: number, currentLevel: number): boolean {
    return currentExperience >= this.levelUpExperience(currentLevel);
  },
};