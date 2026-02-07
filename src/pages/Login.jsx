import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogle, signOut, auth } from "../config/firebase";

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hardcoded credentials
  const VALID_CREDENTIALS = {
    username: "admin",
    password: "admin123"
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        setError("");
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 500);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (usePhone) {
      const phone = e.target.phone.value;
      if (!phone) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }
      if (phone.length < 10) {
        setError("Please enter a valid phone number");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        alert("Account created successfully!");
        navigate("/dashboard");
      }, 500);
    } else {
      const username = e.target.username.value;
      const password = e.target.password.value;

      if (!username || !password) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }
      setTimeout(() => {
        alert("Account created successfully!");
        navigate("/dashboard");
      }, 500);
    }
  };
//google login handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const email = user.email;

      if (!email.endsWith("@bitsathy.ac.in")) {
        await signOut(auth);
        alert("Only @bitsathy.ac.in accounts are allowed");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setError("");
    setUsePhone(false);
  };

  const togglePhoneAuth = () => {
    setUsePhone(!usePhone);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl">
        <div className={`grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ${isSignup ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Form Section */}
          <div className={`p-8 lg:p-12 flex items-center justify-center order-2 lg:order-${isSignup ? '2' : '1'}`}>
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600">
                  {isSignup ? 'Sign up to get started' : 'Log in to continue'}
                </p>
              </div>

              {!isSignup ? (
                // LOGIN FORM
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <input 
                      type="text" 
                      name="username" 
                      placeholder="Username" 
                      // required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Password" 
                      // required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  

                  {/* <div className="text-right">
                    <a href="#forgot" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </a>
                  </div> */}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <FcGoogle size={24} />
                    <span className="font-medium">Continue with Google</span>
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={handleToggle} 
                      className="text-blue-600 font-semibold hover:text-blue-800"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              ) : (
                // SIGNUP FORM
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  {!usePhone ? (
                    <>
                      <div>
                        <input 
                          type="text" 
                          name="username" 
                          placeholder="Username" 
                          required
                          autocomplete="off"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <input 
                          type="email" 
                          name="Email address" 
                          placeholder="Email address" 
                          required
                          autocomplete="off"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <input 
                          type="password" 
                          name="password" 
                          placeholder="Password" 
                          required
                          autoComplete="new-password"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      {/* <select className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"> */}
                        {/* <option value="+1">+1</option>
                        <option value="+91">+91</option>
                        <option value="+44">+44</option>
                        <option value="+86">+86</option>
                        <option value="+81">+81</option>
                      </select> */}
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="Phone number" 
                        required
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <FcGoogle size={24} />
                    <span className="font-medium">Continue with Google</span>
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={handleToggle} 
                      className="text-blue-600 font-semibold hover:text-blue-800"
                    >
                      Log In
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Welcome Section */}
          <div className={`bg-gradient-to-br from-blue-500 to-indigo-600 p-8 lg:p-12 flex items-center justify-center text-white order-1 lg:order-${isSignup ? '1' : '2'}`}>
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl font-bold">
                {isSignup ? 'Hello!' : 'Welcome Back!'}
              </h1>
              <p className="text-xl text-white/90 max-w-md mx-auto">
                {isSignup 
                  ? 'Start your learning journey with us today' 
                  : 'Continue your learning journey with BIT Test Portal'
                }
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <div className="w-16 h-1 bg-white/50 rounded-full"></div>
                <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                <div className="w-16 h-1 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
