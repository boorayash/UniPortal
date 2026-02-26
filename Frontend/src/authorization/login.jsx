import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock, Loader2, ArrowRight, User, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// import * as THREE from 'three';

// function createCircleTexture() {
//   const canvas = document.createElement('canvas');
//   const size = 64; // Texture resolution
//   canvas.width = size;
//   canvas.height = size;
//   const ctx = canvas.getContext('2d');

//   // Create a radial gradient (white in center, transparent at edges)
//   const center = size / 2;
//   const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
//   gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Center color
//   gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)'); // Mid-point
//   gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Outer edge transparent

//   ctx.fillStyle = gradient;
//   ctx.fillRect(0, 0, size, size);

//   const texture = new THREE.CanvasTexture(canvas);
//   // Optional: these settings can sometimes improve visual quality of points
//   texture.minFilter = THREE.NearestFilter;
//   texture.magFilter = THREE.NearestFilter;
//   return texture;
// }

// function createStarTexture() {
//   if (typeof document === 'undefined') return null;
//   const canvas = document.createElement('canvas');
//   const size = 64;
//   canvas.width = size;
//   canvas.height = size;
//   const ctx = canvas.getContext('2d');

//   const center = size / 2;
//   const outerRadius = size / 2;
//   const innerRadius = size / 5;
//   const spikes = 4; // Change to 5 for a classic star

//   ctx.beginPath();
//   for (let i = 0; i < spikes * 2; i++) {
//     const r = i % 2 === 0 ? outerRadius : innerRadius;
//     const angle = (Math.PI * i) / spikes;
//     ctx.lineTo(center + Math.cos(angle) * r, center + Math.sin(angle) * r);
//   }
//   ctx.closePath();

//   // Gradient fill for a glowing effect
//   const gradient = ctx.createRadialGradient(center, center, innerRadius, center, center, outerRadius);
//   gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
//   gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
//   ctx.fillStyle = gradient;
//   ctx.fill();

//   const texture = new THREE.CanvasTexture(canvas);
//   return texture;
// }

// --- 3D PARTICLE BACKGROUND (UPDATED WITH SHAPE) ---
// function ParticleField() {
//   const points = useRef();
//   const count = 5000; 

//   // Generate positions (same as before)
//   const positions = useMemo(() => {
//     const pos = new Float32Array(count * 3);
//     for (let i = 0; i < count; i++) {
//       pos[i * 3] = (Math.random() - 0.5) * 14; 
//       pos[i * 3 + 1] = (Math.random() - 0.5) * 14; 
//       pos[i * 3 + 2] = (Math.random() - 0.5) * 14; 
//     }
//     return pos;
//   }, []);

  // Generate the circle texture once
//   const circleTexture = useMemo(() => createStarTexture(), []);

//   useFrame((state) => {
//     const t = state.clock.getElapsedTime();
//     if (points.current) {
//       points.current.rotation.y = t * 0.05;
//       points.current.rotation.x = Math.sin(t * 0.1) * 0.1;
//     }
//   });

//   return (
//     <points ref={points}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.05} // Increased size slightly for circles
//         color="#8b5cf6"
//         map={circleTexture} // <--- Apply the circular texture map
//         transparent
//         opacity={0.8} // Increased opacity slightly for better visibility
//         alphaTest={0.01} // <--- Critical: cuts off the transparent corners of the texture
//         sizeAttenuation
//         blending={THREE.AdditiveBlending}
//         depthWrite={false}
//       />
//     </points>
//   );
// }

// function FloatingShapes() {
//   const group = useRef();
//   const shapes = useMemo(
//     () =>
//       Array.from({ length: 150 }, () => ({
//         position: [
//           (Math.random() - 0.5) * 14,
//           (Math.random() - 0.5) * 14,
//           (Math.random() - 0.5) * 14
//         ],
//         rotation: Math.random() * Math.PI
//       })),
//     []
//   );

//   useFrame(({ clock }) => {
//     if (group.current) {
//       group.current.rotation.y = clock.elapsedTime * 0.05;
//     }
//   });

//   return (
//     <group ref={group}>
//       {shapes.map((s, i) => (
//         <mesh key={i} position={s.position} rotation={[s.rotation, s.rotation, 0]}>
//           <tetrahedronGeometry args={[0.15]} />
//           <meshStandardMaterial
//             color="#8b5cf6"
//             emissive="#8b5cf6"
//             emissiveIntensity={0.4}
//             transparent
//             opacity={0.7}
//           />
//         </mesh>
//       ))}
//     </group>
//   );
// }


