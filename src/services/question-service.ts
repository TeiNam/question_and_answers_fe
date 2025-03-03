import { api } from '../lib/api';
import { Question, QuestionFormData, Answer } from '../models/question';
import { SubmitAnswer, SubmitResult } from '../models/submit';

export const questionService = {
  /**
   * Get all questions with optional filtering
   * @param params Optional parameters for filtering and pagination
   * @returns Promise with list of questions
   */
  getAll: async (params?: { 
    skip?: number; 
    limit?: number; 
    category_id?: number 
  }): Promise<Question[]> => {
    try {
      const response = await api.get('/api/v1/qna/questions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  /**
   * Get question by ID
   * @param id Question ID
   * @returns Promise with question data
   */
  getById: async (id: number): Promise<Question> => {
    try {
      const response = await api.get(`/api/v1/qna/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new question
   * @param data Question form data
   * @returns Promise with created question
   */
  create: async (data: QuestionFormData): Promise<Question> => {
    try {
      const response = await api.post('/api/v1/qna/questions', data);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  /**
   * Update an existing question
   * @param id Question ID
   * @param data Question form data
   * @returns Promise with updated question
   */
  update: async (id: number, data: QuestionFormData): Promise<Question> => {
    try {
      const response = await api.put(`/api/v1/qna/questions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating question ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a question
   * @param id Question ID
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/v1/qna/questions/${id}`);
    } catch (error) {
      console.error(`Error deleting question ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update an answer
   * @param id Answer ID
   * @param data Answer data
   * @returns Promise with updated answer
   */
  updateAnswer: async (id: number, data: Partial<Answer>): Promise<Answer> => {
    try {
      const response = await api.put(`/api/v1/qna/answers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating answer ${id}:`, error);
      throw error;
    }
  },

  /**
   * Submit an answer to a question
   * @param data Submit answer data
   * @returns Promise with submission result
   */
  submitAnswer: async (data: SubmitAnswer): Promise<SubmitResult> => {
    try {
      const response = await api.post('/api/v1/qna/submit', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }
};