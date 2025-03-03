export interface UserScore {
  score_id: number;
  user_id: number;
  question_id: number;
  is_correct: string;
  selected_answers: string;
  submit_at: string;
  question?: {
    question_text: string;
    category_id: number;
  };
  category?: {
    name: string;
  };
}

export interface UserCategoryStat {
  category_id: number;
  total_questions: number;
  correct_answers: number;
  last_access: string;
  category?: {
    name: string;
  };
}

export interface UserScoreSummary {
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
  category_stats: UserCategoryStat[];
}

export interface UserScoreCreate {
  user_id: number;
  question_id: number;
  is_correct: string;
  selected_answers: string;
}