// --- 3D TILT CARD (FIXED) ---
function TiltCard({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d" 
      }}
      className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-md perspective-1000"
    >
      {/* CRITICAL FIX: 
        Removed "transform: translateZ(50px)" from this wrapper.
        Inputs inside high 3D transforms often become unclickable in Chrome/Edge.
        We keep the tilt on the parent, but keep the inputs "flat" on the card surface.
      */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// --- MAIN LOGIN COMPONENT ---
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) throw new Error(data.message || "Account pending approval");
        throw new Error(data.message || "Login failed");
      }

      // Store role for UI routing, but not the token (it's in a cookie)
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      
      // Use navigate with replace
      if (data.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (data.role === 'student') navigate('/student/dashboard', { replace: true });
      else if (data.role === 'professor') navigate('/professor/dashboard', { replace: true });
      else setError("Invalid role. Contact administrator.");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* BACKGROUND: Strict pointer-events-none applied to style */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas 
          style={{ pointerEvents: "none" }} // Ensures canvas never captures clicks
          camera={{ position: [0, 0, 5], fov: 60 }}
        >
          {/* <ParticleField /> */}
          {/* <FloatingShapes /> */}
        </Canvas>
      </div>

      {/* CARD CONTAINER */}
      <div className="relative z-50 w-full px-4 flex justify-center">
        <TiltCard>
          
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-3xl mb-6 shadow-lg shadow-purple-500/30"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome to UniPortal</h1>
            <p className="text-slate-400 mt-2 font-medium">Enter your credentials to continue</p>
          </div>

          <motion.form onSubmit={handleSubmit} className="space-y-6 relative z-50">
            
            <motion.div className="relative group z-50">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all relative z-50"
                required
              />
            </motion.div>

            <motion.div className="relative group z-50">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all relative z-50"
                required
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-300 text-sm font-medium">{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 cursor-pointer relative z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-500/20 flex justify-center items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          <div className="text-center mt-6 space-y-2">
            <p className="text-slate-400 text-sm">
              <Link to="/forgot-password" size="sm" className="hover:text-purple-300 transition-colors">
                Forgot Password?
              </Link>
            </p>
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="underline font-semibold hover:text-purple-300 text-white">
                Sign Up
              </Link>
            </p>
          </div>

        </TiltCard>
      </div>
    </div>
  );
}






// import React, { useState, useRef, useMemo } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
// import { Lock, Loader2, ArrowRight, Mail, Key } from 'lucide-react';
// import * as THREE from 'three';

// // --- 3D PARTICLE BACKGROUND COMPONENT ---
// function ParticleField() {
//   const points = useRef();
//   const count = 3000; // Adjusted for performance

//   const positions = useMemo(() => {
//     const pos = new Float32Array(count * 3);
//     for (let i = 0; i < count; i++) {
//       pos[i * 3] = (Math.random() - 0.5) * 15; // X
//       pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y
//       pos[i * 3 + 2] = (Math.random() - 0.5) * 15; // Z
//     }
//     return pos;
//   }, []);

//   useFrame((state) => {
//     const t = state.clock.getElapsedTime();
//     if (points.current) {
//       points.current.rotation.y = t * 0.05;
//       points.current.rotation.x = Math.sin(t * 0.1) * 0.1;
//     }
//   });

//   return (
//     <points ref={points}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.03}
//         color="#6366f1"
//         transparent
//         opacity={0.6}
//         sizeAttenuation
//         blending={THREE.AdditiveBlending}
//         depthWrite={false}
//       />
//     </points>
//   );
// }

// // --- 3D TILT CARD WRAPPER ---
// function TiltCard({ children }) {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
//   const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

//   const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
//   const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const width = rect.width;
//     const height = rect.height;
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;
//     const xPct = mouseX / width - 0.5;
//     const yPct = mouseY / height - 0.5;
//     x.set(xPct);
//     y.set(yPct);
//   };

//   return (
//     <motion.div
//       onMouseMove={handleMouseMove}
//       onMouseLeave={() => {
//         x.set(0);
//         y.set(0);
//       }}
//       style={{
//         rotateX,
//         rotateY,
//         transformStyle: "preserve-3d",
//       }}
//       className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-md perspective-1000"
//     >
//       <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
//         {children}
//       </div>
//     </motion.div>
//   );
// }

