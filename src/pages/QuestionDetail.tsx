import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { questionService } from '../services/question-service';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils';
import { Question, Answer } from '../models/question';
import { SubmitResult } from '../models/submit';

const QuestionDetail: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { isAdmin, isCreator, user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) return;
      
      setIsLoading(true);
      try {
        const data = await questionService.getById(parseInt(questionId));
        setQuestion(data);
      } catch (error) {
        console.error('Error fetching question:', error);
        toast.error('Failed to load question');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleAnswerSelect = (answerId: number) => {
    if (submitResult) return; // Prevent changing after submission
    
    if (question?.answer_type === 1) {
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

  const handleSubmit = async () => {
    if (!question || selectedAnswers.length === 0) {
      toast.error('Please select an answer');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await questionService.submitAnswer({
        question_id: question.question_id,
        selected_answer_ids: selectedAnswers,
      });
      
      setSubmitResult(result);
      
      if (result.is_correct === 'Y') {
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect answer!');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canEditQuestion = isAdmin || (isCreator && question?.user_id === user?.user_id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Question not found</h3>
        <p className="mt-1 text-gray-500">
          The question you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link to="/questions">
            <Button>Back to Questions</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/questions" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Question Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex space-x-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {question.category?.name || `Category ${question.category_id}`}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {question.answer_type === 1 ? 'Single choice' : 'Multiple choice'}
                </span>
              </div>
              <CardTitle className="text-xl">{question.question_text}</CardTitle>
            </div>
            {canEditQuestion && (
              <Link to={`/admin/questions/${question.question_id}/edit`}>
                <Button variant="outline" size="sm">Edit Question</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {question.note && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Note:</h3>
              <p className="text-gray-700">{question.note}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Select your answer:</h3>
            {question.answers.map((answer) => (
              <div
                key={answer.answer_id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers.includes(answer.answer_id)
                    ? submitResult
                      ? submitResult.is_correct === 'Y'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                      : 'bg-blue-50 border-blue-300'
                    : submitResult && submitResult.correct_answers.some(a => a.answer_id === answer.answer_id)
                    ? 'bg-green-50 border-green-300'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSelect(answer.answer_id)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center border ${
                    selectedAnswers.includes(answer.answer_id)
                      ? submitResult
                        ? submitResult.is_correct === 'Y'
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
                
                {submitResult && answer.note && (
                  <div className="mt-2 ml-8 text-sm text-gray-600">
                    <p><strong>Note:</strong> {answer.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {submitResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              submitResult.is_correct === 'Y' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {submitResult.is_correct === 'Y' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">
                    {submitResult.is_correct === 'Y' ? 'Correct!' : 'Incorrect!'}
                  </p>
                  {submitResult.is_correct !== 'Y' && (
                    <p className="text-sm mt-1">
                      The correct answer is: {submitResult.correct_answers.map(a => a.answer_text).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {question.link_url && (
            <div className="mt-6">
              <a 
                href={question.link_url} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Learn more
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created {formatDate(question.create_at)}
          </div>
          {!submitResult && (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedAnswers.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionDetail;