import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, FileQuestion, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { questionService } from '../services/question-service';
import { categoryService } from '../services/category-service';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { formatDate, truncateText } from '../lib/utils';
import { Question } from '../models/question';
import { Category } from '../models/category';

interface QuestionsProps {
  admin?: boolean;
}

const Questions: React.FC<QuestionsProps> = ({ admin = false }) => {
  const { isAdmin, isCreator, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categoryParam ? parseInt(categoryParam) : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchQuestions = async (reset = false) => {
    const currentPage = reset ? 1 : page;
    setIsLoading(true);
    try {
      const data = await questionService.getAll({
        skip: (currentPage - 1) * limit,
        limit,
        category_id: selectedCategory || undefined,
      });
      
      if (reset) {
        setQuestions(data || []);
      } else {
        setQuestions(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore((data || []).length === limit);
      if (reset) {
        setPage(1);
      } else {
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions(true);
  }, [selectedCategory]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam));
    }
  }, [categoryParam]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setSelectedCategory(null);
      navigate('/questions');
    } else {
      setSelectedCategory(parseInt(value));
      navigate(`/questions?category=${value}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await questionService.delete(id);
      toast.success('Question deleted successfully');
      fetchQuestions(true);
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const filteredQuestions = searchQuery
    ? questions.filter(q => 
        q.question_text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;

  const canManageQuestions = isAdmin || isCreator || admin;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {admin ? 'Manage Questions' : 'Questions'}
        </h1>
        {canManageQuestions && (
          <Link to="/admin/questions/new">
            <Button leftIcon={<Plus />}>Add Question</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={selectedCategory || 'all'}
            onChange={handleCategoryChange}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
              label="Search"
              fullWidth
            />
          </form>
        </div>
      </div>

      {isLoading && questions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredQuestions.length > 0 ? (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Card key={question.question_id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-blue-100 mr-4">
                          <FileQuestion className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {truncateText(question.question_text, 100)}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {question.category?.name || `Category ${question.category_id}`}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {question.answer_type === 1 ? 'Single choice' : 'Multiple choice'}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {formatDate(question.create_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {(isAdmin || (isCreator && question.user_id === user?.user_id)) && (
                          <>
                            <Link to={`/admin/questions/${question.question_id}/edit`}>
                              <button className="text-gray-400 hover:text-blue-500">
                                <Edit className="h-5 w-5" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteQuestion(question.question_id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Link to={`/questions/${question.question_id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => fetchQuestions()}
                    isLoading={isLoading}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
              {canManageQuestions ? (
                <>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new question.
                  </p>
                  <div className="mt-6">
                    <Link to="/admin/questions/new">
                      <Button leftIcon={<Plus />}>Add Question</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  No questions are available with the current filters.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Questions;