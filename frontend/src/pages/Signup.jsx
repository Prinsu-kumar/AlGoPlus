import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Signup Card */}
      <div className="relative w-full max-w-md">
        {/* Card with Glass Effect */}
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500"></div>
          
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                <h1 className="text-3xl font-bold text-white">
                  <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-white bg-clip-text text-transparent">
                    Join AlGoPlUs
                  </span>
                </h1>
                <div className="w-2 h-2 bg-purple-500 rounded-full ml-2 animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-sm">Start your coding journey</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* First Name Field */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
                  <input
                    type="text"
                    placeholder="John"
                    className={`relative w-full px-4 py-3 bg-gray-800/50 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all`}
                    {...register('firstName')}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
                  <input
                    type="email"
                    placeholder="coder@leetcode.com"
                    className={`relative w-full px-4 py-3 bg-gray-800/50 border ${
                      errors.emailId ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all`}
                    {...register('emailId')}
                  />
                </div>
                {errors.emailId && (
                  <p className="mt-2 text-sm text-red-400">{errors.emailId.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
                  <div className="relative flex">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`flex-1 px-4 py-3 bg-gray-800/50 border ${
                        errors.password ? 'border-red-500' : 'border-gray-700'
                      } rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-4 bg-gray-800/50 border border-l-0 border-gray-700 hover:bg-gray-700/50 rounded-r-lg transition-colors duration-200 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 w-1/2 bg-white/20 skew-x-12 translate-x-[-200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </span>
              </button>

              {/* Terms Agreement */}
              <div className="mt-4">
                <p className="text-gray-500 text-xs text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </form>

            {/* Login Redirect */}
            <div className="text-center mt-8 pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <NavLink
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                >
                  Sign In
                </NavLink>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Code Elements */}
        <div className="absolute -top-6 -left-6 text-gray-700 font-mono text-sm">
          &lt;Signup/&gt;
        </div>
        <div className="absolute -bottom-6 -right-6 text-gray-700 font-mono text-sm">
          {`{register:true}`}
        </div>
      </div>
    </div>
  );
}

export default Signup;