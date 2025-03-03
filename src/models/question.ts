export interface Question {
  question_id: number;
  question_text: string;
  category_id: number;
  user_id: number;
  answer_type: number;
  note: string | null;
  link_url: string | null;
  create_at: string;
  update_at: string;
  answers: Answer[];
  category?: {
    name: string;
  };
}

export interface Answer {
  answer_id: number;
  answer_text: string;
  is_correct: string;
  question_id: number;
  note: string | null;
}

export interface QuestionFormData {
  question_text: string;
  category_id: number;
  answer_type: number;
  note?: string;
  link_url?: string;
  answers: AnswerFormData[];
}

export interface AnswerFormData {
  answer_text: string;
  is_correct: string;
  note?: string;
}