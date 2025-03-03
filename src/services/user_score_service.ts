import { api } from '../lib/api';
import { UserScore, UserScoreSummary } from '../models/user_score';

export const userScoreService = {
  /**
   * Get user score history
   * @param limit Maximum number of records to return
   * @returns Promise with user score history
   */
  getScoreHistory: async (limit = 100): Promise<UserScore[]> => {
    try {
      const response = await api.get('/api/v1/scores/history', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching score history:', error);
      throw error;
    }
  },

  /**
   * Get user score summary
   * @returns Promise with user score summary
   */
  getScoreSummary: async (): Promise<UserScoreSummary> => {
    try {
      const response = await api.get('/api/v1/scores/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching score summary:', error);
      throw error;
    }
  },

  /**
   * Get user scores for a specific category
   * @param categoryId Category ID
   * @returns Promise with user scores for the category
   */
  getCategoryScores: async (categoryId: number): Promise<UserScore[]> => {
    try {
      const response = await api.get(`/api/v1/scores/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching scores for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Submit an answer to a question
   * @param questionId Question ID
   * @param selectedAnswerIds Array of selected answer IDs
   * @returns Promise with submission result
   */
  submitAnswer: async (questionId: number, selectedAnswerIds: number[]) => {
    try {
      const response = await api.post('/api/v1/scores/submit', {
        question_id: questionId,
        selected_answer_ids: selectedAnswerIds
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }
};