import { useState } from 'react';
import { Search, Filter, Lock, Unlock, Clock, Award } from 'lucide-react';

const MCQTests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Language', 'DSA'];

  const tests = [
    {
      id: 1,
      title: 'React Fundamentals',
      category: 'Frontend',
      questions: 25,
      duration: 30,
      level: 'Beginner',
      progress: 80,
      locked: false,
      color: 'blue'
    },
    {
      id: 2,
      title: 'JavaScript Advanced',
      category: 'Language',
      questions: 30,
      duration: 45,
      level: 'Advanced',
      progress: 60,
      locked: false,
      color: 'yellow'
    },
    {
      id: 3,
      title: 'Node.js & Express',
      category: 'Backend',
      questions: 28,
      duration: 40,
      level: 'Intermediate',
      progress: 45,
      locked: false,
      color: 'green'
    },
    {
      id: 4,
      title: 'SQL Queries',
      category: 'Database',
      questions: 20,
      duration: 35,
      level: 'Beginner',
      progress: 90,
      locked: false,
      color: 'purple'
    },
    {
      id: 5,
      title: 'MongoDB & NoSQL',
      category: 'Database',
      questions: 22,
      duration: 30,
      level: 'Intermediate',
      progress: 0,
      locked: false,
      color: 'green'
    },
    {
      id: 6,
      title: 'Data Structures',
      category: 'DSA',
      questions: 35,
      duration: 60,
      level: 'Advanced',
      progress: 25,
      locked: false,
      color: 'red'
    },
    {
      id: 7,
      title: 'Algorithms',
      category: 'DSA',
      questions: 40,
      duration: 75,
      level: 'Advanced',
      progress: 0,
      locked: true,
      color: 'red'
    },
    {
      id: 8,
      title: 'TypeScript Essentials',
      category: 'Language',
      questions: 25,
      duration: 30,
      level: 'Intermediate',
      progress: 0,
      locked: true,
      color: 'blue'
    },
  ];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const levelColors = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700',
  };

  const categoryColors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">MCQ Tests</h1>
        <p className="text-gray-600">Choose a test to begin your assessment</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Filter size={16} />
          <span>Showing {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              test.locked ? 'opacity-75' : ''
            }`}
          >
            {/* Header with gradient */}
            <div className={`h-3 bg-gradient-to-r ${categoryColors[test.color]}`}></div>
            
            <div className="p-6">
              {/* Title and Lock Status */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{test.title}</h3>
                {test.locked ? (
                  <Lock className="text-gray-400" size={20} />
                ) : (
                  <Unlock className="text-green-500" size={20} />
                )}
              </div>

              {/* Category and Level */}
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {test.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[test.level]}`}>
                  {test.level}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Award size={16} />
                  <span className="text-sm">{test.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span className="text-sm">{test.duration} Minutes</span>
                </div>
              </div>

              {/* Progress Bar */}
              {!test.locked && test.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{test.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${categoryColors[test.color]} transition-all duration-300`}
                      style={{ width: `${test.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                disabled={test.locked}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  test.locked
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : test.progress > 0
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                {test.locked ? 'Locked' : test.progress > 0 ? 'Continue' : 'Start Test'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <p className="text-gray-500 text-lg">No tests found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default MCQTests;
