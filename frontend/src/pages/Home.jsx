import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, Apple, CalendarHeart, Sparkles } from 'lucide-react';
import homeBg from '../assets/backgrounds/home_bg.png';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <>
      <div 
        className="bg-hero-pattern animate-fade-in opacity-85"
        style={{ backgroundImage: `url(${homeBg})` }}
      />
      <div className="overlay-gradient bg-white/10" />
      
      {/* Animated Decorative Elements */}
      <div className="fixed top-1/4 -left-20 w-80 h-80 bg-brand-400/20 blur-[120px] rounded-full animate-float" />
      <div className="fixed bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-indigo-400/20 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden hidden lg:block">
        <Sparkles className="absolute top-[10%] left-[15%] text-brand-200/40 w-12 h-12 animate-float" style={{ animationDelay: '1s' }} />
        <Activity className="absolute bottom-[20%] left-[8%] text-indigo-200/30 w-16 h-16 animate-float" style={{ animationDelay: '2s' }} />
        <Apple className="absolute top-[15%] right-[12%] text-emerald-200/30 w-14 h-14 animate-float" style={{ animationDelay: '0.5s' }} />
        <CalendarHeart className="absolute bottom-[15%] right-[10%] text-purple-200/20 w-20 h-20 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="flex flex-col items-center pt-20 pb-24 relative px-6">
        <div className="text-center max-w-4xl mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-bold text-sm mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Elevate Your Lifestyle</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[0.9]">
            The Future of <br />
            <span className="text-gradient">Personal Health</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            Experience a premium wellness platform designed to help you track fitness, master your diet, and grow stronger every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {currentUser ? (
              <Link to="/dashboard" className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-[2rem] font-black text-xl transition-all shadow-2xl hover:shadow-slate-500/30 transform hover:-translate-y-1 active:scale-95">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-brand-500/30 transform hover:-translate-y-1 active:scale-95">
                  Get Started Free
                </Link>
                <Link to="/login" className="glassmorphism hover:bg-white/80 text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xl transition-all shadow-xl transform hover:-translate-y-1 active:scale-95">
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-7xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <FeatureCard 
            icon={<Activity className="w-10 h-10 text-white" />}
            title="Fitness Intel"
            desc="Advanced tracking for your daily activities with high-performance analytics and visual goals."
            color="bg-brand-500"
          />
          <FeatureCard 
            icon={<Apple className="w-10 h-10 text-white" />}
            title="Smart Nutrition"
            desc="AI-powered meal logging and nutritional insights to fuel your body with precision and taste."
            color="bg-emerald-500"
          />
          <FeatureCard 
            icon={<CalendarHeart className="w-10 h-10 text-white" />}
            title="Pro Coaching"
            desc="Instant access to certified professionals and seamless appointment booking at your fingertips."
            color="bg-indigo-500"
          />
        </div>
      </div>
    </>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="glass-card p-10 group cursor-pointer relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 blur-[60px] group-hover:opacity-20 transition-opacity`} />
      <div className={`w-20 h-20 ${color} rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-${color.split('-')[1]}-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        {icon}
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
      <p className="text-lg text-slate-600 leading-relaxed font-medium">{desc}</p>
      <div className="mt-8 flex items-center text-slate-900 font-bold text-sm uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
        Learn More <span>→</span>
      </div>
    </div>
  );
}
