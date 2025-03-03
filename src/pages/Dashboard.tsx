import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, CheckCircle, Clock, FileQuestion, TrendingUp, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { userScoreService } from '../services/user_score_service';
import { categoryService } from '../services/category-service';
import { quizService } from '../services/quiz-service';
import { calculateAccuracy, formatDate } from '../lib/utils';
import { UserScoreSummary } from '../models/user_score';
import { Category } from '../models/category';
import { QuizSession } from '../models/quiz';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [scoreSummary, setScoreSummary] = useState<UserScoreSummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentSessions, setRecentSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories and sessions first
        const [categoriesRes, sessionsRes] = await Promise.all([
          categoryService.getAll('Y').catch(error => {
            console.error('Error fetching categories:', error);
            return [];
          }),
          quizService.getUserSessions().catch(error => {
            console.error('Error fetching user sessions:', error);
            return [];
          }),
        ]);

        setCategories(categoriesRes || []);
        setRecentSessions((sessionsRes || []).slice(0, 5)); // Get only the 5 most recent sessions

        // Then try to fetch score summary
        try {
          const summaryData = await userScoreService.getScoreSummary();
          if (summaryData) {
            setScoreSummary(summaryData);
          } else {
            throw new Error('Invalid summary data');
          }
        } catch (error) {
          console.error('Error fetching score summary:', error);
          // Set default empty summary if API fails
          setScoreSummary({
            total_questions: 0,
            correct_answers: 0,
            accuracy_rate: 0,
            category_stats: []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Don't show toast here to avoid spamming the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.username}!</h1>
          <p className="text-gray-600">Track your learning progress and start new quizzes</p>
        </div>
        <Link to="/categories">
          <Button leftIcon={<Zap />} size="lg">
            Start New Quiz
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Questions</p>
                    <h3 className="text-3xl font-bold text-gray-900">{scoreSummary?.total_questions || 0}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-blue-200 text-blue-700">
                    <FileQuestion className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Correct Answers</p>
                    <h3 className="text-3xl font-bold text-gray-900">{scoreSummary?.correct_answers || 0}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-green-200 text-green-700">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 mb-1">Accuracy Rate</p>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {scoreSummary ? calculateAccuracy(scoreSummary.correct_answers, scoreSummary.total_questions) : '0%'}
                    </h3>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-200 text-yellow-700">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Categories</p>
                    <h3 className="text-3xl font-bold text-gray-900">{categories.length}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-purple-200 text-purple-700">
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories Section */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Categories</CardTitle>
                <Link to="/categories">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-blue-500">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.slice(0, 6).map((category) => (
                    <Link 
                      key={category.category_id} 
                      to={`/categories/${category.category_id}`}
                      className="block"
                    >
                      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors hover:shadow-md">
                        <div className="flex items-center mb-2">
                          <div className="p-2 rounded-full bg-blue-100 mr-3">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {scoreSummary?.category_stats?.find?.(
                            (stat) => stat.category_id === category.category_id
                          )
                            ? `${
                                scoreSummary.category_stats.find(
                                  (stat) => stat.category_id === category.category_id
                                )?.correct_answers || 0
                              } / ${
                                scoreSummary.category_stats.find(
                                  (stat) => stat.category_id === category.category_id
                                )?.total_questions || 0
                              } correct`
                            : 'No attempts yet'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No categories available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Categories will appear here once they are created
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quiz Sessions */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Recent Quiz Sessions</CardTitle>
                <Link to="/my-quizzes">
                  <Button variant="outline" size="sm" className="text-white border-white hover:bg-purple-500">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {recentSessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentSessions.map((session) => (
                        <tr key={session.session_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {session.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${(session.completed_count / session.question_count) * 100}%` }}
                                ></div>
                              </div>
                              <span>{session.completed_count} / {session.question_count}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                              {calculateAccuracy(session.correct_count, session.completed_count)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(session.create_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/quiz/session/${session.session_id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Continue
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent sessions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start a new quiz session to see your progress here.
                  </p>
                  <div className="mt-6">
                    <Link to="/categories">
                      <Button>Start a Quiz</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;