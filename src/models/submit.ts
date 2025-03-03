export interface SubmitAnswer {
  question_id: number;
  selected_answer_ids: number[];
}

export interface SubmitResult {
  is_correct: string;
  correct_answers: Array<{
    answer_id: number;
    answer_text: string;
    is_correct: string;
  }>;
  score_id?: number;
}