import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock, Loader2, ArrowRight, User, Key } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
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
      const response = await fetch(`${API_URL}/auth/login`, {
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

