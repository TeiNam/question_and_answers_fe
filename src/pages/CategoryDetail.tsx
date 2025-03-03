import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileQuestion, Plus, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { categoryService } from '../services/category-service';
import { questionService } from '../services/question-service';
import { quizService } from '../services/quiz-service';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Category } from '../models/category';
import { Question, Answer } from '../models/question';
import { QuizSessionCreate } from '../models/quiz';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { isAdmin, isCreator } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizFormData, setQuizFormData] = useState<QuizSessionCreate>({
    category_id: parseInt(categoryId || '0'),
    name: '',
    description: '',
  });
  const [questionCount, setQuestionCount] = useState(10);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      try {
        // Fetch category details
        const categoryData = await categoryService.getById(parseInt(categoryId));
        setCategory(categoryData);
        
        // Fetch questions for this category
        const questionsData = await questionService.getAll({ category_id: parseInt(categoryId) });
        setQuestions(questionsData || []);
      } catch (error) {
        console.error('Error fetching category details:', error);
        toast.error('Failed to load category details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  const handleQuizInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuizFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quizFormData.name.trim()) {
      toast.error('Quiz name is required');
      return;
    }

    setIsCreatingQuiz(true);
    try {
      const response = await quizService.createSession(quizFormData, questionCount);
      toast.success('Quiz session created successfully');
      navigate(`/quiz/session/${response.session_id}`);
    } catch (error) {
      console.error('Error creating quiz session:', error);
      toast.error('Failed to create quiz session');
    } finally {
      setIsCreatingQuiz(false);
      setShowQuizForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/categories" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isLoading ? 'Loading...' : category?.name}
        </h1>
      </div>

      {!isLoading && (
        <div className="flex flex-wrap gap-4">
          {(isAdmin || isCreator) && (
            <Link to={`/admin/questions?category=${categoryId}`}>
              <Button leftIcon={<Plus />}>Add Question</Button>
            </Link>
          )}
          
          <Button 
            variant="outline" 
            leftIcon={<Award />}
            onClick={() => setShowQuizForm(!showQuizForm)}
          >
            Start Quiz
          </Button>
        </div>
      )}

      {showQuizForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Quiz Session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quiz Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={quizFormData.name}
                  onChange={handleQuizInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter quiz name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={quizFormData.description || ''}
                  onChange={handleQuizInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                  <option value={30}>30 questions</option>
                  <option value={50}>50 questions</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuizForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  isLoading={isCreatingQuiz}
                >
                  Create Quiz
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mt-6">Questions</h2>
          
          {questions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {questions.map((question) => (
                <Card key={question.question_id}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-blue-100 mr-4">
                        <FileQuestion className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {question.question_text}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {question.answer_type === 1 ? 'Single choice' : 'Multiple choice'} • 
                          {question.answers.length} answers
                        </p>
                        
                        <div className="mt-4">
                          <Link to={`/questions/${question.question_id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
              {isAdmin || isCreator ? (
                <>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new question.
                  </p>
                  <div className="mt-6">
                    <Link to={`/admin/questions?category=${categoryId}`}>
                      <Button leftIcon={<Plus />}>Add Question</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  No questions are available in this category yet.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryDetail;