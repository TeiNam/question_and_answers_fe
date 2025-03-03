import { api } from '../lib/api';
import { 
  QuizSession, 
  QuizQuestion, 
  QuizSessionCreate, 
  QuizSubmitAnswer 
} from '../models/quiz';

export const quizService = {
  /**
   * Create a new quiz session
   * @param data Quiz session data
   * @param questionCount Optional number of questions to include
   * @returns Promise with created quiz session
   */
  createSession: async (
    data: QuizSessionCreate, 
    questionCount?: number
  ): Promise<QuizSession> => {
    try {
      const response = await api.post('/api/v1/quiz/sessions', data, { 
        params: { question_count: questionCount } 
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quiz session:', error);
      throw error;
    }
  },

  /**
   * Get quiz session by ID
   * @param id Session ID
   * @returns Promise with quiz session data
   */
  getSession: async (id: number): Promise<QuizSession> => {
    try {
      const response = await api.get(`/api/v1/quiz/sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quiz session ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get quiz sessions for a category
   * @param categoryId Category ID
   * @returns Promise with list of quiz sessions
   */
  getCategorySessions: async (categoryId: number): Promise<QuizSession[]> => {
    try {
      const response = await api.get(`/api/v1/quiz/categories/${categoryId}/sessions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sessions for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Get questions for a quiz session
   * @param sessionId Session ID
   * @returns Promise with list of quiz questions
   */
  getSessionQuestions: async (sessionId: number): Promise<QuizQuestion[]> => {
    try {
      const response = await api.get(`/api/v1/quiz/sessions/${sessionId}/questions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching questions for session ${sessionId}:`, error);
      throw error;
    }
  },

  /**
   * Submit an answer for a quiz session
   * @param sessionId Session ID
   * @param data Submit answer data
   * @returns Promise with submission result
   */
  submitSessionAnswer: async (
    sessionId: number, 
    data: QuizSubmitAnswer
  ): Promise<any> => {
    try {
      const response = await api.post(`/api/v1/quiz/sessions/${sessionId}/submit`, data);
      return response.data;
    } catch (error) {
      console.error(`Error submitting answer for session ${sessionId}:`, error);
      throw error;
    }
  },

  /**
   * Get user's quiz sessions
   * @returns Promise with list of user's quiz sessions
   */
  getUserSessions: async (): Promise<QuizSession[]> => {
    try {
      const response = await api.get('/api/v1/quiz/my-sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
  }
};