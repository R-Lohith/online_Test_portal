import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Sample data
  const progressData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 72 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 88 },
    { month: 'Jun', score: 92 },
  ];

  const scoreDistribution = [
    { range: '0-20', count: 2 },
    { range: '21-40', count: 5 },
    { range: '41-60', count: 12 },
    { range: '61-80', count: 25 },
    { range: '81-100', count: 18 },
  ];

  const skillData = [
    { skill: 'Frontend', score: 85 },
    { skill: 'Backend', score: 78 },
    { skill: 'Database', score: 82 },
    { skill: 'DSA', score: 90 },
    { skill: 'System Design', score: 75 },
  ];

  const recentActivity = [
    { id: 1, title: 'Completed React Advanced Test', time: '2 hours ago', score: 92, type: 'test' },
    { id: 2, title: 'Solved Binary Tree Problem', time: '5 hours ago', score: 85, type: 'code' },
    { id: 3, title: 'Completed SQL Basics', time: '1 day ago', score: 88, type: 'test' },
    { id: 4, title: 'Completed API Integration', time: '2 days ago', score: 95, type: 'code' },
  ];

  const stats = [
    { title: 'MCQ Tests', value: '24', change: '+12%', icon: Trophy, color: 'blue' },
    { title: 'Problems Solved', value: '156', change: '+23%', icon: Target, color: 'green' },
    { title: 'Average Score', value: '87%', change: '+5%', icon: Award, color: 'purple' },
    { title: 'Points', value: '2,450', change: '+18%', icon: TrendingUp, color: 'orange' },
  ];

  const upcomingTests = [
    { id: 1, title: 'Node.js Advanced', date: 'Feb 8, 2026', time: '10:00 AM', questions: 30 },
    { id: 2, title: 'React Hooks Deep Dive', date: 'Feb 10, 2026', time: '2:00 PM', questions: 25 },
    { id: 3, title: 'Database Optimization', date: 'Feb 12, 2026', time: '11:00 AM', questions: 20 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.displayName || 'Student'}! 👋
            </h1>
            <p className="text-blue-100">
              You're on a 7-day streak! Keep up the great work.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-sm text-blue-100">Current Streak</p>
            <p className="text-3xl font-bold">7 🔥</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
          };
          
          return (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Time */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Radar & Upcoming Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Skill Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={skillData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Tests */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Tests</h3>
          <div className="space-y-4">
            {upcomingTests.map((test) => (
              <div key={test.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {test.questions}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{test.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {test.date} • {test.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${activity.type === 'test' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center`}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-gray-800">{activity.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
