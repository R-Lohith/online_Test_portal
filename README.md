# 🎓 BIT Test Portal

A modern, responsive test portal built with React.js, Tailwind CSS, and Firebase. Features include dashboard analytics, MCQ tests, code editor, results tracking, and admin panel.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38bdf8)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff)

## ✨ Features

### 🎯 Dashboard
- Welcome banner with upcoming tests and streak tracking
- Statistics cards (MCQ Tests, Problems Solved, Average Score, Points)
- Progress over time chart
- Score distribution chart
- Skill radar chart
- Recent activity feed

### 📝 MCQ Tests
- Category filtering (Frontend, Backend, Database, Language, DSA)
- Test cards with progress tracking
- Level and question count display
- Color-coded subjects
- Locked/unlocked state management

### 💻 Code Editor
- Multi-language support (JavaScript, Python, Java, C++, TypeScript, Go, Rust)
- Syntax highlighting with line numbers
- Code execution simulation
- Copy code functionality
- Split editor/output view
- Responsive design

### 📊 Results & Profile
- Activity points tracking
- Tabbed view (Academics, Certifications, Events, Community)
- Recent achievements
- User profile with skills
- Progress statistics
- Achievement badges

### ⚙️ Admin Panel
- Subject management (Add, Edit, Delete)
- Question management
- Submissions tracking
- Student performance analytics
- Search and filter functionality
- Statistics dashboard

### 🔐 Authentication
- Firebase Google Sign-in with domain restriction (@bitsathy.ac.in)
- Username/Password login (admin/admin123)
- Protected routes with authentication check
- Auto-redirect based on auth status

## 🚀 Tech Stack

- **React 18** - UI library
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Firebase** - Authentication
- **Vite** - Build tool

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Extract the project**
   ```bash
   cd bit-test-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Login Credentials

### Standard Login:
- **Username:** admin
- **Password:** admin123

### Google Sign-in:
- Only emails ending with **@bitsathy.ac.in** are allowed

## 📁 Project Structure

```
bit-test-portal/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   └── ProtectedRoute.jsx  # Route protection component
│   ├── pages/
│   │   ├── Login.jsx            # Login page
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── MCQTests.jsx         # MCQ tests listing
│   │   ├── CodeEditor.jsx       # Code editor
│   │   ├── Results.jsx          # Results and profile
│   │   └── Admin.jsx            # Admin panel
│   ├── config/
│   │   └── firebase.js          # Firebase configuration
│   ├── hooks/
│   │   └── useAuth.js           # Authentication hook
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Key Features Implemented

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive grids and layouts
- Touch-friendly interfaces

### Interactive Elements
- Hover effects on cards
- Smooth transitions
- Loading states
- Active tab highlighting
- Progress animations

### Dynamic Data
- Sample data structure ready for API integration
- State management with React hooks
- Filtered views
- Search functionality

### Routing
All pages are properly routed:
- `/login` - Login page
- `/dashboard` - Dashboard
- `/mcq-tests` - MCQ Tests
- `/code-editor` - Code Editor
- `/results` - Results & Profile
- `/admin` - Admin Panel

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
    // ... more colors
  }
}
```

### Firebase Configuration
Update `src/config/firebase.js` with your Firebase project credentials.

### Data
Replace sample data in each component with API calls:
- `src/pages/Dashboard.jsx` - Update stats, charts, activity data
- `src/pages/MCQTests.jsx` - Update tests array
- `src/pages/Results.jsx` - Update achievements, points
- `src/pages/Admin.jsx` - Update subjects, submissions

### Charts
Modify chart configurations using Recharts documentation.

## 🌐 Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

To preview the production build:
```bash
npm run preview
```

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1023px
- **Desktop:** ≥ 1024px

## 🎯 Future Enhancements

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Test timer functionality
- [ ] Code execution backend
- [ ] Export results as PDF
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Leaderboard system

## 🐛 Troubleshooting

### Port already in use
If port 3000 is already in use, Vite will automatically use the next available port (3001, 3002, etc.).

### Firebase authentication issues
Make sure your Firebase configuration is correct and the domain is added to authorized domains in Firebase Console.

### Module not found errors
Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email your questions or create an issue in the repository.

---

Built with ❤️ using React and Tailwind CSS
