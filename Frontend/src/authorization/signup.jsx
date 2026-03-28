import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, ChevronDown } from 'lucide-react';
import API_URL from '../config/api';
import logo from '../assets/logo/logo.png';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/auth/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data || []))
      .catch(() => setDepartments([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role || !departmentId) {
      setMessage("All fields are required");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name, email, password, role, departmentId }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setShowOTP(true);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setIsSuccess(false);
      setMessage("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setMessage('');
    
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Verification failed");
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage("Verification error. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-black via-[#0a0f1f] to-[#1c0033] p-4 relative overflow-hidden">

      {/* Animated neon blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-40 w-96 h-96 bg-pink-600/25 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Card */}
      <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 w-full max-w-md transition-all duration-500 ${showOTP ? 'blur-md scale-95 opacity-50 pointer-events-none' : 'hover:scale-[1.02]'}`}>

        <div className="text-center mb-8">
          <div className="inline-block mb-4 transition-transform duration-300 hover:rotate-6">
            <img src={logo} alt="UniPortal Logo" className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]" />
          </div>

          <h1 className="text-2xl md:text-text-4xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-white/70 mt-1">Join UniPortal today</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm"
            />
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="" className="text-black">Select Role</option>
              <option value="student" className="text-black">Student</option>
              <option value="professor" className="text-black">Professor</option>
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="" className="text-black">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id} className="text-black">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          {message && !showOTP && (
            <div className={`p-3 rounded-xl text-sm font-medium text-center ${isSuccess
                ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                : 'bg-red-500/10 border border-red-500/20 text-red-300'
              }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold shadow-lg flex justify-center items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
            {!isLoading && <ArrowRight className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />}
          </button>
        </form>

        <p className="text-center text-white/70 mt-6">
          Already have an account?{" "}
          <Link to="/" className="underline font-semibold hover:text-purple-300 text-white">
            Login
          </Link>
        </p>
      </div>

      {/* OTP Blur Modal */}
      {showOTP && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-sm transform transition-all scale-100">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Verify Email</h2>
            <p className="text-white/70 text-center mb-6 text-sm">We've sent a 6-digit code to {email}. Enter it below to verify your account.</p>
            
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-2xl py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm"
              />
              
              {message && (
                <div className={`p-3 rounded-xl text-sm font-medium text-center ${isSuccess ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-300'}`}>
                  {message}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold shadow-lg flex justify-center items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
