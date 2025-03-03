export interface Category {
  category_id: number;
  name: string;
  is_use: string;
  create_at?: string;
  update_at?: string;
}

export interface CategoryFormData {
  name: string;
  is_use: string;
}