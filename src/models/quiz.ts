export interface QuizSession {
  session_id: number;
  name: string;
  description: string | null;
  category_id: number;
  question_count: number;
  completed_count: number;
  correct_count: number;
  create_at: string;
  update_at: string;
  category?: {
    name: string;
  };
}

export interface QuizQuestion {
  question_id: number;
  question_text: string;
  answer_type: number;
  answers: QuizAnswer[];
  user_answer?: number[];
  is_correct?: boolean;
}

export interface QuizAnswer {
  answer_id: number;
  answer_text: string;
  is_correct?: string;
}

export interface QuizSessionCreate {
  category_id: number;
  name: string;
  description?: string;
}

export interface QuizSubmitAnswer {
  question_id: number;
  selected_answer_ids: number[];
}