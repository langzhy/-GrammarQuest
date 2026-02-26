export enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export enum GrammarPoint {
  NonFiniteVerbs = "Non-finite Verbs",
  RelativeClauses = "Relative Clauses",
  Conjunctions = "Conjunctions",
  Tenses = "Tenses",
  Conditionals = "Conditionals",
  Prepositions = "Prepositions",
}

export interface Question {
  id: string;
  sentence: string; // Use {{blank}} for placeholders
  options: string[];
  correctAnswer: string;
  explanation: {
    rule: string;
    example: string;
    commonMistake: string;
  };
  difficulty: Difficulty;
  category: GrammarPoint;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}
