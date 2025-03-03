import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import QuizSession from './pages/QuizSession';
import MyQuizzes from './pages/MyQuizzes';
import ScoreHistory from './pages/ScoreHistory';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminUsers from './pages/admin/Users';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:categoryId" element={<CategoryDetail />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/questions/:questionId" element={<QuestionDetail />} />
              <Route path="/quiz/session/:sessionId" element={<QuizSession />} />
              <Route path="/my-quizzes" element={<MyQuizzes />} />
              <Route path="/scores" element={<ScoreHistory />} />
              
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/categories" element={<Categories admin={true} />} />
                <Route path="/admin/questions" element={<Questions admin={true} />} />
              </Route>
            </Route>
          </Route>

          {/* Redirect to login if not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;