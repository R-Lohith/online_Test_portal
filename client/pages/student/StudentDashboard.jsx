import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const StudentDashboard = () => {
    const { user } = useAuth(); // Firebase user
    const navigate = useNavigate();
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try getting ID from localStorage (MongoDB) first, then Firebase
                const userId = localStorage.getItem('userId') || user?.uid;
                if (!userId) {
                    console.log("No user ID found");
                    setLoading(false);
                    return;
                }

                const mockProfile = {
                    currentLevel: "Medium",
                    unlockedLevels: ["Easy", "Medium", "Hard"]
                };

                const simulateFetchProfile = () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve(mockProfile) }), 500));
                
                const response = await simulateFetchProfile();
                if (response.ok) {
                    const data = await response.json();
                    setStudentProfile(data);
                } else {
                    console.error("Profile fetch failed");
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const levels = ['Easy', 'Medium', 'Hard'];

    const handleStartTest = (level) => {
        navigate(`/student/test/${level}`);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {levels.map((level) => {
                    const isUnlocked = studentProfile?.unlockedLevels?.includes(level);
                    // Simple logic: if unlocked, show as ready.

                    return (
                        <div key={level} className={`p-6 rounded-lg shadow-md border ${isUnlocked ? 'bg-white border-green-200' : 'bg-gray-100 border-gray-300 opacity-70'}`}>
                            <h2 className="text-xl font-bold mb-2">{level} Level</h2>
                            <p className="mb-4">
                                {isUnlocked ? 'Ready to attempt' : 'Locked. Complete previous level to unlock.'}
                            </p>
                            <button
                                onClick={() => handleStartTest(level)}
                                disabled={!isUnlocked}
                                className={`px-4 py-2 rounded text-white font-bold w-full ${isUnlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                {isUnlocked ? 'Start Test' : 'Locked'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
                <div className="bg-white p-4 rounded shadow">
                    <p><strong>Current Level:</strong> {studentProfile?.currentLevel}</p>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