// // --- MAIN LOGIN COMPONENT ---
// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload
//     setIsLoading(true);
//     setError("");

//     try {
//       // Simulating API call for demonstration if backend is offline
//       // Remove this timeout block for real production use
//       await new Promise(resolve => setTimeout(resolve, 1500)); 
      
//       const response = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || "Login failed");

//       if (data.token) localStorage.setItem('token', data.token);
      
//       // FIXED: Used backticks for template literal
//       window.location.href = `/${data.role}/dashboard`; 

//     } catch (err) {
//       // For demo purposes, we log the error but allow UI testing
//       console.error(err);
//       setError(err.message || "Invalid credentials provided");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden font-sans">
//       {/* 3D Space Background */}
//       <div className="absolute inset-0 z-0">
//         <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
//           <ParticleField />
//         </Canvas>
//       </div>

//       {/* Glassmorphism Auth Card */}
//       <div className="relative z-10 w-full px-4 flex justify-center">
//         <TiltCard>
//           <div className="text-center mb-8">
//             <motion.div
//               initial={{ scale: 0.5, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-3xl mb-6 shadow-lg shadow-indigo-500/30"
//             >
//               <Lock className="w-10 h-10 text-white" />
//             </motion.div>
//             <h1 className="text-4xl font-extrabold text-white tracking-tight">Join the Void</h1>
//             <p className="text-slate-400 mt-2 font-medium">Secure access to your terminal</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Input */}
//             <div className="relative group">
//               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 transition-all"
//                 required
//               />
//             </div>

//             {/* Password Input */}
//             <div className="relative group">
//               <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
//               <input
//                 type="password"
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-black/40 transition-all"
//                 required
//               />
//             </div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md"
//               >
//                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//                 <span className="text-red-400 text-sm font-medium">{error}</span>
//               </motion.div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <Loader2 className="animate-spin w-6 h-6" />
//               ) : (
//                 <>
//                   Authorize
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </button>
//           </form>
//         </TiltCard>
//       </div>
//     </div>
//   );
// }





// import { useState, useEffect, useRef } from 'react';
// import { Lock, User, ArrowRight, Zap, Hexagon } from 'lucide-react';
// import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
// import '../App.css';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isFocused, setIsFocused] = useState(false); // Tracks if user is typing

//   // --- Mouse Physics ---
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   // Smooth the mouse movement
//   const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
//   const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

//   // Handle Mouse Move
//   const handleMouseMove = (e) => {
//     // If user is focused on typing, we neutralize the movement (lock the screen)
//     if (isFocused) {
//       mouseX.set(0);
//       mouseY.set(0);
//       return;
//     }
//     const { innerWidth, innerHeight } = window;
//     mouseX.set((e.clientX / innerWidth) * 2 - 1); // -1 to 1
//     mouseY.set((e.clientY / innerHeight) * 2 - 1);
//   };

//   // --- Original Logic ---
//   const handleSubmit = async () => {
//     setIsLoading(true);
//     setError("");

//     try {
//       // Simulate delay for effect if testing locally (optional, remove in prod)
//       // await new Promise(r => setTimeout(r, 1500)); 

//       const response = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: username, password: password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Login failed");
//         setIsLoading(false);
//         return;
//       }

//       if (data.token) localStorage.setItem('token', data.token);

//       const rolePaths = {
//         admin: "/admin/dashboard",
//         student: "/student/dashboard",
//         professor: "/professor/dashboard",
//         hod: "/hod/dashboard"
//       };

//       if (rolePaths[data.role]) {
//         window.location.href = rolePaths[data.role];
//       } else {
//         setError("Invalid role. Contact administrator.");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Something went wrong. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div 
//       onMouseMove={handleMouseMove}
//       className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30 text-white"
//     >
//       {/* --- Ambient Background --- */}
//       <div className="absolute inset-0 pointer-events-none">
//         {/* Grain Overlay for texture */}
//         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
//         {/* Deep Glows */}
//         <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px]" />
//         <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[120px]" />
//       </div>

//       {/* --- The Floating UI Container --- */}
//       <div className="relative z-10 w-full max-w-sm px-4">
        
