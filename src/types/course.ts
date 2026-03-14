export type Status = "next" | "pending" | "done";

export interface Score {
  id: number;
  courseid: number;
  score: number;
  dateTaken: string;
}

export interface Speaker {
  name: string;
  avatar: string;
  contact: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  learning_descriptions: string[];
  speaker: Speaker;
  presentation: string;
  video: string;
  status: Status;
  scores: Score[];
}

export type ChoiceValue = "A" | "B" | "C" | "D";

export interface Choice {
  id: number;
  description: string;
  value: ChoiceValue;
}

export interface Questionaire {
  id: number;
  question: string;
  answer: ChoiceValue;
  choices: Choice[];
}
