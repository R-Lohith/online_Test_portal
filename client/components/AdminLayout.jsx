import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Settings,
    Menu,
    X,
    LogOut,
    FileText,
    Users,
    Award,
    TrendingUp
} from 'lucide-react';
import { logOut } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            document.documentElement.classList.toggle("dark", newTheme === "dark");
            return newTheme;
        });
    };

    const navigation = [
        { name: 'Dashboard', path: '/admin', icon: TrendingUp, exact: true },
        { name: 'Manage Questions', path: '/admin/questions', icon: Award },
    ];

    const handleLogout = async () => {
        try {
            await logOut();
            // Clear ALL auth session data — no stale keys left behind
            ['token', 'role', 'userId', 'username', 'adminName'].forEach(k => localStorage.removeItem(k));
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        {sidebarOpen ? <X size={24} className="text-gray-600 dark:text-gray-300" /> : <Menu size={24} className="text-gray-600 dark:text-gray-300" />}
                    </button>
                    <h1 className="text-xl font-bold text-purple-600">Admin Portal</h1>
                    <button onClick={toggleTheme} className="p-2">
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 z-40 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-purple-600">BIT Admin</h1>
                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Administrator Access</p>
                        {user?.username && (
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2 flex items-center gap-1">
                                <span>👤</span> {user.username}
                            </p>
                        )}
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact === true}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout Admin</span>
                        </button>
                    </div>
                </div>
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <main className="lg:ml-64 pt-16 lg:pt-0">
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
