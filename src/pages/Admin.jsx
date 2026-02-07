import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Users, FileText, TrendingUp, Award } from 'lucide-react';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('subjects');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'subjects', name: 'Subjects', icon: FileText },
    { id: 'questions', name: 'Questions', icon: Award },
    { id: 'submissions', name: 'Submissions', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
  ];

  const subjects = [
    { id: 1, name: 'Data Structures', tests: 8, questions: 156, students: 245, avgScore: 78 },
    { id: 2, name: 'Algorithms', tests: 6, questions: 128, students: 198, avgScore: 82 },
    { id: 3, name: 'Web Development', tests: 7, questions: 142, students: 312, avgScore: 85 },
    { id: 4, name: 'Database Systems', tests: 5, questions: 95, students: 189, avgScore: 88 },
    { id: 5, name: 'Operating Systems', tests: 4, questions: 78, students: 156, avgScore: 75 },
  ];

  const questions = [
    { id: 1, question: 'What is a stack?', subject: 'Data Structures', difficulty: 'Easy', usage: 45 },
    { id: 2, question: 'Explain binary search algorithm', subject: 'Algorithms', difficulty: 'Medium', usage: 38 },
    { id: 3, question: 'What is React Virtual DOM?', subject: 'Web Development', difficulty: 'Medium', usage: 52 },
    { id: 4, question: 'Explain ACID properties', subject: 'Database Systems', difficulty: 'Hard', usage: 28 },
    { id: 5, question: 'What is deadlock?', subject: 'Operating Systems', difficulty: 'Medium', usage: 41 },
  ];

  const submissions = [
    { id: 1, student: 'John Doe', test: 'React Fundamentals', score: 92, time: '25 min', date: 'Feb 6, 2026' },
    { id: 2, student: 'Jane Smith', test: 'JavaScript Advanced', score: 88, time: '38 min', date: 'Feb 6, 2026' },
    { id: 3, student: 'Mike Johnson', test: 'Node.js Basics', score: 95, time: '22 min', date: 'Feb 5, 2026' },
    { id: 4, student: 'Sarah Williams', test: 'SQL Queries', score: 85, time: '30 min', date: 'Feb 5, 2026' },
    { id: 5, student: 'Tom Brown', test: 'Data Structures', score: 78, time: '42 min', date: 'Feb 4, 2026' },
  ];

  const stats = [
    { label: 'Total Students', value: '1,248', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Total Tests', value: '42', change: '+5%', icon: FileText, color: 'green' },
    { label: 'Questions Bank', value: '856', change: '+18%', icon: Award, color: 'purple' },
    { label: 'Avg Performance', value: '82%', change: '+3%', icon: TrendingUp, color: 'orange' },
  ];

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuestions = questions.filter(question =>
    question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubmissions = submissions.filter(submission =>
    submission.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.test.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-indigo-100">Manage tests, questions, and monitor student performance</p>
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
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeSection}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200">
              <Plus size={20} />
              <span>Add New</span>
            </button>
          </div>

          {/* Subjects Section */}
          {activeSection === 'subjects' && (
            <div className="space-y-4">
              {filteredSubjects.map((subject) => (
                <div key={subject.id} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{subject.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Tests</p>
                          <p className="text-lg font-bold text-gray-800">{subject.tests}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Questions</p>
                          <p className="text-lg font-bold text-gray-800">{subject.questions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Students</p>
                          <p className="text-lg font-bold text-gray-800">{subject.students}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Score</p>
                          <p className="text-lg font-bold text-gray-800">{subject.avgScore}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit size={20} className="text-blue-600" />
                      </button>
                      <button className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <Trash2 size={20} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Questions Section */}
          {activeSection === 'questions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Question</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Subject</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Difficulty</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Usage</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question) => (
                    <tr key={question.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-800">{question.question}</td>
                      <td className="py-4 px-4 text-gray-600">{question.subject}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[question.difficulty]}`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{question.usage} times</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={18} className="text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Submissions Section */}
          {activeSection === 'submissions' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Student</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Test</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-800">{submission.student}</td>
                      <td className="py-4 px-4 text-gray-600">{submission.test}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          submission.score >= 90 ? 'bg-green-100 text-green-700' :
                          submission.score >= 75 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {submission.score}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{submission.time}</td>
                      <td className="py-4 px-4 text-gray-600">{submission.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                <h3 className="font-bold text-gray-800 mb-4">Top Performing Students</h3>
                <div className="space-y-3">
                  {[
                    { name: 'John Doe', score: 95, tests: 12 },
                    { name: 'Jane Smith', score: 93, tests: 11 },
                    { name: 'Mike Johnson', score: 91, tests: 10 },
                  ].map((student, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.tests} tests completed</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">{student.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                <h3 className="font-bold text-gray-800 mb-4">Most Popular Tests</h3>
                <div className="space-y-3">
                  {[
                    { name: 'React Fundamentals', attempts: 245 },
                    { name: 'JavaScript Advanced', attempts: 198 },
                    { name: 'Node.js Basics', attempts: 156 },
                  ].map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{test.name}</p>
                        <p className="text-sm text-gray-500">{test.attempts} attempts</p>
                      </div>
                      <div className="w-16 h-16">
                        <svg className="transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeDasharray={`${(test.attempts / 250) * 100}, 100`}
                          />
                        </svg>
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

export default Admin;
