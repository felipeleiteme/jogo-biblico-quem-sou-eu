export interface BibleCharacter {
  id: number;
  name: string;
  mainCharacteristic: string;
  centralQuality?: string;
  symbol?: string;
  crossroads?: string;
  contrast?: string;
  curiosity: string;
  spiritualJewel: string;
  practicalLesson: string;
}

export interface GameHint {
  type: 'mainCharacteristic' | 'centralQuality' | 'symbol' | 'crossroads' | 'contrast' | 'curiosity' | 'spiritualJewel' | 'practicalLesson';
  text: string;
  difficulty: number; // 1-5, onde 5 é o mais difícil
}

export interface GameState {
  currentCharacter: BibleCharacter | null;
  hintsRevealed: GameHint[];
  score: number;
  totalRounds: number;
  currentRound: number;
  gameStatus: 'waiting' | 'playing' | 'finished';
  lastGuess?: string;
  lastGuessCorrect?: boolean;
  availableCharacters: BibleCharacter[];
}