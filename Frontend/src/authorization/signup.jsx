import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, ChevronDown } from 'lucide-react';

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

  useEffect(() => {
    fetch("http://localhost:5000/auth/departments")
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
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, departmentId }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setName(''); setEmail(''); setPassword(''); setRole(''); setDepartmentId('');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0f1f] to-[#1c0033] p-4 relative overflow-hidden">

      {/* Animated neon blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-40 w-96 h-96 bg-pink-600/25 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Card */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 w-full max-w-md transition-transform duration-500 hover:scale-[1.02]">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 transition-transform duration-300 hover:rotate-6">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white tracking-tight">Create Account</h1>
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
          {message && (
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
    </div>
  );
}
