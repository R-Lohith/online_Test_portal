import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Code,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { logOut } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const { user } = useAuth();

  /* =========================
     DARK / LIGHT MODE (GLOBAL)
  ========================== */
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

  /* =========================
     NAVIGATION
  ========================== */
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Practice Tests', path: '/mcq-tests', icon: FileText },
    { name: 'Code Editor', path: '/code-editor', icon: Code },
    { name: 'Test Results', path: '/results', icon: BarChart3 },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      // Clear ALL auth session data — no stale keys left behind
      ['token', 'role', 'userId', 'username', 'adminName'].forEach(k => localStorage.removeItem(k));
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen">

      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0
        bg-white dark:bg-gray-900 shadow-md z-50 px-4 py-3">

        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="text-xl font-bold bg-gradient-to-r
            from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            BIT Portal
          </h1>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40
        bg-white dark:bg-gray-900 shadow-2xl
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">

          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r
              from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BIT Test Portal
            </h1>

            <button
              onClick={toggleTheme}
              className="mt-4 w-full flex items-center justify-center gap-2
                px-4 py-2 rounded-lg
                bg-gray-100 dark:bg-gray-800
                text-gray-800 dark:text-gray-200
                hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

            {user && (
              <div className="mt-4 flex items-center gap-3 p-3
                bg-blue-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 rounded-full
                  bg-gradient-to-br from-blue-500 to-indigo-600
                  flex items-center justify-center text-white font-semibold">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}
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
              className="w-full flex items-center gap-3 px-4 py-3
                rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