//         {/* 1. Floating Header (Highest Parallax) */}
//         <FloatingLayer x={smoothX} y={smoothY} depth={40} isFocused={isFocused}>
//            <div className="text-center mb-12 relative">
//              <div className="absolute left-1/2 -translate-x-1/2 -top-12 opacity-20 animate-pulse-slow">
//                <Hexagon size={120} strokeWidth={0.5} />
//              </div>
//              <motion.h1 
//                initial={{ opacity: 0, y: 20 }}
//                animate={{ opacity: 1, y: 0 }}
//                className="text-5xl font-bold tracking-tighter bg-gradient-to-br from-white via-gray-400 to-gray-600 bg-clip-text text-transparent"
//              >
//                NEXUS
//              </motion.h1>
//              <motion.p 
//                initial={{ opacity: 0 }}
//                animate={{ opacity: 1 }}
//                transition={{ delay: 0.2 }}
//                className="text-xs tracking-[0.3em] text-cyan-500 uppercase mt-2 font-medium"
//              >
//                Secure Gateway v.2.0
//              </motion.p>
//            </div>
//         </FloatingLayer>

//         {/* 2. Floating Form Elements (Medium Parallax) */}
//         <div className="space-y-6">
          
//           {/* Username Input */}
//           <FloatingLayer x={smoothX} y={smoothY} depth={20} isFocused={isFocused} delay={0.1}>
//             <GlassInput 
//               icon={User} 
//               type="text" 
//               placeholder="Identity" 
//               value={username} 
//               onChange={setUsername}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//             />
//           </FloatingLayer>

//           {/* Password Input */}
//           <FloatingLayer x={smoothX} y={smoothY} depth={-20} isFocused={isFocused} delay={0.2}>
//             <GlassInput 
//               icon={Lock} 
//               type="password" 
//               placeholder="Credentials" 
//               value={password} 
//               onChange={setPassword}
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//             />
//           </FloatingLayer>

//           {/* Error Message */}
//           <AnimatePresence>
//             {error && (
//               <motion.div 
//                 initial={{ opacity: 0, height: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, height: 'auto', scale: 1 }}
//                 exit={{ opacity: 0, height: 0, scale: 0.9 }}
//                 className="overflow-hidden"
//               >
//                  <div className="bg-red-500/10 border-l-2 border-red-500 p-3 text-red-400 text-xs tracking-wide">
//                    ERROR: {error}
//                  </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Action Button (Negative Parallax - moves opposite) */}
//           <FloatingLayer x={smoothX} y={smoothY} depth={-40} isFocused={isFocused} delay={0.3}>
//             <button
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="relative group w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-all duration-300 overflow-hidden"
//             >
//               <div className="absolute inset-0 flex items-center justify-center gap-3">
//                  <span className="font-semibold tracking-widest uppercase text-sm">
//                    {isLoading ? "Authenticating..." : "Initialize"}
//                  </span>
//                  {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-cyan-400" />}
//               </div>
              
//               {/* Button Progress Bar Loading Effect */}
//               {isLoading && (
//                  <motion.div 
//                    className="absolute bottom-0 left-0 h-[2px] bg-cyan-500"
//                    initial={{ width: "0%" }}
//                    animate={{ width: "100%" }}
//                    transition={{ duration: 2, ease: "easeInOut" }}
//                  />
//               )}
//             </button>
//           </FloatingLayer>
          
//         </div>

//         {/* 3. Footer Status (Static) */}
//         <div className="mt-12 text-center">
//             <p className="text-[10px] text-gray-600 font-mono">
//               SYSTEM STATUS: <span className="text-emerald-500/80">ONLINE</span> • ENCRYPTION: <span className="text-emerald-500/80">256-BIT</span>
//             </p>
//         </div>

//       </div>
//     </div>
//   );
// }

// // --- Sub-Components ---

// /**
//  * Wraps content in a floating div that moves based on mouse position.
//  * Snaps back to center (0,0) when `isFocused` is true.
//  */
// function FloatingLayer({ x, y, depth, isFocused, delay = 0, children }) {
//   // If focused, we force position to 0 (locked). Otherwise, we use parallax.
//   const moveX = useTransform(x, [-1, 1], [depth, -depth]);
//   const moveY = useTransform(y, [-1, 1], [depth, -depth]);
  
