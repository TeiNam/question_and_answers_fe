export interface UserCategoryStat {
  stat_id: number;
  user_id: number;
  category_id: number;
  total_questions: number;
  correct_answers: number;
  last_access: string;
}