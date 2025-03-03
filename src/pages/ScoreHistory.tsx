import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { userScoreService } from '../services/user_score_service';
import { categoryService } from '../services/category-service';
import toast from 'react-hot-toast';
import { formatDate, calculateAccuracy } from '../lib/utils';
import { UserScore, UserScoreSummary } from '../models/user_score';
import { Category } from '../models/category';

const ScoreHistory: React.FC = () => {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [summary, setSummary] = useState<UserScoreSummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // First fetch categories and scores
        const [categoriesData, scoresData] = await Promise.all([
          categoryService.getAll().catch(error => {
            console.error('Error fetching categories:', error);
            return [];
          }),
          userScoreService.getScoreHistory().catch(error => {
            console.error('Error fetching score history:', error);
            return [];
          }),
        ]);
        
        setCategories(categoriesData || []);
        setScores(scoresData || []);
        
        // Then try to fetch summary
        try {
          const summaryData = await userScoreService.getScoreSummary();
          
          if (summaryData) {
            // Add category names to summary stats
            if (summaryData.category_stats && Array.isArray(summaryData.category_stats) && categoriesData) {
              const updatedStats = summaryData.category_stats.map(stat => ({
                ...stat,
                category: categoriesData.find(c => c.category_id === stat.category_id),
              }));
              
              setSummary({
                ...summaryData,
                category_stats: updatedStats,
              });
            } else {
              setSummary({
                ...summaryData,
                category_stats: summaryData.category_stats || [],
              });
            }
          } else {
            throw new Error('Invalid summary data');
          }
        } catch (error) {
          console.error('Error fetching score summary:', error);
          // Set default empty summary
          setSummary({
            total_questions: 0,
            correct_answers: 0,
            accuracy_rate: 0,
            category_stats: [],
          });
        }
      } catch (error) {
        console.error('Error fetching score data:', error);
        // Don't show toast here to avoid spamming the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategoryScores = async () => {
      if (!selectedCategory) return;
      
      setIsLoading(true);
      try {
        const data = await userScoreService.getCategoryScores(selectedCategory);
        setScores(data || []);
      } catch (error) {
        console.error('Error fetching category scores:', error);
        toast.error('Failed to load category scores');
        setScores([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCategory) {
      fetchCategoryScores();
    }
  }, [selectedCategory]);

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setSelectedCategory(null);
      try {
        const data = await userScoreService.getScoreHistory();
        setScores(data || []);
      } catch (error) {
        console.error('Error fetching score history:', error);
        setScores([]);
      }
    } else {
      setSelectedCategory(parseInt(value));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Score History</h1>
      </div>

      {isLoading && !selectedCategory ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-blue-100 mb-4">
                    <BarChart2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Questions</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {summary?.total_questions || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Correct Answers</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {summary?.correct_answers || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-yellow-100 mb-4">
                    <BarChart2 className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Accuracy Rate</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {summary ? calculateAccuracy(summary.correct_answers || 0, summary.total_questions || 0) : '0%'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Stats */}
          {summary && summary.category_stats && summary.category_stats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Questions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Correct
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Accuracy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Attempt
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {summary.category_stats.map((stat) => (
                        <tr key={stat.category_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stat.category?.name || `Category ${stat.category_id}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stat.total_questions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stat.correct_answers}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {calculateAccuracy(stat.correct_answers, stat.total_questions)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(stat.last_access)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Score History */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Answer History</CardTitle>
                <div className="w-64">
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
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && selectedCategory ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : scores.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Question
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scores.map((score) => (
                        <tr key={score.score_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(score.submit_at)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                            {score.question?.question_text || `Question ${score.question_id}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {score.category?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {score.is_correct === 'Y' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="h-4 w-4 mr-1" />
                                Incorrect
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No score history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start answering questions to see your performance history.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ScoreHistory;