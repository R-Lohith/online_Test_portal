import { useState } from 'react';
import { Trophy, Star, Award, TrendingUp, Calendar, Medal, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Results = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('academics');

  const tabs = [
    { id: 'academics', name: 'Academics', icon: Trophy },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'community', name: 'Community', icon: Star },
  ];

  const achievements = [
    { id: 1, title: 'First Test Completed', icon: '🎯', date: 'Jan 15, 2026', points: 50 },
    { id: 2, title: 'Perfect Score', icon: '💯', date: 'Jan 20, 2026', points: 100 },
    { id: 3, title: '7 Day Streak', icon: '🔥', date: 'Jan 25, 2026', points: 75 },
    { id: 4, title: '50 Problems Solved', icon: '⚡', date: 'Feb 1, 2026', points: 150 },
    { id: 5, title: 'Top 10 Leaderboard', icon: '🏆', date: 'Feb 5, 2026', points: 200 },
  ];

  const academicData = [
    { subject: 'Data Structures', score: 92, tests: 8, rank: 5 },
    { subject: 'Algorithms', score: 88, tests: 6, rank: 8 },
    { subject: 'Database Systems', score: 95, tests: 5, rank: 2 },
    { subject: 'Web Development', score: 90, tests: 7, rank: 4 },
    { subject: 'Operating Systems', score: 85, tests: 4, rank: 12 },
  ];

  const certifications = [
    { id: 1, name: 'React Developer', issuer: 'BIT Academy', date: 'Jan 2026', badge: '⚛️' },
    { id: 2, name: 'JavaScript Expert', issuer: 'BIT Academy', date: 'Dec 2025', badge: '🟨' },
    { id: 3, name: 'Node.js Professional', issuer: 'BIT Academy', date: 'Nov 2025', badge: '🟩' },
  ];

  const events = [
    { id: 1, name: 'Hackathon 2026', position: '2nd Place', date: 'Feb 2026', badge: '🥈' },
    { id: 2, name: 'Code Sprint', position: 'Winner', date: 'Jan 2026', badge: '🏆' },
    { id: 3, name: 'Tech Quiz', position: '3rd Place', date: 'Dec 2025', badge: '🥉' },
  ];

  const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'SQL', level: 88 },
    { name: 'Python', level: 75 },
  ];

  const stats = [
    { label: 'Total Points', value: '2,450', icon: Star, color: 'yellow' },
    { label: 'Tests Completed', value: '24', icon: Trophy, color: 'blue' },
    { label: 'Average Score', value: '87%', icon: Target, color: 'green' },
    { label: 'Global Rank', value: '#42', icon: Medal, color: 'purple' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{user?.displayName || 'Student'}</h1>
            <p className="text-purple-100 mb-4">{user?.email}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                Level 12
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                2,450 Points
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                87% Avg Score
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            yellow: 'from-yellow-500 to-yellow-600',
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
          };
          
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              {academicData.map((subject, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">{subject.subject}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{subject.tests} tests</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                        Rank #{subject.rank}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                          style={{ width: `${subject.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{subject.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">{cert.badge}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{cert.issuer}</p>
                  <p className="text-xs text-gray-500">{cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">{event.badge}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{event.name}</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-1">{event.position}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500">
                <h3 className="font-bold text-gray-800 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                          <p className="text-sm text-gray-500">{achievement.date}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                        +{achievement.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-4">Skills Progress</h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="font-bold text-gray-800">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
