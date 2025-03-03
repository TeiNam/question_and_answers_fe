import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { quizService } from '../services/quiz-service';
import toast from 'react-hot-toast';
import { calculateAccuracy } from '../lib/utils';
import { QuizSession, QuizQuestion } from '../models/quiz';

const QuizSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) return;
      
      setIsLoading(true);
      try {
        // Fetch session details
        const sessionData = await quizService.getSession(parseInt(sessionId));
        setSession(sessionData);
        
        // Fetch questions for this session
        const questionsData = await quizService.getSessionQuestions(parseInt(sessionId));
        setQuestions(questionsData || []);
        
        // Find the first unanswered question
        const firstUnansweredIndex = questionsData.findIndex(q => !q.user_answer);
        if (firstUnansweredIndex !== -1) {
          setCurrentQuestionIndex(firstUnansweredIndex);
        }
        
        // Check if all questions are answered
        const allAnswered = questionsData.every(q => q.user_answer);
        setIsCompleted(allAnswered);
      } catch (error) {
        console.error('Error fetching quiz session:', error);
        toast.error('Failed to load quiz session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    // Reset state when changing questions
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      setSelectedAnswers(currentQuestion.user_answer || []);
      setIsAnswered(!!currentQuestion.user_answer);
      setIsCorrect(!!currentQuestion.is_correct);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = (answerId: number) => {
    if (isAnswered) return; // Prevent changing answer after submission
    
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.answer_type === 1) {
      // Single choice
      setSelectedAnswers([answerId]);
    } else {
      // Multiple choice
      if (selectedAnswers.includes(answerId)) {
        setSelectedAnswers(selectedAnswers.filter(id => id !== answerId));
      } else {
        setSelectedAnswers([...selectedAnswers, answerId]);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswers.length === 0) {
      toast.error('Please select an answer');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const response = await quizService.submitSessionAnswer(parseInt(sessionId!), {
        question_id: currentQuestion.question_id,
        selected_answer_ids: selectedAnswers,
      });
      
      // Update questions array with the result
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        user_answer: selectedAnswers,
        is_correct: response.is_correct === 'Y',
      };
      
      setQuestions(updatedQuestions);
      setIsAnswered(true);
      setIsCorrect(response.is_correct === 'Y');
      
      // Update session data
      setSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          completed_count: prev.completed_count + 1,
          correct_count: response.is_correct === 'Y' ? prev.correct_count + 1 : prev.correct_count,
        };
      });
      
      toast.success('Answer submitted');
      
      // Check if all questions are now answered
      const allAnswered = updatedQuestions.every(q => q.user_answer);
      if (allAnswered) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Session not found</h3>
        <p className="mt-1 text-gray-500">
          The quiz session you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link to="/my-quizzes">
            <Button>Go to My Quizzes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/my-quizzes" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
        </div>
        <div className="text-sm text-gray-500">
          Category: {session.category?.name || `Category ${session.category_id}`}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${(session.completed_count / session.question_count) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <div>
          Progress: {session.completed_count} / {session.question_count} questions
        </div>
        <div>
          Score: {calculateAccuracy(session.correct_count, session.completed_count)}
        </div>
      </div>

      {isCompleted ? (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                You've completed this quiz session
              </h3>
              <p className="mt-2 text-gray-600">
                You answered {session.correct_count} out of {session.question_count} questions correctly.
              </p>
              <div className="mt-4 text-2xl font-bold text-blue-600">
                {calculateAccuracy(session.correct_count, session.question_count)}
              </div>
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Question Summary</h4>
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <div 
                    key={q.question_id}
                    className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-xs font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-sm truncate max-w-md">{q.question_text}</span>
                    </div>
                    <div>
                      {q.is_correct ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to={`/categories/${session.category_id}`}>
              <Button variant="outline">
                Back to Category
              </Button>
            </Link>
            <Link to="/my-quizzes">
              <Button>
                My Quizzes
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
              <div className="text-sm font-medium">
                {currentQuestion.answer_type === 1 ? 'Single Choice' : 'Multiple Choice'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentQuestion.question_text}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.answers.map((answer) => (
                  <div
                    key={answer.answer_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswers.includes(answer.answer_id)
                        ? isAnswered
                          ? answer.is_correct === 'Y'
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                          : 'bg-blue-50 border-blue-300'
                        : isAnswered && answer.is_correct === 'Y'
                        ? 'bg-green-50 border-green-300'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleAnswerSelect(answer.answer_id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center border ${
                        selectedAnswers.includes(answer.answer_id)
                          ? isAnswered
                            ? answer.is_correct === 'Y'
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-red-500 bg-red-500 text-white'
                            : 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers.includes(answer.answer_id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span>{answer.answer_text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isAnswered && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-start">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {isCorrect ? 'Correct!' : 'Incorrect!'}
                    </p>
                    <p className="text-sm mt-1">
                      {isCorrect 
                        ? 'You selected the right answer.' 
                        : 'The correct answer is: ' + 
                          currentQuestion.answers
                            .filter(a => a.is_correct === 'Y')
                            .map(a => a.answer_text)
                            .join(', ')
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            
            <div>
              {!isAnswered ? (
                <Button
                  onClick={handleSubmitAnswer}
                  isLoading={isSubmitting}
                  disabled={selectedAnswers.length === 0}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Next Question
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default QuizSessionPage;