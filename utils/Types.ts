export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
};

export type Question = {
  question: string;
  correctAnswer: string[];
  wrongAnswer: string[];
};
