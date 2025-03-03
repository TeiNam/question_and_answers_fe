import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { quizService } from '../services/quiz-service';
import toast from 'react-hot-toast';
import { formatDate, calculateAccuracy } from '../lib/utils';
import { QuizSession } from '../models/quiz';

const MyQuizzes: React.FC = () => {
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const data = await quizService.getUserSessions();
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching quiz sessions:', error);
        toast.error('Failed to load quiz sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Quiz Sessions</h1>
        <Link to="/categories">
          <Button leftIcon={<Award />}>Start New Quiz</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => {
                const isCompleted = session.completed_count === session.question_count;
                const progress = (session.completed_count / session.question_count) * 100;
                
                return (
                  <Card key={session.session_id}>
                    <CardHeader>
                      <CardTitle>{session.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Category: {session.category?.name || `Category ${session.category_id}`}</p>
                          <p className="text-sm text-gray-500">Created: {formatDate(session.create_at)}</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{session.completed_count}/{session.question_count}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                            )}
                            <span className="text-sm font-medium">
                              {isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            Score: {calculateAccuracy(session.correct_count, session.completed_count)}
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Link to={`/quiz/session/${session.session_id}`}>
                            <Button variant="outline" fullWidth>
                              {isCompleted ? 'Review Quiz' : 'Continue Quiz'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No quiz sessions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start a new quiz to test your knowledge.
              </p>
              <div className="mt-6">
                <Link to="/categories">
                  <Button>Start New Quiz</Button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyQuizzes;