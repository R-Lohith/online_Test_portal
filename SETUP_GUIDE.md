# 🚀 Setup Guide - BIT Test Portal

This guide will walk you through setting up and running the BIT Test Portal on your local machine.

## 📦 Step 1: Prerequisites

Make sure you have the following installed on your system:

### Check Node.js Installation
```bash
node --version
```
Should show v14.0.0 or higher

### Check npm Installation
```bash
npm --version
```
Should show 6.0.0 or higher

### If not installed:
- Download from: https://nodejs.org/
- Install the LTS (Long Term Support) version

## 🔧 Step 2: Installation

### Option A: Using Terminal/Command Prompt

1. **Navigate to the project folder**
   ```bash
   cd bit-test-portal
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   This will take 2-5 minutes depending on your internet speed.

3. **Wait for installation to complete**
   You should see a progress bar and eventually a success message.

### Option B: Using VS Code

1. Open VS Code
2. File → Open Folder → Select `bit-test-portal`
3. Open Terminal in VS Code (Ctrl+` or View → Terminal)
4. Run: `npm install`

## ▶️ Step 3: Running the Application

### Start Development Server
```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Open in Browser
1. Open your web browser
2. Go to: `http://localhost:3000`
3. You should see the login page

## 🔑 Step 4: Login

### Method 1: Username/Password
- **Username:** admin
- **Password:** admin123

### Method 2: Google Sign-in
- Click "Continue with Google"
- Sign in with an email ending in @bitsathy.ac.in
- Other emails will be rejected

## 🎯 Step 5: Explore Features

After logging in, you'll have access to:

1. **Dashboard** - View your stats and progress
2. **MCQ Tests** - Browse and take tests
3. **Code Editor** - Write and run code
4. **Results** - View your achievements
5. **Admin** - Manage tests and questions

## 🛠️ Common Issues & Solutions

### Issue 1: Port 3000 already in use
**Solution:** Vite will automatically use port 3001, 3002, etc.
Or kill the process using port 3000:
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue 2: Module not found errors
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 3: Firebase errors
**Solution:**
- Check your internet connection
- Verify Firebase configuration in `src/config/firebase.js`
- Make sure your email domain is @bitsathy.ac.in for Google login

### Issue 4: Blank white screen
**Solution:**
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Check browser console for errors
# Right-click → Inspect → Console tab
```

### Issue 5: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

## 📱 Testing Responsiveness

1. **Desktop:** Use browser normally
2. **Mobile:** 
   - Open browser DevTools (F12)
   - Click device toolbar icon (Ctrl+Shift+M)
   - Select a mobile device from dropdown
3. **Tablet:**
   - Same as mobile, choose iPad or tablet size

## 🔄 Making Changes

### Edit Code
1. Make changes to any file in `src/`
2. Save the file (Ctrl+S)
3. Browser will automatically refresh (Hot Module Replacement)

### Add New Features
1. Create new component in `src/components/` or `src/pages/`
2. Import it in `src/App.jsx`
3. Add route if needed

## 🏗️ Building for Production

When ready to deploy:

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder.

## 📚 Additional Resources

### Learn React
- Official Docs: https://react.dev
- Tutorial: https://react.dev/learn

### Learn Tailwind CSS
- Official Docs: https://tailwindcss.com
- Playground: https://play.tailwindcss.com

### Firebase Documentation
- Getting Started: https://firebase.google.com/docs
- Authentication: https://firebase.google.com/docs/auth

### Recharts (Charts Library)
- Examples: https://recharts.org/en-US/examples

## 🆘 Getting Help

If you encounter issues:

1. Check the error message in terminal
2. Check browser console (F12 → Console tab)
3. Read the error message carefully
4. Search for the error on Google or Stack Overflow
5. Check if node_modules installed correctly

## ✅ Checklist

- [ ] Node.js and npm installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Application opens in browser
- [ ] Can login successfully
- [ ] All pages accessible
- [ ] No errors in browser console

---

If you've completed all steps successfully, you're ready to start developing! 🎉
