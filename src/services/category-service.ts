import { api } from '../lib/api';
import { Category, CategoryFormData } from '../models/category';

export const categoryService = {
  /**
   * Get all categories
   * @param isUse Optional filter for active categories ('Y' or 'N')
   * @returns Promise with list of categories
   */
  getAll: async (isUse?: string): Promise<Category[]> => {
    try {
      const response = await api.get('/api/v1/categories/', { 
        params: { is_use: isUse } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   * @param id Category ID
   * @returns Promise with category data
   */
  getById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get(`/api/v1/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param data Category form data
   * @returns Promise with created category
   */
  create: async (data: CategoryFormData): Promise<Category> => {
    try {
      const response = await api.post('/api/v1/categories/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update an existing category
   * @param id Category ID
   * @param data Category form data
   * @returns Promise with updated category
   */
  update: async (id: number, data: CategoryFormData): Promise<Category> => {
    try {
      const response = await api.put(`/api/v1/categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param id Category ID
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/v1/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};