//   return (
//     <motion.div
//       style={{ 
//         x: isFocused ? 0 : moveX, 
//         y: isFocused ? 0 : moveY,
//       }}
//       animate={{ 
//         scale: isFocused ? 1.02 : 1,
//         filter: isFocused ? "blur(0px)" : "blur(0px)" // Can add blur when idle if desired
//       }}
//       transition={{ 
//         type: "spring", 
//         stiffness: isFocused ? 300 : 150, 
//         damping: 20,
//         delay: delay 
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// }

// function GlassInput({ icon: Icon, onFocus, onBlur, ...props }) {
//   const [localFocus, setLocalFocus] = useState(false);

//   return (
//     <div className="relative group">
//       {/* Cyberpunk corner markers */}
//       <div className={`absolute -top-1 -left-1 w-2 h-2 border-t border-l transition-colors duration-300 ${localFocus ? 'border-cyan-500' : 'border-transparent'}`} />
//       <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b border-r transition-colors duration-300 ${localFocus ? 'border-cyan-500' : 'border-transparent'}`} />
      
//       <div 
//         className={`
//           flex items-center bg-black/40 backdrop-blur-md border rounded-lg overflow-hidden transition-all duration-500
//           ${localFocus ? 'border-cyan-500/50 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]' : 'border-white/5'}
//         `}
//       >
//         <div className="pl-4 pr-3 text-gray-500 group-hover:text-cyan-400 transition-colors">
//           <Icon size={18} />
//         </div>
//         <input 
//           {...props}
//           onFocus={(e) => { setLocalFocus(true); if(onFocus) onFocus(e); }}
//           onBlur={(e) => { setLocalFocus(false); if(onBlur) onBlur(e); }}
//           className="w-full bg-transparent py-4 text-white placeholder-gray-600 focus:outline-none text-sm tracking-wide font-light"
//         />
        
//         {/* Animated Scan Line (Only appears on focus) */}
//         {localFocus && (
//           <motion.div 
//             layoutId="scanline"
//             className="absolute left-0 w-1 h-1/2 bg-cyan-400 blur-[2px] rounded-r-full"
//             initial={{ top: "10%" }}
//             animate={{ top: ["10%", "80%", "10%"] }}
//             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }













// import { useState } from 'react';
// import { Lock, User, ArrowRight } from 'lucide-react';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isHovered, setIsHovered] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         credentials: "include",  
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: username,
//           password: password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Login failed");
//         setIsLoading(false);
//         return;
//       }

//       // Check the role from the backend
//       const role = data.role;
//       // Save token in localStorage so other components can use Authorization header
//       if (data.token) localStorage.setItem('token', data.token);

//       if (role === "admin") {
//         window.location.href = "/admin/dashboard";
//       } 
//       else if (role === "student") {
//         window.location.href = "/student/dashboard";
//       }
//       else if (role === "professor") {
//         window.location.href = "/professor/dashboard";
//       }
//       else if (role === "hod") {
//         window.location.href = "/hod/dashboard";
//       }
//       else {
//         setError("Invalid role. Contact administrator.");
//       }
//     } 
//     catch (err) {
//       console.error("Login error:", err);
//       setError("Something went wrong. Try again.");
//     } 
//     finally {
//       setIsLoading(false); 
//     }
//   };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#101020] to-[#0d0d0d] p-4 relative overflow-hidden">

//       {/* Glowing background blobs */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700/30 rounded-full blur-[150px] animate-pulse"></div>
//         <div className="absolute top-40 -right-40 w-96 h-96 bg-blue-700/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
//         <div className="absolute -bottom-40 left-40 w-96 h-96 bg-indigo-700/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '4s' }}></div>
//       </div>

//       {/* Login Card */}
//       <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 w-full max-w-md transition-transform duration-500 hover:scale-105">

//         <div className="text-center mb-8">
//           <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 transition-transform duration-300 hover:rotate-6">
//             <Lock className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
//           <p className="text-gray-300 mt-1">Enter your credentials to continue</p>
//         </div>

//         <div className="space-y-6">

//           {/* Username */}
//           <div className="relative">
//             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter username"
//               className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition backdrop-blur-sm"
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition backdrop-blur-sm"
//             />
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-500/20 border border-red-300/20 rounded-xl p-3 text-red-300 text-sm text-center backdrop-blur-sm">
//               {error}
//             </div>
//           )}

//           {/* Login Button */}
//           <button
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg flex justify-center items-center gap-2 transition-transform duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <span>{isLoading ? 'Logging in...' : 'Login'}</span>
//             {!isLoading && (
//               <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
