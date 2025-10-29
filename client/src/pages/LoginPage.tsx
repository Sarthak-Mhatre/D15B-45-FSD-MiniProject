import React, { useState, useEffect } from 'react';
import { Code2, Users, Zap, MessageSquare, Palette, Bot, Pencil, Globe } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Feature card component with smooth animations
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
}> = ({ icon, title, description, isActive }) => {
  return (
    <div
      className={`absolute inset-0 transition-all duration-1000 ${
        isActive
          ? 'opacity-100 translate-x-0 scale-100'
          : 'opacity-0 translate-x-full scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-30 shadow-2xl h-full flex flex-col justify-center">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-2xl mb-3">{title}</h3>
            <p className="text-blue-100 text-base leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Login Page Component
const LoginPage: React.FC = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const navigate = useNavigate();

  // Animate login section on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoginVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Feature data array
  const features = [
    {
      icon: <Code2 className="w-8 h-8 text-white" />,
      title: "Real-time Collaboration",
      description: "Edit code simultaneously with your team across multiple files with instant synchronization. See changes as they happen, character by character.",
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "User Presence & Tooltips",
      description: "See who's online, what they're editing, and their current selection in real-time. Never lose track of your team's activities.",
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Code Execution",
      description: "Run your code directly in the browser with comprehensive language support. Test and debug without leaving the editor.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      title: "Group Chat",
      description: "Communicate with your team instantly while coding together. Discuss implementations, share ideas, and resolve issues in real-time.",
    },
    {
      icon: <Bot className="w-8 h-8 text-white" />,
      title: "AI Copilot",
      description: "AI-powered code generation and suggestions to boost your productivity. Get intelligent completions and entire code blocks on demand.",
    },
    {
      icon: <Palette className="w-8 h-8 text-white" />,
      title: "Customizable Experience",
      description: "Multiple themes, font options, and syntax highlighting for personalized coding. Make the editor truly yours.",
    },
    {
      icon: <Pencil className="w-8 h-8 text-white" />,
      title: "Collaborative Drawing",
      description: "Sketch and draw together in real-time to visualize your ideas. Perfect for architectural discussions and whiteboarding sessions.",
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Universal Language Support",
      description: "Code in any language with auto-detection and intelligent suggestions. From Python to Rust, we've got you covered.",
    }
  ];

  // Auto-rotate features every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Define types for auth data
  interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };
  }

  // Handle Google Sign In
const handleGoogleSignIn = () => {
  const popup = window.open(
    "http://localhost:3000/auth/google",
    "Google Login",
    "width=600,height=700"
  ) as Window | null;

  // Typed message handler to avoid implicit `any` errors
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== "http://localhost:3000") return;
    try {
      const data = event.data as AuthResponse;
      if (data && data.accessToken && data.refreshToken) {
        // Store tokens as needed
        console.log("Auth successful:", data.user);

        if (popup) popup.close();
        window.removeEventListener("message", handleMessage as EventListener);

        // Redirect to home or editor (example: "/")
        navigate("/"); // Or use: navigate(`/editor/${yourRoomId}`);
      }
    } catch (error) {
      console.error("Error processing auth response:", error);
    }
  };

  window.addEventListener("message", handleMessage as EventListener);
};


  // Manual navigation for features
  const goToFeature = (index: number) => {
    setCurrentFeatureIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SECTION - Features Showcase */}
      <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 -bottom-20 right-20"></div>
          <div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 top-20 left-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto w-full">
          {/* Logo and Title */}
          <div className="mb-12 text-center lg:text-left">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-9 h-9 text-blue-600" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white">CodeCollab</h1>
            </div>
            <p className="text-blue-100 text-xl lg:text-2xl font-light">
              The ultimate platform for real-time collaborative coding
            </p>
          </div>

          {/* Feature Cards Carousel - Only one visible at a time */}
          <div className="relative h-64 lg:h-72 mb-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                isActive={index === currentFeatureIndex}
              />
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center lg:justify-start space-x-2.5">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToFeature(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentFeatureIndex
                    ? 'w-10 h-3 bg-white shadow-lg'
                    : 'w-3 h-3 bg-white bg-opacity-40 hover:bg-opacity-70'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Authentication */}
      <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute w-96 h-96 bg-blue-200 rounded-full filter blur-3xl -top-20 -right-20"></div>
          <div className="absolute w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl -bottom-20 -left-20"></div>
        </div>

        <div
          className={`relative z-10 w-full max-w-md transform transition-all duration-700 ${
            isLoginVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-lg lg:text-xl">
              Sign in to start collaborating with your team
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 lg:p-10 backdrop-blur-sm bg-opacity-95">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-lg relative z-10">Sign in with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Secure authentication powered by OAuth 2.0
                </span>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-3 text-gray-700 group">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-medium">End-to-end encrypted sessions</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 group">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-medium">No password required</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 group">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:scale-125 transition-transform"></div>
                <span className="text-sm font-medium">Instant access to all features</span>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-gray-500 text-sm mt-8">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Custom animations in style tag */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;