import { useState } from 'react';
import { User, Lock, Mail, Upload, ArrowRight, X } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const handleSubmit = () => {
    console.log('Signup attempted:', { name, username, password, profilePicture });
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
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 w-full max-w-md transition-transform duration-500 hover:scale-105">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 transition-transform duration-300 hover:rotate-6">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-white/70 mt-1">Join us today and get started</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">

          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:bg-white/20 transition backdrop-blur-sm"
            />
          </div>

          {/* Picture Upload */}
          <div>
            <input type="file" accept="image/*" className="hidden" id="profile" onChange={handleFileChange} />

            {!previewUrl ? (
              <label htmlFor="profile" className="cursor-pointer flex justify-center items-center gap-2 py-3 border-2 border-dashed border-white/30 rounded-xl text-white hover:bg-white/10 transition">
                <Upload className="w-5 h-5" /> Upload Profile Picture
              </label>
            ) : (
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 p-3 rounded-xl backdrop-blur-sm">
                <img src={previewUrl} className="w-16 h-16 rounded-lg object-cover" alt="Preview" />
                <div className="text-white flex-1">
                  <p className="text-sm font-medium truncate">{profilePicture.name}</p>
                  <p className="text-xs text-white/60">{(profilePicture.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={handleRemoveImage} className="p-2 rounded-lg hover:bg-white/20 transition">
                  <X className="text-white w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-semibold shadow-lg flex justify-center items-center gap-2 transition-all hover:scale-105"
          >
            <span>Sign Up</span>
            <ArrowRight className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>

        <p className="text-center text-white mt-6">
          Already a user?{" "}
          <a href="/login" className="underline font-semibold hover:text-purple-300">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
